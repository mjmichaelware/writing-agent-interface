"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sliders,
  X,
  Compass,
  Cpu,
  Palette,
  Search as SearchIcon,
  ChevronDown,
  Link2,
  FileText,
  User
} from "lucide-react";
import { getRuntime } from "@/runtime/runtimeContext";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";
import { useControlPanel, classifyWord } from "@/runtime/controlPanel";
import { CINEMA_ASSETS, CINEMA_PARAGRAPHS_PER_IMAGE } from "@/data/cinema";

const TITLES: Record<number, string> = {
  0: "Title Page & Front Matter",
  1: "I. Stardust to Stardust",
  2: "II. Living Sacrifice",
  3: "III. Lift Up",
  4: "IV. Pilgrimage",
  5: "V. The Snare",
  6: "VI. Beelzebub, Beelzebub",
  7: "VII. The Pit",
  8: "VIII. Sea People",
  9: "IX. The Ascent",
  10: "X. Forsaken",
  11: "XI. Forsaken (II)",
  13: "XIII. Exodus",
};
const CHAPTER_NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13];

type PanelState = ReturnType<typeof useControlPanel>["state"];
type ControlPanelHook = ReturnType<typeof useControlPanel>;

function TaggedParagraph({
  text,
  isDescent,
  state,
}: {
  text: string;
  isDescent: boolean;
  state: PanelState;
}) {
  const cleaned = text.replace(/\r/g, "");
  const tokens = cleaned.split(/(\s+|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <p
      className="text-justify text-zinc-300 first-letter:text-3xl first-letter:font-serif first-letter:mr-2"
      style={{
        fontSize: `${1.25 * state.fontScale}rem`,
        lineHeight: state.lineHeight,
        letterSpacing: `${state.letterSpacing}em`,
        textIndent: "3rem",
        color: isDescent ? state.descentColor : state.baseColor,
        transition: "color 700ms",
      }}
    >
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        if (tok.startsWith("**") && tok.endsWith("**")) {
          return (
            <strong key={i} style={{ color: state.properColor, fontWeight: 600 }}>
              {tok.slice(2, -2)}
            </strong>
          );
        }
        const style = classifyWord(tok, state);
        return (
          <span
            key={i}
            style={{
              color: style.color,
              fontWeight: parseInt(style.weight, 10),
              fontStyle: style.italic ? "italic" : "normal",
            }}
          >
            {tok}
          </span>
        );
      })}
    </p>
  );
}

type Tab = "controls" | "navigate" | "system" | "dashboard";

