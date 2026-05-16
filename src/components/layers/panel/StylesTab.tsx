"use client";

import React from "react";

interface StylesTabProps {
  state: any;
  update: (fields: any) => void;
}

export default function StylesTab({ state, update }: StylesTabProps) {
  const colorFields = [
    { key: "baseColor", label: "Base text color" },
    { key: "descentColor", label: "Trauma prose / text color" },
    { key: "sacredColor", label: "Sacred keyword links" },
    { key: "properColor", label: "Proper nouns / bold tags" },
  ];

  return (
    <div className="space-y-5 px-1">
      <section>
        <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 mb-4 font-mono font-bold">// GLOBAL THEMATIC REFLECTION</p>
        <div className="space-y-3">
          {colorFields.map((c) => (
            <div key={c.key} className="flex items-center justify-between p-2.5 bg-zinc-900/20 border border-zinc-900/50 rounded-xs">
              <label className="text-xs text-zinc-400 font-sans">{c.label}</label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-600 uppercase">{state[c.key]}</span>
                <input 
                  type="color" 
                  value={state[c.key] || "#ffffff"} 
                  onChange={(e) => update({ [c.key]: e.target.value })} 
                  className="w-7 h-6 bg-transparent border border-zinc-800 cursor-pointer rounded-xs" 
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
