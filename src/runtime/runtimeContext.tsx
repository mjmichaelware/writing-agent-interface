"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { EventBus, RuntimeEngine } from '@/core/runtimeEngine';

interface RuntimeContextValue {
  bus: EventBus;
  engine: RuntimeEngine;
}

const RuntimeContext = createContext<RuntimeContextValue | null>(null);

let busInstance: EventBus | null = null;
let engineInstance: RuntimeEngine | null = null;

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  const bus = useMemo(() => {
    if (!busInstance) busInstance = new EventBus();
    return busInstance;
  }, []);
  const engine = useMemo(() => {
    if (!engineInstance) engineInstance = new RuntimeEngine(bus);
    return engineInstance;
  }, [bus]);

  return (
    <RuntimeContext.Provider value={{ bus, engine }}>
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntime() {
  const context = useContext(RuntimeContext);
  if (!context) throw new Error("useRuntime must be used within a RuntimeProvider");
  return context;
}

// Fixed: Exporting getRuntime to satisfy other pages (like Reader)
export function getRuntime() {
  if (!busInstance) busInstance = new EventBus();
  if (!engineInstance) engineInstance = new RuntimeEngine(busInstance);
  return { bus: busInstance, engine: engineInstance };
}

