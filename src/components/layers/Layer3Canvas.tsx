"use client";
import React, { useEffect, useRef, useState } from "react";
import ManuscriptCore from "./canvas/ManuscriptCore";
import { bus } from "@/core/runtimeEngine";
import ReaderControlPanel from "./controls/ReaderControlPanel";
import { DEFAULT_READER_CONTROLS, readerFontStack, type ReaderControls } from "@/runtime/readerControls";

export default function Layer3Canvas({ chapterData }: { chapterData: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [controls, setControls] = useState<ReaderControls>(DEFAULT_READER_CONTROLS);

  // Guard Clause: If data is null or blocks missing, render a neutral state
  if (!chapterData || !chapterData.blocks || chapterData.blocks.length === 0) {
    return (
      <div className="fixed inset-0 z-20 bg-transparent flex justify-center items-center font-serif text-[var(--text-muted)]">
        Awaiting Manifest Data...
      </div>
    );
  }

  useEffect(() => {
    const onNav = (_data: { speed: number }) => {
      const el = scrollRef.current;
      if (!el || !controls.motion) return;
      
      const blur = Math.max(0, Math.min(8, controls.blur * 8));
      const scale = 1 - Math.max(0, Math.min(0.04, controls.distortion * 0.04));
      const opacity = 1 - Math.max(0, Math.min(0.35, controls.sensitivity * 0.35));
      
      el.style.filter = `blur(${blur}px) contrast(${controls.contrast}) saturate(${1 + controls.colorShift}) sepia(${controls.warmth})`;
      el.style.transform = `scale(${scale})`;
      el.style.opacity = String(opacity);
      el.scrollTo({ top: 0, behavior: "smooth" });

      window.setTimeout(() => {
        el.style.filter = `blur(0px) contrast(${controls.contrast}) saturate(${1 + controls.colorShift}) sepia(${controls.warmth})`;
        el.style.transform = "scale(1)";
        el.style.opacity = "1";
      }, 800);
    };

    const unsubscribe = bus.on("nav:velocity_scroll", onNav);
    return () => { unsubscribe(); };
  }, [controls]);

  return (
    <div className="fixed inset-0 z-20 overflow-hidden bg-transparent">
      <div
        ref={scrollRef}
        className="relative h-full overflow-y-auto overflow-x-hidden transition-all duration-500 will-change-[transform,filter,opacity]"
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
      </div>
      <ReaderControlPanel controls={controls} setControls={setControls} />
    </div>
  );
}
