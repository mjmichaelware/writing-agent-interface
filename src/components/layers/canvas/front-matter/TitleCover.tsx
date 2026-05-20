"use client";

import React from "react";
import { bus } from "@/core/runtimeEngine";

export default function TitleCover() {
  const onBeginReading = () => {
    bus.emit("scroll:focus", { paraIndex: "1" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4 relative z-20">
      <h1 className="font-hebrew text-[clamp(3rem,12vw,9rem)] leading-[0.85] text-[var(--sacred,#e8d4a0)] tracking-wide drop-shadow-2xl mb-8 animate-ethereal-breathe">
        THE WEIGHT
        <br />
        OF THE
        <br />
        SKY
      </h1>

      <p className="font-serif text-[clamp(1rem,3vw,1.5rem)] text-[var(--text-muted,#8a857c)] mb-16 tracking-[0.2em] uppercase">
        Michael Alonza P. Ware
      </p>

      <button
        onClick={onBeginReading}
        className="font-serif text-[var(--accent-gold,#c9a96e)] border-b border-[var(--accent-gold,#c9a96e)] pb-1 hover:text-[var(--sacred,#e8d4a0)] hover:border-[var(--sacred,#e8d4a0)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] uppercase tracking-[0.3em] text-xs md:text-sm"
      >
        Begin Reading
      </button>
    </div>
  );
}
