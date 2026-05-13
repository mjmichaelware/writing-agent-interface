import { EventBus } from "@/core/runtimeEngine";

export function initAudioListener(bus: EventBus) {
  bus.on("block:render", (block: any) => {
    const tone = block?.tone;
    const intensity = tone === "sacred" ? 0.8 : tone === "intense" ? 1.0 : 0.4;
    console.log("[AUDIO] tone:", tone, "intensity:", intensity);
  });

  bus.on("scroll:update", (data: any) => {
    const depth = data.depth;
    const volumeCurve = Math.min(1, 0.3 + depth * 0.15);
    console.log("[AUDIO] scroll depth:", depth, "volume:", volumeCurve);
  });
}
