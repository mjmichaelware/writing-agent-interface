"use client";
import React, { useEffect, useState } from "react";
import ManuscriptCore from "@/components/ManuscriptCore";
import { useNarrative } from "@/context/NarrativeContext";
import ReaderControlPanel from "./controls/ReaderControlPanel";
import { DEFAULT_READER_CONTROLS, readerFontStack, type ReaderControls } from "@/runtime/readerControls";

export default function Layer3Canvas({ chapterId }: { chapterId: string | null }) {
  const [controls, setControls] = useState<ReaderControls>(DEFAULT_READER_CONTROLS);
  const { state } = useNarrative();
  const { archetypalWeights } = state;

  const mass = archetypalWeights.shadow || 0;
  const tension = archetypalWeights.persona || 0;
  const drift = archetypalWeights.anima || 0;

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
        ["--arc-mass" as any]: `${mass * 20}px`,
        ["--arc-tension" as any]: `${1 + tension}`,
        ["--arc-drift" as any]: `${drift * 10}px`,
      }}
    >
      <div className="w-full min-h-full relative">
        {chapterId && <ManuscriptCore chapterId={chapterId} />}
      </div>
      <ReaderControlPanel controls={controls} setControls={setControls} />
    </div>
  );
}