import { EventBus } from "@/core/runtimeEngine";

export function initThematicListener(bus: EventBus) {
  bus.on("chapter:load", (chapter: any) => {
    console.log("[THEME] chapter", chapter?.id, "loaded");
  });

  bus.on("state:change", (state: any) => {
    const mode = state.mode === "cinematic" ? "MYTHIC_OVERLAY" : "BASELINE_NARRATIVE";
    console.log("[THEME] mode:", mode, "block:", state.blockIndex);
  });
}
