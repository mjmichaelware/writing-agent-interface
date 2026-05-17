"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Layer2CinemaProps {
  chapter: number | null;
  activePara: number;
  depth: number;
}

type CinemaFrame = {
  src: string;
  triggerPara: number;
};

export default function Layer2Cinema({
  chapter,
  activePara,
  depth
}: Layer2CinemaProps) {
  /**
   * CINEMATIC REGISTRY
   * No maskImage usage.
   * No image multiply blending.
   */

  const CINEMA_ASSETS: Record<string, CinemaFrame[]> = useMemo(
    () => ({
      "7": [
        { src: "/assets/bg.png", triggerPara: 0 },

        { src: "/assets/flies.jpg", triggerPara: 18 },

        { src: "/assets/megiddo1.jpg", triggerPara: 35 },

        { src: "/assets/megiddo2.jpg", triggerPara: 55 }
      ]
    }),
    []
  );

  const currentAssets =
    chapter && CINEMA_ASSETS[String(chapter)]
      ? CINEMA_ASSETS[String(chapter)]
      : [{ src: "/assets/bg.png", triggerPara: 0 }];

  let activeIndex = 0;

  for (let i = 0; i < currentAssets.length; i++) {
    if (activePara >= currentAssets[i].triggerPara) {
      activeIndex = i;
    }
  }

  const isTitlePage = depth < 0.03 && !chapter;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden select-none">
      <div className="absolute inset-0 bg-[var(--bg-void)] opacity-40" />

      {currentAssets.map((asset, index) => {
        const targetOpacity =
          isTitlePage && index === 0
            ? 1
            : activeIndex === index
              ? 0.35
              : 0;

        return (
          <motion.img
            key={`${chapter || "cover"}-${index}`}
            src={asset.src}
            alt="Cinematic Frame"
            className="absolute inset-0 w-full h-full object-cover will-change-[opacity]"
            initial={{ opacity: 0 }}
            animate={{ opacity: targetOpacity }}
            transition={{
              duration: 2.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              mixBlendMode: "normal",
              filter: isTitlePage
                ? "brightness(0.85) contrast(1.1)"
                : "brightness(0.62) contrast(1.08)"
            }}
          />
        );
      })}
    </div>
  );
}
