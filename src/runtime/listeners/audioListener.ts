import { bus } from "@/core/runtimeEngine";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

let currentIntensity = 0;
let rafId: number | null = null;

export function initAudioListener() {
  return bus.on("scroll:focus", (data: any) => {
    if (typeof window === "undefined") return;

    const index = Number.parseInt(String(data?.paraIndex ?? 0), 10) || 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Narrative intensity builds through the descent arc
    const targetIntensity = Math.min(1, 0.1 + index / 40);

    if (reducedMotion) {
      currentIntensity = targetIntensity;
      document.documentElement.style.setProperty("--audio-focus-index", String(index));
      document.documentElement.style.setProperty("--audio-intensity", targetIntensity.toFixed(4));
      bus.emit("audio:tone", { paraIndex: index, intensity: targetIntensity });
      return;
    }

    if (rafId) cancelAnimationFrame(rafId);

    const animate = () => {
      currentIntensity = lerp(currentIntensity, targetIntensity, 0.08);

      document.documentElement.style.setProperty("--audio-focus-index", String(index));
      document.documentElement.style.setProperty(
        "--audio-intensity",
        currentIntensity.toFixed(4)
      );

      if (Math.abs(currentIntensity - targetIntensity) > 0.001) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };

    rafId = requestAnimationFrame(animate);
    bus.emit("audio:tone", { paraIndex: index, intensity: targetIntensity });
  });
}