function UnifiedPanel({
  open,
  onClose,
  cp,
  chapter,
  setChapter,
}: {
  open: boolean;
  onClose: () => void;
  cp: ControlPanelHook;
  chapter: number;
  setChapter: (n: number) => void;
}) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [hyperlinksEnabled, setHyperlinksEnabled] = useState(true);
  const [referencesCount, setReferencesCount] = useState(181);

  if (!open) return null;
  const { state, update, updateCharacter } = cp;
  const charNames = Object.keys(state.characters);

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
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-cyan-950/50 overflow-y-auto flex flex-col">
        <header className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-zinc-900 z-10">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* AUTHOR PICTURE FRAME WORK */}
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-700/50 overflow-hidden flex items-center justify-center">
                <img 
                  src="/assets/michael.jpg" 
                  alt="Michael" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <User size={12} className="text-cyan-400 absolute" />
              </div>
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-mono font-bold">Singularity OS Panel</h2>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="flex border-t border-zinc-900 overflow-x-auto">
            {([
              { id: "dashboard", label: "Dashboard", icon: Cpu },
              { id: "controls", label: "Styles", icon: Palette },
              { id: "navigate", label: "Index", icon: Compass },
            ] as { id: Tab; label: string; icon: any }[]).map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-[9px] uppercase tracking-widest font-mono transition-all ${active ? "text-cyan-400 border-b-2 border-cyan-500 bg-cyan-950/10" : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"}`}
                >
                  <Icon size={11} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {tab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-zinc-900/40 border border-cyan-900/20 rounded-sm font-mono text-[11px] space-y-2">
                <p className="text-cyan-500 font-bold">// CORE RUNTIME PARAMETERS</p>
                <p className="text-zinc-400">OPERATOR: <span className="text-zinc-200">Michael Alonza P. Ware</span></p>
                <p className="text-zinc-400">ACTIVE POSITION: <span className="text-zinc-200">Front Matter / Canvas VII</span></p>
                <p className="text-zinc-400">NODES COMPILATION: <span className="text-green-400">ONLINE ({referencesCount} Nodes)</span></p>
              </div>

              <section className="space-y-3">
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">Features & Interactivity</p>
                
                {/* HYPERLINKING REFERENCES TOGGLE */}
                <div className="p-4 bg-zinc-900/20 border border-zinc-800 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link2 size={16} className={hyperlinksEnabled ? "text-cyan-400" : "text-zinc-600"} />
                    <div>
                      <p className="text-xs text-zinc-200 font-medium">Hyperlinking References</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Cross-reference internal text keys</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setHyperlinksEnabled(!hyperlinksEnabled)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${hyperlinksEnabled ? "bg-cyan-600" : "bg-zinc-800"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${hyperlinksEnabled ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="p-4 bg-zinc-900/20 border border-zinc-800 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-cyan-400" />
                    <div>
                      <p className="text-xs text-zinc-200 font-medium">Concordance Engine</p>
                      <p className="text-[10px] text-zinc-500 font-mono">Active tracking lookup database</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">v10.1</span>
                </div>
              </section>

              <section className="space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">Quick Search Node Dictionary</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    placeholder="Search terms (Megiddo, Dagon, Sak)..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:border-cyan-700 focus:outline-none font-mono"
                  />
                  <button onClick={runSearch} disabled={searching} className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 px-3 py-1.5 text-xs disabled:bg-zinc-900 transition-colors">
                    <SearchIcon size={12} />
                  </button>
                </div>
                <div className="space-y-2 pt-2">
                  {results.map((r: any, i) => (
                    <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-3 rounded-sm">
                      <p className="text-[9px] text-cyan-500 uppercase tracking-widest mb-1 font-mono break-all">{r.file}</p>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">{r.snippet}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {tab === "controls" && (
            <div className="space-y-6 animate-fadeIn">
              <section>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3 font-mono">Global Colors</p>
                {[
                  { k: "baseColor" as const, label: "Base text" },
                  { k: "descentColor" as const, label: "Descent (para 13+)" },
                  { k: "sacredColor" as const, label: "Sacred words" },
                  { k: "properColor" as const, label: "Proper nouns / bold" },
                ].map((c) => (
                  <div key={c.k} className="flex items-center justify-between mb-2.5">
                    <label className="text-xs text-zinc-400">{c.label}</label>
                    <input
                      type="color"
                      value={state[c.k]}
                      onChange={(e) => update({ [c.k]: e.target.value } as any)}
                      className="w-10 h-7 bg-transparent border border-zinc-800 cursor-pointer"
                    />
                  </div>
                ))}
              </section>
              <section>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3 font-mono">Typography Matrix</p>
                {[
                  { k: "fontScale" as const, label: "Font scale", min: 0.7, max: 1.6, step: 0.05 },
                  { k: "lineHeight" as const, label: "Line height", min: 1.2, max: 2.6, step: 0.05 },
                  { k: "letterSpacing" as const, label: "Tracking", min: -0.05, max: 0.2, step: 0.01 },
                ].map((s) => (
                  <div key={s.k} className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1 font-mono">
                      <span className="text-zinc-400">{s.label}</span>
                      <span className="text-cyan-400 tabular-nums">{state[s.k].toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={state[s.k]}
                      onChange={(e) => update({ [s.k]: parseFloat(e.target.value) } as any)}
                      className="w-full accent-cyan-600 bg-zinc-900 h-1 rounded-lg look-none"
                    />
                  </div>
                ))}
              </section>
              <section>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3 font-mono">Characters Purview</p>
                {charNames.map((name) => {
                  const ch = state.characters[name];
                  return (
                    <div key={name} className="mb-3 p-3 bg-zinc-900/40 border border-zinc-800/60 rounded-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono" style={{ color: ch.color }}>{name}</span>
                        <input
                          type="color"
                          value={ch.color}
                          onChange={(e) => updateCharacter(name, { color: e.target.value })}
                          className="w-7 h-5 bg-transparent border border-zinc-800 cursor-pointer"
                        />
                      </div>
                      <div className="flex gap-4 text-[10px] font-mono">
                        <select
                          value={ch.weight}
                          onChange={(e) => updateCharacter(name, { weight: e.target.value as any })}
                          className="bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-zinc-300 outline-none"
                        >
                          <option value="400">400</option>
                          <option value="500">500</option>
                          <option value="600">600</option>
                          <option value="700">700</option>
                        </select>
                        <label className="flex items-center gap-1.5 text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ch.italic}
                            onChange={(e) => updateCharacter(name, { italic: e.target.checked })}
                            className="accent-cyan-600"
                          />
                          italic
                        </label>
                      </div>
                    </div>
                  );
                })}
              </section>
            </div>
          )}

          {tab === "navigate" && (
            <div className="p-1 space-y-4 animate-fadeIn">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">Manuscript Layout Structure</p>
              <div className="grid grid-cols-1 gap-2">
                {CHAPTER_NUMS.map((n) => (
                  <button
                    key={n}
                    onClick={() => { setChapter(n); onClose(); }}
                    className={`p-3 border text-left transition-all rounded-sm flex flex-col ${chapter === n ? "bg-cyan-950/30 border-cyan-700 text-cyan-300" : "bg-zinc-900/20 hover:bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"}`}
                  >
                    <p className="text-[9px] font-mono tracking-widest opacity-60">INDEX BLOCK {n}</p>
                    <p className="text-xs mt-0.5 leading-tight font-serif">{TITLES[n]}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReaderPage() {
  const { bus } = getRuntime();
  const cp = useControlPanel();
  
  // Set default initial step to Chapter 0 (Title Page / Front Matter View)
  const [chapter, setChapter] = useState<number>(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  // Form Anchors Refs for Smooth Navigation Clicks
  const titleRef = useRef<HTMLDivElement>(null);
  const dedicationRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAudioListener(bus);
    initDistortionListener(bus);
    initThematicListener(bus);
  }, [bus]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const ch = p.get("ch");
    if (ch !== null) {
      const parsed = parseInt(ch, 10);
      if (TITLES[parsed]) setChapter(parsed);
    }
  }, []);

  useEffect(() => {
    if (chapter === 0) {
      setParagraphs([]);
      setLoading(false);
      setError(null);
      bus.emit("chapter:load", { id: 0 });
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/chapters?slug=${chapter}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
          setParagraphs([]);
        } else if (d.blocks?.length > 0) {
          setParagraphs(d.blocks);
        } else {
          setParagraphs([]);
        }
        setLoading(false);
        bus.emit("chapter:load", { id: chapter });
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => ac.abort();
  }, [chapter, bus]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const d = max > 0 ? doc.scrollTop / max : 0;
      setDepth(d);
      bus.emit("scroll:update", { depth: d });

      const paras = document.querySelectorAll("[data-para]");
      let active = 0;
      paras.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.5) active = i;
      });
      setActivePara(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [bus, paragraphs, chapter]);

  const go = (delta: number) => {
    const currentIdx = CHAPTER_NUMS.indexOf(chapter);
    if (currentIdx !== -1 && CHAPTER_NUMS[currentIdx + delta] !== undefined) {
      setChapter(CHAPTER_NUMS[currentIdx + delta]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (targetRef: React.RefObject<HTMLDivElement>) => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const slug = String(chapter);
  // Guarantee Moonlight graphic is always hard-routed to configuration key 0
  const assets = chapter === 0 ? ["/assets/moonlight.jpg"] : (CINEMA_ASSETS[slug] || ["/bg.png"]);
  const imgIndex = chapter === 0 ? 0 : Math.min(assets.length - 1, Math.floor(activePara / CINEMA_PARAGRAPHS_PER_IMAGE));

  return (
    <div className="relative min-h-screen bg-black select-none text-zinc-100">
      
      {/* LAYER 1: THE VOID (Base Layer Dark Engine Background) */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none" />

      {/* LAYER 2: PICTURES (Cinema Backdrop Stack Engine) */}
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        {assets.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover origin-center scale-105"
            style={{
              // Force rendering clear visibility context on Chapter 0 title frame
              opacity: i === imgIndex ? (chapter === 0 ? 0.75 : Math.max(0.25, 0.7 - depth * 0.4)) : 0,
              transition: "opacity 1200ms ease-in-out, filter 1000ms ease-in-out",
              filter: `grayscale(0.3) contrast(1.1) brightness(${chapter === 0 ? 0.6 : Math.max(0.4, 0.95 - depth * 0.3)})`,
            }}
            onError={(e) => {
              // Safe production fallback context if physical path fails verification swap
              e.currentTarget.src = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1500&auto=format&fit=crop";
            }}
          />
        ))}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"
          style={{
            background: chapter === 0 
              ? "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 90%)"
              : `radial-gradient(ellipse at center, rgba(185,28,28,${depth * 0.3}) 0%, rgba(0,0,0,${0.5 + depth * 0.3}) 75%)`,
            transition: "background 1000ms",
          }}
        />
      </div>

      {/* LAYER 4: CONTROL PANEL FIXED HEADER OVERLAY FRAME */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-zinc-950/80">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <span className="text-cyan-500 font-mono text-[9px] uppercase tracking-widest animate-pulse">Singularity OS</span>
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-serif text-center flex-1 mx-4 truncate">
            {chapter === 0 ? "The Weight of the Sky" : TITLES[chapter]}
          </p>
          <button 
            onClick={() => setPanelOpen(true)} 
            className="text-cyan-400 hover:text-cyan-200 transition-colors flex items-center gap-1 p-1"
            title="Open Control Panel"
          >
            <Sliders size={14} />
          </button>
        </div>
        <div className="h-[1px] bg-zinc-900">
          <div className="h-full bg-cyan-600 transition-all duration-300" style={{ width: `${depth * 100}%` }} />
        </div>
      </header>

      {/* LAYER 3: MANUSCRIPT CANVAS FLOW CONTAINER */}
      <article className="relative z-20 pt-32 pb-40 px-6 max-w-3xl mx-auto min-h-screen">
        
        {chapter === 0 ? (
          /* SECTION: FRONT MATTER RENDER STACK CONTAINER */
          <div className="space-y-48 w-full">
            
            {/* Title Page Section Frame */}
            <div ref={titleRef} className="min-h-[70vh] flex flex-col justify-center items-center text-center pt-12">
              <h1 className="text-zinc-100 uppercase tracking-[0.6em] text-3xl md:text-5xl font-serif leading-tight max-w-xl mb-6">
                THE WEIGHT OF THE SKY
              </h1>
              <div className="w-12 h-[1px] bg-cyan-800/40 my-4" />
              
              {/* LAYOUT TEXT ANCHOR SCROLL BUTTONS */}
              <div className="flex flex-wrap justify-center gap-3 mt-8 font-mono text-[9px] tracking-widest">
                <button 
                  onClick={() => scrollToSection(dedicationRef)}
                  className="px-4 py-2 border border-zinc-800 bg-black/60 hover:border-cyan-500 hover:text-cyan-400 transition-all rounded-sm"
                >
                  Dedicated To
                </button>
                <button 
                  onClick={() => scrollToSection(blurbRef)}
                  className="px-4 py-2 border border-zinc-800 bg-black/60 hover:border-cyan-500 hover:text-cyan-400 transition-all rounded-sm"
                >
                  The Blurb
                </button>
                <button 
                  onClick={() => scrollToSection(authorRef)}
                  className="px-4 py-2 border border-zinc-800 bg-black/60 hover:border-cyan-500 hover:text-cyan-400 transition-all rounded-sm"
                >
                  About Author
                </button>
              </div>

              <button 
                onClick={() => go(1)}
                className="mt-20 px-8 py-3 bg-zinc-100 text-black text-[10px] font-mono tracking-widest font-bold hover:bg-cyan-400 transition-colors uppercase rounded-sm shadow-xl"
              >
                Begin Reading
              </button>
              
              <ChevronDown size={20} className="text-zinc-600 animate-bounce mt-16 opacity-40" />
            </div>

            {/* Dedicated To Block Frame */}
            <div ref={dedicationRef} className="min-h-[40vh] flex flex-col justify-center items-center text-center scroll-mt-32">
              <p className="text-cyan-600 font-mono text-[9px] uppercase tracking-[0.4em] mb-8">// ACCREDITATION</p>
              <div className="max-w-xl px-4">
                <p className="text-zinc-300 font-serif italic text-lg md:text-xl leading-relaxed">
                  "For those who track the spaces left between collapsing constellations, carrying the full measure of the blackness within."
                </p>
              </div>
            </div>

            {/* The Blurb Block Frame */}
            <div ref={blurbRef} className="min-h-[50vh] flex flex-col justify-center items-center scroll-mt-32">
              <p className="text-cyan-600 font-mono text-[9px] uppercase tracking-[0.4em] mb-8">// OVERVIEW NODE</p>
              <div className="max-w-xl bg-zinc-950/40 border border-zinc-900/40 p-8 rounded-sm backdrop-blur-xs">
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed tracking-wide font-sans text-justify uppercase">
                  A high-level deterministic narrative environment executed as an event-driven state mechanism. As the physical depth tracking increases, the visual, sonic, and structural integrity of the layout modules decay in direct proportion to the character's core alignment vector.
                </p>
              </div>
            </div>

            {/* About the Author Block Frame */}
            <div ref={authorRef} className="min-h-[50vh] flex flex-col justify-center items-center text-center scroll-mt-32 pb-12">
              <p className="text-cyan-600 font-mono text-[9px] uppercase tracking-[0.4em] mb-8">// CONTROLLER PROVENANCE</p>
              <div className="max-w-xl flex flex-col items-center space-y-6">
                <div className="w-20 h-20 rounded-full border border-cyan-900/60 p-1 bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/assets/michael.jpg" 
                    alt="Author Portrait" 
                    className="w-full h-full object-cover rounded-full" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";
                    }}
                  />
                </div>
                <p className="text-zinc-300 text-xs font-mono tracking-wide leading-relaxed max-w-md">
                  Michael Alonza P. Ware — Narrative Architect & Systems Engineering Specialist. Designing interactive, cross-linked, sensory reading engines inside custom operational interfaces.
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* STANDARD TEXT ENGINE MANUSCRIPT INTERFACES */
          <div className="max-w-2xl mx-auto">
            <h1 className="text-zinc-400 uppercase tracking-[0.7em] text-[11px] text-center mb-24 font-mono">
              {TITLES[chapter]}
            </h1>
            
            {loading && (
              <p className="text-zinc-500 text-center text-xs uppercase tracking-widest animate-pulse font-mono">
                Querying ingestion buffer manifest...
              </p>
            )}
            
            {error && (
              <div className="text-center p-6 border border-red-900/30 bg-red-950/20 rounded-sm">
                <p className="text-red-400 font-mono text-xs">Runtime Error: {error}</p>
              </div>
            )}
            
            {!loading && !error && paragraphs.length === 0 && (
              <p className="text-zinc-600 text-center text-xs font-mono">NODE CHAPTER {chapter} NOT SYNCED</p>
            )}

            <div className="space-y-12 font-serif">
              {paragraphs.map((para, i) => (
                <div key={`${chapter}-${i}`} data-para={i} className="animate-reveal">
                  <TaggedParagraph text={para} isDescent={i > 12} state={cp.state} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM LAYER INTERACTIVE ROUTING ACTION STRIP */}
        <div className="mt-40 flex justify-between items-center border-t border-zinc-900/80 pt-8 font-mono text-[9px] tracking-widest">
          <button
            onClick={() => go(-1)}
            disabled={CHAPTER_NUMS.indexOf(chapter) === 0}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors disabled:text-zinc-800 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={12} /> PREV INDEX
          </button>
          <button
            onClick={() => go(1)}
            disabled={CHAPTER_NUMS.indexOf(chapter) === CHAPTER_NUMS.length - 1}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors disabled:text-zinc-800 disabled:cursor-not-allowed"
          >
            NEXT INDEX <ChevronRight size={12} />
          </button>
        </div>

      </article>

      {/* LAYER 4 CONTROL SURFACE PANEL DRAW MOUNT CONTAINER */}
      <UnifiedPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        cp={cp}
        chapter={chapter}
        setChapter={(n) => {
          setChapter(n);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
