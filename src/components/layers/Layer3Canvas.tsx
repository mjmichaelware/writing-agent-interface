"use client";
import React, { useEffect, useState } from "react";
import ManuscriptCore from "./canvas/ManuscriptCore";
import { bus } from "@/core/runtimeEngine";
import ReaderControlPanel from "./controls/ReaderControlPanel";
import { DEFAULT_READER_CONTROLS, readerFontStack, type ReaderControls } from "@/runtime/readerControls";

export default function Layer3Canvas({ chapterData }: { chapterData: any }) {
  const [controls, setControls] = useState<ReaderControls>(DEFAULT_READER_CONTROLS);

  // Guard Clause: If data is null or blocks missing, render a neutral state
  if (!chapterData || !chapterData.blocks || chapterData.blocks.length === 0) {
    return (
      <div className="relative z-20 w-full min-h-screen flex justify-center items-center font-serif text-[var(--text-muted)]">
        This chapter is not yet available.
      </div>
    );
  }

  useEffect(() => {
    const onNav = (_data: { speed: number }) => {
      if (!controls.motion) return;
      
      const blur = Math.max(0, Math.min(8, controls.blur * 8));
      const scale = 1 - Math.max(0, Math.min(0.04, controls.distortion * 0.04));
      const opacity = 1 - Math.max(0, Math.min(0.35, controls.sensitivity * 0.35));
      
      // Apply distortions to the root element temporarily for navigation effect
      document.body.style.filter = `blur(${blur}px) contrast(${controls.contrast}) saturate(${1 + controls.colorShift}) sepia(${controls.warmth})`;
      document.body.style.transform = `scale(${scale})`;
      document.body.style.opacity = String(opacity);
      window.scrollTo({ top: 0, behavior: "smooth" });

      window.setTimeout(() => {
        document.body.style.filter = `blur(0px) contrast(${controls.contrast}) saturate(${1 + controls.colorShift}) sepia(${controls.warmth})`;
        document.body.style.transform = "scale(1)";
        document.body.style.opacity = "1";
      }, 800);
    };

    const unsubscribe = bus.on("nav:velocity_scroll", onNav);
    return () => { unsubscribe(); };
  }, [controls]);

  return (
    <div
      className="relative z-20 w-full min-h-screen transition-all duration-500 will-change-[transform,filter,opacity]"
      style={{
        fontFamily: readerFontStack(controls.font),
        fontSize: `${controls.fontScale}rem`,
        lineHeight: controls.lineHeight,
        filter: `contrast(${controls.contrast}) saturate(${1 + controls.colorShift}) sepia(${controls.warmth})`,
        ["--reader-font-scale" as any]: controls.fontScale,
        ["--reader-line-height" as any]: controls.lineHeight,
        ["--reader-sensitivity" as any]: controls.sensitivity,
        ["--reader-color-shift" as any]: controls.colorShift,
        ["--reader-distortion" as any]: controls.distortion,
        ["--reader-blur" as any]: controls.blur,
        ["--reader-contrast" as any]: controls.contrast,
        ["--reader-warmth" as any]: controls.warmth,
      }}
    >
      <div className="w-full min-h-full relative">
        <ManuscriptCore blocks={chapterData.blocks} chapterSlug={chapterData.slug} />
      </div>
      <ReaderControlPanel controls={controls} setControls={setControls} />
    </div>
  );
}