"use client";

import React from "react";
import { bus } from "@/core/runtimeEngine";

export default function TitleCover() {
  const onBeginReading = () => {
    bus.emit("scroll:focus", { paraIndex: "1" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] text-center px-4 relative z-20">
      <h1 className="title-display mb-12 animate-ethereal-breathe">
        THE WEIGHT
        <br />
        OF THE
        <br />
        SKY
      </h1>

      <p className="font-serif text-[clamp(1rem,2.5vw,1.25rem)] text-[var(--text-muted,#8a857c)] mb-20 tracking-[0.25em] uppercase">
        Michael Alonza P. Ware
      </p>

      <button
        onClick={onBeginReading}
        className="primary-button uppercase tracking-[0.3em] text-xs"
      >
        Begin Reading
      </button>
    </div>
  );
}
