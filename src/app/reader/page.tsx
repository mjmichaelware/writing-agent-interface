"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { getRuntime } from "@/runtime/runtimeContext";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";
import { useControlPanel, classifyWord } from "@/runtime/controlPanel";
import { CINEMA_ASSETS, CINEMA_PARAGRAPHS_PER_IMAGE } from "@/data/cinema";

const TITLES: Record<number, string> = {
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
const CHAPTER_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13];

function TaggedParagraph({
  text,
  isDescent,
  state,
}: {
  text: string;
  isDescent: boolean;
  state: ReturnType<typeof useControlPanel>["state"];
}) {
  const cleaned = text.replace(/\r/g, "");
  const tokens = cleaned.split(/(\s+|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <p
      className="text-justify"
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
            <strong
              key={i}
              style={{ color: state.properColor, fontWeight: 600 }}
            >
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

type Tab = "controls" | "navigate" | "system";

function UnifiedPanel({
  open,
  onClose,
  cp,
  chapter,
  setChapter,
}: {
  open: boolean;
  onClose: () => void;
  cp: ReturnType<typeof useControlPanel>;
  chapter: number;
  setChapter: (n: number) => void;
}) {
  const [tab, setTab] = useState<Tab>("controls");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

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
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-cyan-900/40 overflow-y-auto">
        <header className="sticky top-0 bg-black/85 backdrop-blur-md border-b border-zinc-900 z-10">
          <div className="px-5 py-4 flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.4em] text-cyan-400 font-bold">
              Command
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex border-t border-zinc-900">
            {([
              { id: "controls", label: "Style", icon: Palette },
              { id: "navigate", label: "Navigate", icon: Compass },
              { id: "system", label: "System", icon: Cpu },
            ] as { id: Tab; label: string; icon: any }[]).map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-widest font-sans transition-colors ${
                    active
                      ? "text-cyan-400 border-b-2 border-cyan-500"
                      : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
                  }`}
                >
                  <Icon size={12} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </header>

        {tab === "controls" && (
          <div className="p-5 space-y-6">
            <section>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3">
                Global Colors
              </p>
              {[
                { k: "baseColor" as const, label: "Base text" },
                { k: "descentColor" as const, label: "Descent (para 13+)" },
                { k: "sacredColor" as const, label: "Sacred words" },
                { k: "properColor" as const, label: "Proper nouns / bold" },
              ].map((c) => (
                <div
                  key={c.k}
                  className="flex items-center justify-between mb-2"
                >
                  <label className="text-xs text-zinc-400">{c.label}</label>
                  <input
                    type="color"
                    value={state[c.k]}
                    onChange={(e) =>
                      update({ [c.k]: e.target.value } as any)
                    }
                    className="w-10 h-8 bg-transparent border border-zinc-800 cursor-pointer"
                  />
                </div>
              ))}
            </section>
            <section>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3">
                Typography
              </p>
              {[
                { k: "fontScale" as const, label: "Font scale", min: 0.7, max: 1.6, step: 0.05 },
                { k: "lineHeight" as const, label: "Line height", min: 1.2, max: 2.6, step: 0.05 },
                { k: "letterSpacing" as const, label: "Tracking", min: -0.05, max: 0.2, step: 0.01 },
              ].map((s) => (
                <div key={s.k} className="mb-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-zinc-400">{s.label}</span>
                    <span className="text-cyan-400 tabular-nums">
                      {state[s.k].toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={state[s.k]}
                    onChange={(e) =>
                      update({ [s.k]: parseFloat(e.target.value) } as any)
                    }
                    className="w-full accent-cyan-600"
                  />
                </div>
              ))}
            </section>
            <section>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3">
                Characters
              </p>
              {charNames.map((name) => {
                const ch = state.characters[name];
                return (
                  <div
                    key={name}
                    className="mb-3 p-3 bg-zinc-900/60 border border-zinc-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: ch.color }}
                      >
                        {name}
                      </span>
                      <input
                        type="color"
                        value={ch.color}
                        onChange={(e) =>
                          updateCharacter(name, { color: e.target.value })
                        }
                        className="w-8 h-6 bg-transparent border border-zinc-800"
                      />
                    </div>
                    <div className="flex gap-2 text-[10px]">
                      <select
                        value={ch.weight}
                        onChange={(e) =>
                          updateCharacter(name, {
                            weight: e.target.value as any,
                          })
                        }
                        className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300"
                      >
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                      </select>
                      <label className="flex items-center gap-1 text-zinc-400">
                        <input
                          type="checkbox"
                          checked={ch.italic}
                          onChange={(e) =>
                            updateCharacter(name, {
                              italic: e.target.checked,
                            })
                          }
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
          <div className="p-5 space-y-5">
            <p className="text-[9px] uppercase tracking-widest text-zinc-500">
              Manuscript — 12 Chapters
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CHAPTER_NUMS.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setChapter(n);
                    onClose();
                  }}
                  className={`p-3 border text-left transition-colors ${
                    chapter === n
                      ? "bg-cyan-950/40 border-cyan-700 text-cyan-300"
                      : "bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800 text-zinc-300"
                  }`}
                >
                  <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                    Ch. {n}
                  </p>
                  <p className="text-xs mt-1 leading-tight">{TITLES[n]}</p>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-zinc-900 space-y-2">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2">
                Diagnostic Pages
              </p>
              <Link
                href="/runtime"
                className="block p-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
              >
                Runtime Audit →
              </Link>
            </div>
          </div>
        )}

        {tab === "system" && (
          <div className="p-5 space-y-5">
            <section>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3">
                Search 181 Nodes
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Megiddo, Dagon, Sak…"
                  className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-cyan-700 focus:outline-none"
                />
                <button
                  onClick={runSearch}
                  disabled={searching}
                  className="bg-cyan-900 hover:bg-cyan-800 px-3 disabled:bg-zinc-800"
                >
                  <SearchIcon size={14} />
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {results.map((r: any, i) => (
                  <div
                    key={i}
                    className="bg-zinc-900/40 border border-zinc-800 p-3"
                  >
                    <p className="text-[9px] text-cyan-500 uppercase tracking-widest mb-1 font-mono break-all">
                      {r.file}
                    </p>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      {r.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="pt-4 border-t border-zinc-900">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-3">
                System
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 bg-zinc-900/40 border border-zinc-800">
                  <p className="text-zinc-500">Files</p>
                  <p className="text-white">181</p>
                </div>
                <div className="p-2 bg-zinc-900/40 border border-zinc-800">
                  <p className="text-zinc-500">Chapters</p>
                  <p className="text-white">12</p>
                </div>
                <div className="p-2 bg-zinc-900/40 border border-zinc-800">
                  <p className="text-zinc-500">Build</p>
                  <p className="text-emerald-400">deployed</p>
                </div>
                <div className="p-2 bg-zinc-900/40 border border-zinc-800">
                  <p className="text-zinc-500">Engine</p>
                  <p className="text-white">EventBus</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReaderPage() {
  const { bus } = getRuntime();
  const cp = useControlPanel();
  const [chapter, setChapter] = useState<number>(7);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    initAudioListener(bus);
    initDistortionListener(bus);
    initThematicListener(bus);
  }, [bus]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const ch = parseInt(p.get("ch") || "7", 10);
    if (TITLES[ch]) setChapter(ch);
  }, []);

  useEffect(() => {
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
  }, [bus, paragraphs]);

  const go = (delta: number) => {
    const next = chapter + delta;
    if (TITLES[next]) {
      setChapter(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const slug = String(chapter);
  const assets = CINEMA_ASSETS[slug] || ["/bg.png"];
  const imgIndex = Math.min(
    assets.length - 1,
    Math.floor(activePara / CINEMA_PARAGRAPHS_PER_IMAGE)
  );

  return (
    <div className="relative min-h-screen">
      {/* Layer 0 — Void */}
      <div className="fixed inset-0 z-0 bg-black" />

      {/* Layer 2 — Cinema (always-on photo, dims with depth) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {assets.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === imgIndex ? Math.max(0.25, 0.7 - depth * 0.4) : 0,
              transition: "opacity 1500ms ease-in-out",
              filter: `grayscale(0.2) contrast(1.05) brightness(${Math.max(0.5, 0.95 - depth * 0.3)})`,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, rgba(185,28,28,${depth * 0.4}) 0%, rgba(0,0,0,${0.4 + depth * 0.3}) 70%)`,
            transition: "background 1000ms",
          }}
        />
      </div>

      {/* Layer 4 — Top bar */}
      <header className=
