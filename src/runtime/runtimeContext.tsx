"use client";

import { createContext, useContext, type ReactNode } from "react";
import { bus } from "@/core/runtimeEngine";

export const runtime = {
  bus,
  emit: bus.emit.bind(bus),
  on: bus.on.bind(bus),
  off: bus.off.bind(bus),
};

export function getRuntime() {
  return runtime;
}

const RuntimeContext = createContext<typeof runtime>(runtime);

export function RuntimeProvider({ children }: { children: ReactNode }) {
  return (
    <RuntimeContext.Provider value={runtime}>
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntime() {
  return useContext(RuntimeContext);
}
