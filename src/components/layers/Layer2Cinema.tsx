"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { resolveAsset } from "@/data/cinema";
import { useNarrative } from "@/context/NarrativeContext";

export default function Layer2Cinema({ chapterSlug }: { chapterSlug: string }) {
  const { state } = useNarrative();
  const { archetypalWeights } = state;
  const [asset, setAsset] = useState(() => resolveAsset("", chapterSlug));
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Feature 85: Dynamic Cinematic Background Switcher
  // Driven by archetypal weights instead of keyword matching
  useEffect(() => {
    // Logic to select asset based on weights
    // For now, we still use resolveAsset but could pass weights to it
    const newAsset = resolveAsset("", chapterSlug);
    setAsset(newAsset);
  }, [archetypalWeights, chapterSlug]);

  // Feature 121: Gyroscopic Parallax
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!e.beta || !e.gamma) return;
      const maxTilt = 20; 
      const x = Math.min(Math.max(e.gamma / 1.5, -maxTilt), maxTilt);
      const y = Math.min(Math.max((e.beta - 45) / 1.5, -maxTilt), maxTilt);
      setTilt({ x, y });
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[var(--bg-void)]">
      <div 
        className="absolute inset-[-10%] transition-all duration-[2000ms] ease-out will-change-transform"
        style={{ transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0) scale(1.12)` }}
      >
        <Image
          key={asset}
          src={asset}
          alt="Cinematic Backdrop"
          fill
          className="object-cover w-full h-full opacity-40 animate-fade-slow"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90" />
    </div>
  );
}
