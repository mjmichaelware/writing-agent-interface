"use client";

import { EventBus, RuntimeEngine } from "@/core/runtimeEngine";

let busInstance: EventBus | null = null;
let engineInstance: RuntimeEngine | null = null;

export function getRuntime() {
  if (!busInstance) {
    busInstance = new EventBus();
    engineInstance = new RuntimeEngine(busInstance);
  }

  return {
    bus: busInstance,
    engine: engineInstance!,
  };
}
