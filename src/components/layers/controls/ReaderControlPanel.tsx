"use client";

import React from "react";
import type { ReaderControls, ReaderFont } from "@/runtime/readerControls";
import { DEFAULT_READER_CONTROLS } from "@/runtime/readerControls";

type Props = {
  controls: ReaderControls;
  setControls: React.Dispatch<React.SetStateAction<ReaderControls>>;
};

export default function ReaderControlPanel({ controls, setControls }: Props) {
  const update = <K extends keyof ReaderControls>(key: K, value: ReaderControls[K]) => {
    setControls((current) => ({ ...current, [key]: value }));
  };

  const fonts: ReaderFont[] = ["serif", "sans", "mono"];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-4 text-[#e8e4dc] shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="font-serif italic text-sm opacity-80">Reader Physics</div>
        <button onClick={() => setControls(DEFAULT_READER_CONTROLS)} className="text-[10px] tracking-widest text-zinc-500 hover:text-zinc-200">RESET</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {fonts.map((font) => (
          <button key={font} onClick={() => update("font", font)} className={`rounded-full border px-3 py-2 text-xs capitalize transition ${controls.font === font ? "border-[#e8e4dc] text-[#e8e4dc]" : "border-white/10 text-zinc-500"}`}>{font}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 text-[10px] tracking-widest uppercase text-zinc-500">
        <label>Type Size<input className="w-full accent-zinc-200" type="range" min="0.85" max="1.45" step="0.01" value={controls.fontScale} onChange={(e) => update("fontScale", Number(e.target.value))} /></label>
        <label>Line Height<input className="w-full accent-zinc-200" type="range" min="1.35" max="2.2" step="0.01" value={controls.lineHeight} onChange={(e) => update("lineHeight", Number(e.target.value))} /></label>
        <label>Sensitivity<input className="w-full accent-zinc-200" type="range" min="0" max="1" step="0.01" value={controls.sensitivity} onChange={(e) => update("sensitivity", Number(e.target.value))} /></label>
        <label>Color<input className="w-full accent-zinc-200" type="range" min="0" max="1" step="0.01" value={controls.colorShift} onChange={(e) => update("colorShift", Number(e.target.value))} /></label>
        <label>Distortion<input className="w-full accent-zinc-200" type="range" min="0" max="1" step="0.01" value={controls.distortion} onChange={(e) => update("distortion", Number(e.target.value))} /></label>
        <label>Blur<input className="w-full accent-zinc-200" type="range" min="0" max="1" step="0.01" value={controls.blur} onChange={(e) => update("blur", Number(e.target.value))} /></label>
        <label>Contrast<input className="w-full accent-zinc-200" type="range" min="0.75" max="1.5" step="0.01" value={controls.contrast} onChange={(e) => update("contrast", Number(e.target.value))} /></label>
        <label>Warmth<input className="w-full accent-zinc-200" type="range" min="0" max="0.75" step="0.01" value={controls.warmth} onChange={(e) => update("warmth", Number(e.target.value))} /></label>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={() => update("motion", !controls.motion)} className={`flex-1 rounded-full border py-2 text-[10px] tracking-widest transition ${controls.motion ? "border-[#e8e4dc] text-[#e8e4dc]" : "border-white/10 text-zinc-500"}`}>MOTION {controls.motion ? "ON" : "OFF"}</button>
        <button onClick={() => update("bionic", !controls.bionic)} className={`flex-1 rounded-full border py-2 text-[10px] tracking-widest transition ${controls.bionic ? "border-[#e8e4dc] text-[#e8e4dc]" : "border-white/10 text-zinc-500"}`}>BIONIC {controls.bionic ? "ON" : "OFF"}</button>
        <button onClick={() => update("tts", !controls.tts)} className={`flex-1 rounded-full border py-2 text-[10px] tracking-widest transition ${controls.tts ? "border-[#e8e4dc] text-[#e8e4dc]" : "border-white/10 text-zinc-500"}`}>AUDIO {controls.tts ? "ON" : "OFF"}</button>
      </div>
    </div>
  );
}
