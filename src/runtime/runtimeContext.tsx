"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { EventBus, RuntimeEngine } from '@/core/runtimeEngine';

interface RuntimeContextValue {
  bus: EventBus;
  engine: RuntimeEngine;
}

const RuntimeContext = createContext<RuntimeContextValue | null>(null);

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  const bus = useMemo(() => new EventBus(), []);
  const engine = useMemo(() => new RuntimeEngine(bus), [bus]);

  return (
    <RuntimeContext.Provider value={{ bus, engine }}>
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntime() {
  const context = useContext(RuntimeContext);
  if (!context) {
    throw new Error("useRuntime must be used within a RuntimeProvider");
  }
  return context;
}

