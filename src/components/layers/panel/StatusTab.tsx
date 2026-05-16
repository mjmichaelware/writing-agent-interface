"use client";

import React from "react";

export default function StatusTab() {
  return (
    <div className="space-y-4 font-mono text-[11px]">
      <div className="p-4 bg-zinc-900/30 border border-zinc-900/80 rounded-xs text-zinc-400 space-y-2 shadow-inner">
        <p className="text-cyan-400 font-bold tracking-wider mb-1">// SYSTEM RUNTIME METRICS</p>
        <p>OPERATOR: <span className="text-zinc-200 font-sans font-medium">Michael Alonza Prentice Ware</span></p>
        <p>CORE SYSTEM STATE: <span className="text-emerald-400 font-bold">v10.1 Active</span></p>
        <p>CONCORDANCE: <span className="text-zinc-200">181 Active Nodes Verified</span></p>
        <p>COMPILER STATUS: <span className="text-cyan-400 font-medium">Flawless (0 Errors)</span></p>
      </div>
    </div>
  );
}
