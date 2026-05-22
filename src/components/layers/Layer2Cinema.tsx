"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { bus } from "@/core/runtimeEngine";

export default function Layer2Cinema({ chapterSlug }: { chapterSlug: string }) {
  const [intensity, setIntensity] = useState(0.4);

  useEffect(() => {
    return bus.on('cinema:setIntensity', (val: number) => setIntensity(val));
  }, []);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <div 
        className="absolute inset-[-10%] transition-opacity duration-[2000ms] ease-out will-change-transform"
        style={{ opacity: intensity }}
      >
        <Image
          src="/assets/bg.png"
          alt="Cinematic Backdrop"
          fill
          className="object-cover w-full h-full scale-[1.12]"
          priority
        />
      </div>
      {/* Feature 140: Prestige Vertical Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
    </div>
  );
}
