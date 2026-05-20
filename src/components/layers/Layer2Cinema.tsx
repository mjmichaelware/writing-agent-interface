"use client";

import React from "react";
import Image from "next/image";

export default function Layer2Cinema({ chapterSlug }: { chapterSlug: string }) {
  // Asset registry mapping
  const assets: Record<string, string> = {
    "1": "/assets/bg.png",
    "7": "/assets/moonlight.jpg",
  };

  const asset = assets[chapterSlug] || "/assets/bg.png";

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      <Image
        src={asset}
        alt="Cinematic Backdrop"
        fill
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}

