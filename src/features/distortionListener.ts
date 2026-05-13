import { EventBus } from "@/core/runtimeEngine";

export function initDistortionListener(bus: EventBus) {
  bus.on("block:render", (block: any) => {
    const intensity = block?.tone === "intense" ? 1 : block?.tone === "sacred" ? 0.7 : 0.3;
    console.log("[DISTORTION] tone intensity:", intensity);
  });

  bus.on("scroll:update", (data: any) => {
    const depth = data.depth;
    const warp = depth * 0.1;
    console.log("[DISTORTION] scroll depth:", depth, "warp:", warp);
  });
}
