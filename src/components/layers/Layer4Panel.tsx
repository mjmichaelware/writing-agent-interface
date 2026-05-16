"use client";

import React, { useState } from "react";
import { Cpu, Palette, Compass, Activity, X, Sliders, User } from "lucide-react";

import StatusTab from "./panel/StatusTab";
import StylesTab from "./panel/StylesTab";
import IndexTab from "./panel/IndexTab";
import SystemTab from "./panel/SystemTab";

interface Layer4PanelProps {
  open: boolean;
  onClose: () => void;
  cp: any;
  chapter: number;
  setChapter: (n: number) => void;
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  depth: number;
  setOpen: (b: boolean) => void;
}

type Tab = "dashboard" | "controls" | "navigate" | "system";

export default function Layer4Panel({
  open,
  onClose,
  cp,
  chapter,
  setChapter,
  manuscriptRef,
  TITLES,
  CHAPTER_NUMS,
  depth,
  setOpen,
}: Layer4PanelProps) {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-md border-b border-zinc-900/60 selection:bg-cyan-950">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-cyan-500 text-[10px] uppercase tracking-widest font-mono font-bold">Singularity OS</p>
          <p className="text-zinc-200 text-[10px] uppercase tracking-[0.4em] font-[var(--font-hebrew)] text-center flex-1 mx-4 truncate font-bold">
            {depth < 0.03 ? "The Weight of the Sky" : TITLES[chapter]}
          </p>
          <button onClick={() => setOpen(!open)} className="text-cyan-400 hover:text-cyan-200 transition-colors p-1 active:scale-90">
            <Sliders size={14} />
          </button>
        </div>
        <div className="h-0.5 bg-zinc-900/80">
          <div className="h-full bg-cyan-600 transition-all duration-300" style={{ width: `${depth * 100}%` }} />
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans select-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
          <div className="relative w-full max-w-sm h-full bg-zinc-950 border-l border-zinc-900 overflow-hidden flex flex-col shadow-2xl shadow-black">
            
            <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-900/80 z-10">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-cyan-800/40 flex items-center justify-center relative">
                    <User size={11} className="text-cyan-500 animate-pulse" />
                  </div>
                  <h2 className="text-[9px] uppercase tracking-[0.2em] text-cyan-400 font-mono font-bold">Singularity Panel</h2>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-0.5 rounded-sm hover:bg-zinc-900">
                  <X size={14} />
                </button>
              </div>
              
              <div className="flex border-t border-zinc-900 font-mono text-[8px] tracking-wider">
                {([
                  { id: "dashboard", label: "Status", icon: Cpu },
                  { id: "controls", label: "Styles", icon: Palette },
                  { id: "navigate", label: "Index", icon: Compass },
                  { id: "system", label: "System", icon: Activity },
                ] as { id: Tab; label: string; icon: any }[]).map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-all ${active ? "text-cyan-400 border-b-2 border-cyan-500 bg-cyan-950/10 font-bold" : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"}`}
                    >
                      <Icon size={11} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
              {tab === "dashboard" && <StatusTab />}
              {tab === "controls" && <StylesTab state={cp.state} update={cp.update} />}
              {tab === "navigate" && (
                <IndexTab 
                  chapter={chapter} setChapter={setChapter} onClose={onClose} 
                  manuscriptRef={manuscriptRef} TITLES={TITLES} CHAPTER_NUMS={CHAPTER_NUMS} 
                />
              )}
              {tab === "system" && <SystemTab />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
