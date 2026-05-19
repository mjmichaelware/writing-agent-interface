"use client";

import React, { useState } from "react";

const sections = [
  { id: "chapter", title: "Current Chapter", body: "Continue through the active manuscript stream." },
  { id: "manifest", title: "Manifest", body: "Navigate the narrative architecture and chapter field." },
  { id: "search", title: "Search", body: "Search motifs, places, people, and symbolic repetitions." },
  { id: "settings", title: "Reader Settings", body: "Tune typography, motion, warmth, contrast, and kinetic sensitivity." },
];

export default function IndexTab() {
  const [active, setActive] = useState(sections[0]);

  return (
    <div className="min-h-full p-6 text-[#e8e4dc] bg-[radial-gradient(circle_at_top,rgba(212,175,55,.08),transparent_45%)]">
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37]/70">Index</div>
        <div className="mt-2 font-serif text-2xl italic">The reader&apos;s map of the field.</div>
      </div>
      <div className="grid gap-3">
        {sections.map((section) => (
          <button key={section.id} onClick={() => setActive(section)} className={`rounded-2xl border p-4 text-left transition-all duration-300 ${active.id === section.id ? "border-[#d4af37]/60 bg-[#d4af37]/10 text-[#f6e7b4]" : "border-white/10 bg-black/30 text-zinc-400 hover:text-white hover:border-white/20"}`}>
            <div className="font-serif text-lg">{section.title}</div>
            <div className="mt-1 text-xs leading-5 text-zinc-500">{section.body}</div>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-black/40 p-5 shadow-2xl">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500">Selected</div>
        <div className="mt-2 font-serif text-xl">{active.title}</div>
        <p className="mt-3 text-sm leading-7 text-zinc-400">{active.body}</p>
      </div>
    </div>
  );
}
