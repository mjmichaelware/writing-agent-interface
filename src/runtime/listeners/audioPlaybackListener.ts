import { bus } from "@/core/runtimeEngine";
import { Howl } from 'howler';

let currentSound: Howl | null = null;
let isEnabled = false;

export function initAudioPlaybackListener() {
  const unsubToggle = bus.on("audio:toggle_tts", (enabled: boolean) => {
    isEnabled = enabled;
    if (!enabled && currentSound) {
      currentSound.stop();
    }
  });

  const unsubFocus = bus.on("scroll:focus", async (data: any) => {
    if (!isEnabled || !data.content || data.sectionId) return;

    if (currentSound) {
      currentSound.fade(1, 0, 1000);
      const oldSound = currentSound;
      setTimeout(() => oldSound.unload(), 1000);
    }

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.content })
      });

      if (!response.ok) throw new Error("TTS failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      currentSound = new Howl({
        src: [url],
        format: ['mp3'],
        autoplay: true,
        onend: () => {
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error("Audio playback failed:", err);
    }
  });

  return () => {
    unsubToggle();
    unsubFocus();
    if (currentSound) currentSound.unload();
  };
}
