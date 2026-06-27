import { bus } from "@/core/runtimeEngine";
let audioContext: AudioContext | null = null;
let activeSource: AudioBufferSourceNode | null = null;
let activeGain: GainNode | null = null;
let activeRequest: AbortController | null = null;
let hasUserInteracted = false;

function isAudioEnabled() {
  return document.documentElement.style.getPropertyValue("--audio-enabled").trim() === "1";
}

function ensureAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  return audioContext;
}

async function decodeBase64Audio(audioBase64: string) {
  const ctx = ensureAudioContext();
  if (!ctx) {
    throw new Error("Web Audio API unavailable");
  }

  const bytes = Uint8Array.from(atob(audioBase64), (char) => char.charCodeAt(0));
  const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
  return { ctx, audioBuffer };
}

function stopPlayback() {
  if (activeSource) {
    try {
      activeSource.stop();
    } catch {}
    activeSource.disconnect();
    activeSource = null;
  }

  if (activeGain) {
    activeGain.disconnect();
    activeGain = null;
  }
}

async function playAudio(audioBase64: string) {
  const { ctx, audioBuffer } = await decodeBase64Audio(audioBase64);
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  stopPlayback();

  const gain = ctx.createGain();
  gain.gain.value = 1;
  gain.connect(ctx.destination);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(gain);
  source.start(0);
  source.onended = () => {
    if (activeSource === source) {
      activeSource = null;
    }
    if (activeGain === gain) {
      activeGain.disconnect();
      activeGain = null;
    }
  };

  activeSource = source;
  activeGain = gain;
}

export function initAudioPlaybackListener() {
  if (typeof window === "undefined") return () => {};

  const markInteraction = () => {
    hasUserInteracted = true;
  };

  window.addEventListener("pointerdown", markInteraction, { passive: true });
  window.addEventListener("keydown", markInteraction, { passive: true });

  const unsubToggle = bus.on("audio:toggle_tts", (enabled: boolean) => {
    document.documentElement.style.setProperty("--audio-enabled", enabled ? "1" : "0");
    if (!enabled) {
      activeRequest?.abort();
      activeRequest = null;
      stopPlayback();
    }
  });

  const unsubFocus = bus.on("scroll:focus", async (data: any) => {
    if (!isAudioEnabled() || !hasUserInteracted || !data?.content || data?.sectionId) return;

    activeRequest?.abort();
    const controller = new AbortController();
    activeRequest = controller;

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("TTS failed");

      const payload = await response.json();
      const audioBase64 = String(payload?.audioBase64 ?? "");

      if (!audioBase64) {
        throw new Error("TTS returned no audio");
      }

      if (activeRequest !== controller || !isAudioEnabled()) {
        return;
      }

      await playAudio(audioBase64);
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("Audio playback failed:", err);
      }
    } finally {
      if (activeRequest === controller) {
        activeRequest = null;
      }
    }
  });

  return () => {
    unsubToggle();
    unsubFocus();
    activeRequest?.abort();
    activeRequest = null;
    stopPlayback();
    window.removeEventListener("pointerdown", markInteraction);
    window.removeEventListener("keydown", markInteraction);
  };
}
