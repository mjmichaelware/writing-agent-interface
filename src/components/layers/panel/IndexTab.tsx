
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
        <div className="mt-2 font-serif text-2xl italic">The reader’s map
