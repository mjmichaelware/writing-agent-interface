"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { resolveAsset } from "@/data/cinema";
import { bus } from "@/core/runtimeEngine";

export default function Layer2Cinema({ chapterSlug, blocks = [] }: { chapterSlug: string; blocks?: string[] }) {
  const [asset, setAsset] = useState(() => resolveAsset("", chapterSlug));
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleFocus = (data: { paraIndex: string | number }) => {
      const idx = typeof data.paraIndex === "string" ? parseInt(data.paraIndex, 10) : data.paraIndex;
      if (!isNaN(idx) && blocks[idx]) {
        const newAsset = resolveAsset(blocks[idx], chapterSlug);
        setAsset(newAsset);
      }
    };
    
    const unsubscribe = bus.on("scroll:focus", handleFocus);
    return () => unsubscribe();
  }, [blocks, chapterSlug]);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.beta || !e.gamma) return;
      // beta ranges from -180 to 180 (front to back)
      // gamma ranges from -90 to 90 (left to right)
      
      const maxTilt = 15; // Max translation in px
      const x = Math.min(Math.max(e.gamma / 2, -maxTilt), maxTilt);
      const y = Math.min(Math.max((e.beta - 45) / 2, -maxTilt), maxTilt);
      
      setTilt({ x, y });
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <div 
        className="absolute inset-[-5%] transition-all duration-[1400ms] ease-out will-change-transform"
        style={{ transform: `translate3d(${tilt.x * -1}px, ${tilt.y * -1}px, 0) scale(1.05)` }}
      >
        <Image
          key={asset}
          src={asset}
          alt="Cinematic Backdrop"
          fill
          className="object-cover w-full h-full opacity-60 animate-fade-slow"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />
    </div>
  );
}
