"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cpu, Palette, Compass, Activity, X, Link2, Search as SearchIcon, Sliders, User, Eye } from "lucide-react";

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
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [hyperlinksEnabled, setHyperlinksEnabled] = useState(true);

  const { state, update } = cp;

  const runSearch = async () => {
    if (!term.trim()) return;
    setSearching(true);
    try {
      const r = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
      const d = await r.json();
      setResults(d.results || []);
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-md border-b border-zinc-900/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-cyan-500 text-[10px] uppercase tracking-widest font-mono">Singularity OS</p>
          <p className="text-zinc-200 text-[10px] uppercase tracking-[0.4em] font-[var(--font-hebrew)] text-center flex-1 mx-4 truncate">
            {depth < 0.03 ? "The Weight of the Sky" : TITLES[chapter]}
          </p>
          <button onClick={() => setOpen(!open)} className="text-cyan-400 hover:text-cyan-200 transition-colors p-1">
            <Sliders size={14} />
          </button>
        </div>
        <div className="h-0.5 bg-zinc-900">
          <div className="h-full bg-cyan-600 transition-all" style={{ width: `${depth * 100}%` }} />
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />
          <div className="relative w-full max-w-sm h-full bg-zinc-950 border-l border-zinc-900 overflow-y-auto flex flex-col">
            <header className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-zinc-900 z-10">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-cyan-800/40 flex items-center justify-center relative">
                    <User size={11} className="text-cyan-500 animate-pulse" />
                  </div>
                  <h2 className="text-[9px] uppercase tracking-[0.2em] text-cyan-400 font-mono font-bold">Singularity Panel</h2>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
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
                      className={`flex-1 flex flex-col items-center gap-1 py-2 transition-colors ${active ? "text-cyan-400 border-b-2 border-cyan-500 bg-cyan-950/5" : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"}`}
                    >
                      <Icon size={10} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {tab === "dashboard" && (
                <div className="space-y-4 font-mono text-[11px]">
                  <div className="p-3 bg-zinc-900/40 border border-cyan-950/20 text-zinc-400 space-y-1">
                    <p className="text-cyan-400 font-bold mb-1">// RUNTIME METRICS</p>
                    <p>OPERATOR: <span className="text-zinc-200">Michael Alonza Prentice Ware</span></p>
                    <p>RUNTIME STATE: <span className="text-green-400">v10.1 Active</span></p>
                    <p>CONCORDANCE: <span className="text-zinc-200">181 Active Nodes Verified</span></p>
                  </div>
                </div>
              )}

              {tab === "controls" && (
                <div className="space-y-5">
                  <section>
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500 mb-2 font-mono">Global Colors</p>
                    {[
                      { k: "baseColor" as const, label: "Base text" },
                      { k: "descentColor" as const, label: "Descent (para 13+)" },
                      { k: "sacredColor" as const, label: "Sacred words" },
                      { k: "properColor" as const, label: "Proper nouns / bold" },
                    ].map((c) => (
                      <div key={c.k} className="flex items-center justify-between mb-2">
                        <label className="text-xs text-zinc-400">{c.label}</label>
                        <input type="color" value={state[c.k]} onChange={(e) => update({ [c.k]: e.target.value } as any)} className="w-8 h-6 bg-transparent border border-zinc-800 cursor-pointer" />
                      </div>
                    ))}
                  </section>
                </div>
              )}

              {tab === "navigate" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <span className="text-[8px] uppercase tracking-widest text-zinc-500">Navigation Index</span>
                    <Link href="/runtime" className="text-[9px] text-cyan-400 hover:underline flex items-center gap-1">
                      <Eye size={10} /> /runtime diagnostics
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
                    {CHAPTER_NUMS.map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          setChapter(n);
                          onClose();
                          setTimeout(() => { manuscriptRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
                        }}
                        className={`p-2 text-left border transition-colors ${chapter === n ? "bg-cyan-950/20 border-cyan-800 text-cyan-300" : "bg-zinc-900/10 hover:bg-zinc-900/40 border-zinc-900 text-zinc-400"}`}
                      >
                        {TITLES[n]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {tab === "system" && (
                <div className="space-y-4 font-mono text-xs">
                  <section className="space-y-2">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500">Search 181 Nodes</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && runSearch()}
                        placeholder="Query term engine..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-cyan-700 focus:outline-none"
                      />
                      <button onClick={runSearch} disabled={searching} className="bg-cyan-950 border border-cyan-800 text-cyan-400 px-2.5 py-1.5 text-xs">
                        <SearchIcon size={12} />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pt-1">
                      {results.map((r: any, i) => (
                        <div key={i} className="bg-zinc-900/50 border border-zinc-900 p-2 text-[10px] text-zinc-400">
                          {r.snippet}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="pt-2 border-t border-zinc-900 space-y-2">
                    <p className="text-[8px] uppercase tracking-widest text-zinc-500">Concordance Overlays</p>
                    <div className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-sm flex items-center justify-between">
                      <span className="text-zinc-300 font-sans text-xs">Hyperlinking References</span>
                      <button 
                        onClick={() => setHyperlinksEnabled(!hyperlinksEnabled)}
                        className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ${hyperlinksEnabled ? "bg-cyan-600" : "bg-zinc-800"}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${hyperlinksEnabled ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>
                    <button className="w-full py-2 bg-zinc-900 border border-zinc-800 text-left px-3 text-zinc-400 hover:text-cyan-400 transition-colors rounded-sm flex items-center justify-between">
                      <span className="font-sans text-xs">Biblical References</span>
                      <Link2 size={12} className="text-zinc-600" />
                    </button>
                    <button className="w-full py-2 bg-zinc-900 border border-zinc-800 text-left px-3 text-zinc-400 hover:text-cyan-400 transition-colors rounded-sm flex items-center justify-between">
                      <span className="font-sans text-xs">Narrative Foreshadowing</span>
                      <Link2 size={12} className="text-zinc-600" />
                    </button>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
