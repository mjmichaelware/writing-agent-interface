"use client";

import React from "react";

function seeded(n: number) {
  const x = Math.sin(n + 1) * 10000;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 80 }, (_, i) => ({
  left:     seeded(i * 3 + 1) * 100,
  top:      seeded(i * 3 + 2) * 100,
  size:     0.5 + seeded(i * 3 + 3) * 1.6,
  delay:    seeded(i * 7 + 5) * 11,
  duration: 3 + seeded(i * 5 + 4) * 7,
  max:      0.1 + seeded(i * 11 + 6) * 0.52,
}));

export default function Layer1Void() {
  return (
    <div className="fixed inset-0 bg-[var(--bg-void)] z-0 pointer-events-none overflow-hidden">
      {STARS.map((s, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            background: "rgba(201, 169, 110, 1)",
            ["--star-max" as string]: s.max,
            animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            boxShadow: s.size > 1.3 ? `0 0 ${s.size * 2.5}px rgba(201,169,110,0.45)` : "none",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
