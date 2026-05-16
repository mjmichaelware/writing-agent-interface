"use client";

import React from "react";

interface Layer2CinemaProps {
  chapter: number;
  activePara: number;
  depth: number;
}

export default function Layer2Cinema({ chapter, activePara, depth }: Layer2CinemaProps) {
  // Explicitly binds your stardust background cover and narrative beat photo assets to the engine loop
  const baseAssets: Record<string, string[]> = {
    "6": ["/bg.png", "/assets/agent-photos/flies.jpg"],
    "7": ["/bg.png", "/assets/agent-photos/flies.jpg", "/assets/agent-photos/megiddo1.jpg", "/assets/agent-photos/megiddo2.jpg"],
    "8": ["/bg.png", "/assets/agent-photos/megiddo1.jpg", "/assets/agent-photos/megiddo2.jpg"]
  };

  const assets = baseAssets[String(chapter)] || ["/bg.png"];
  // Swaps assets cleanly every 8 paragraphs as the reader descends down the manuscript track
  const imgIndex = Math.min(assets.length - 1, Math.floor(activePara / 8));

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {assets.map((src, i) => (
        <img
          key={src + i}
          src={depth < 0.03 ? "/bg.png" : src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === imgIndex ? Math.max(0.2, 0.75 - depth * 0.4) : 0,
            transition: "opacity 1500ms ease-in-out",
            filter: `grayscale(0.2) contrast(1.05) brightness(${Math.max(0.35, 0.95 - depth * 0.45)})`,
          }}
          onError={(e) => {
            e.currentTarget.src = "/bg.png";
          }}
        />
      ))}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/95"
        style={{ transition: "background 1000ms" }}
      />
    </div>
  );
}
