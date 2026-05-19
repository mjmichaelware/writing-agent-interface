"use client";

import React, { useState } from "react";
import { bus } from "@/core/runtimeEngine";

type StyleProfile = "LITERARY" | "CINEMATIC" | "HIGH_CONTRAST";

export default function StylesTab() {
  const [dualism, setDualism] = useState(52);
  const [archetype, setArchetype] = useState(38);
  const [motion, setMotion] = useState(64);
  const [warmth, setWarmth] = useState(42);
  const [profile, setProfile] = useState<StyleProfile>("LITERARY");

  const applyProfile = (next: StyleProfile) => {
    setProfile(next);
    if (next === "LITERARY") {
      setDualism(52);
      setArchetype(38);
      setMotion(44);
      setWarmth(55);
    }
    if (next === "CINEMATIC") {
      setDualism(76);
      setArchetype(68);
      setMotion(82);
      setWarmth(46);
    }
    if (next === "HIGH_CONTRAST") {
      setDualism(44);
      setArchetype(50);
      setMotion(24);
      setWarmth(18);
    }
  };

  const applySemanticResonance = () => {
    bus.emit("engine:semantic_parse", { dualism, archetype });
    bus.emit("nav:velocity_scroll", { speed: motion });
  };

  return (
    <div className="min-h-full p-6 text-[#e8e4dc] bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,.12),transparent_45%)]">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37]/70">Reader Customizations</div>
        <div className="mt-2 font-serif text-2xl italic">Tune the living page.</div>
        <p className="mt-3 text-sm leading-7 text-zinc-500">Adjust how symbolic pressure, archetypal resonance, motion, and warmth move through the manuscript layer.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {(["LITERARY", "CINEMATIC", "HIGH_CONTRAST"] as const).map((item) => (
          <button key={item} onClick={() => applyProfile(item)} className={`rounded-2xl border px-3 py-3 text-[9px] uppercase tracking-widest transition-all ${profile === item ? "border-[#d4af37]/60 bg-[#d4af37]/10 text-[#f6e7b4]" : "border-white/10 bg-black/30 text-zinc-600 hover:text-zinc-300 hover:border-white/20"}`}>
            {item.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {[
          ["Dualism Sensitivity", dualism, setDualism],
          ["Archetype Resonance", archetype, setArchetype],
          ["Motion Pressure", motion, setMotion],
          ["Page Warmth", warmth, setWarmth],
        ].map(([label, value, setter]) => (
          <label key={String(label)} className="block rounded-3xl border border-white/10 bg-black/35 p-5 shadow-2xl">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
              <span>{String(label)}</span>
              <span className="text-[#d4af37]">{Number(value)}%</span>
            </div>
            <input className="w-full accent-[#d4af37]" type="range" min="0" max="100" value={Number(value)} onChange={(e) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value))} />
          </label>
        ))}
      </div>

      <button onClick={applySemanticResonance} className="mt-6 w-full rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-[#f6e7b4] hover:bg-[#d4af37]/20 transition">
        Apply Semantic Resonance
      </button>
    </div>
  );
}
