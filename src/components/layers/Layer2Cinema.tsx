"use client";

import React from "react";
import { CINEMA_ASSETS, CINEMA_PARAGRAPHS_PER_IMAGE } from "@/data/cinema";

interface Layer2CinemaProps {
  chapter: number;
  activePara: number;
  depth: number;
}

export default function Layer2Cinema({ chapter, activePara, depth }: Layer2CinemaProps) {
  const assets = CINEMA_ASSETS[String(chapter)] || ["/bg.png"];
  const imgIndex = Math.min(assets.length - 1, Math.floor(activePara / CINEMA_PARAGRAPHS_PER_IMAGE));

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
