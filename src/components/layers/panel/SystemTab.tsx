"use client";

import React, { useState } from "react";

export default function SystemTab() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const submitPin = (value: string) => {
    if (value === "1003") {
      setTimeout(() => setUnlocked(true), 300);
      return;
    }
    setError(true);
    setTimeout(() => { setPin(""); setError(false); }, 500);
  };

  const handleKey = (key: string) => {
    if (error) return;
    if (key === "DEL") {
      setPin((current) => current.slice(0, -1));
      return;
    }
    if (key === "ENT") {
      if (pin.length === 4) submitPin(pin);
      return;
    }
    if (!/^\d$/.test(key) || pin.length >= 4) return;
    const nextPin = pin + key;
    setPin(nextPin);
    if (nextPin.length === 4) submitPin(nextPin);
  };

  if (unlocked) {
    return (
      <div className="p-8 animate-in fade-in duration-700">
        <h3 className="font-mono text-[10px] text-emerald-500 tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          IWritingAgent: Online
        </h3>
        <button className="w-full text-left p-4 border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/50 transition-colors">
          <span className="block font-serif text-zinc-300">Access 181 Concordance Nodes</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h2 className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 mb-4">SYSTEM GATEWAY</h2>
        <div className="flex gap-4 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${error ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" : i < pin.length ? "bg-zinc-200 shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "bg-zinc-800"}`} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "DEL", "0", "ENT"].map((key) => (
          <button key={key} onClick={() => handleKey(key)} className="aspect-square font-mono text-sm text-zinc-400 border border-zinc-800/30 bg-[#070709] hover:bg-zinc-800 transition-all">
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
