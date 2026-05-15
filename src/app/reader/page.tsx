"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Sliders, X } from "lucide-react";
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
      className="text-justify transition-colors duration-700"
      style={{
        fontSize: `${1.25 * state.fontScale}rem`,
        lineHeight: state.lineHeight,
        letterSpacing: `${state.letterSpacing}em`,
        textIndent: "3rem",
        color: isDescent ? state.descentColor : state.baseColor,
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

function ControlPanel({
  open,
  onClose,
  cp,
}: {
  open: boolean;
  onClose: () => void;
  cp: ReturnType<typeof useControlPanel>;
}) {
  if (!open) return null;
  const { state, update, updateCharacter } = cp;
  const charNames = Object.keys(state.characters);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-cyan-900/40 overflow-y-auto">
        <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-5 py-4 flex items-center justify-between">
          <h2 className="text-[11px] uppercase tracking-[0.4em] text-cyan-400 font-bold">
            Control Panel
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={16} />
          </button>
        </header>
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
              <div key={c.k} className="flex items-center justify-between mb-2">
                <label className="text-xs text-zinc-400">{c.label}</label>
                <input
                  type="color"
                  value={state[c.k]}
                  onChange={(e) => update({ [c.k]: e.target.value } as any)}
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
                  onChange={(e) => update({ [s.k]: parseFloat(e.target.value) } as any)}
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
                    <span className="text-sm font-bold" style={{ color: ch.color }}>
                      {name}
                    </span>
                    <input
                      type="color"
                      value={ch.color}
                      onChange={(e) => updateCharacter(name, { color: e.target.value })}
                      className="w-8 h-6 bg-transparent border border-zinc-800"
                    />
                  </div>
                  <div className="flex gap-2 text-[10px]">
                    <select
                      value={ch.weight}
                      onChange={(e) =>
                        updateCharacter(name, { weight: e.target.value as any })
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
                          updateCharacter(name, { italic: e.target.checked })
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

      {/* Layer 2 — Cinema (crossfading photos) */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {assets.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1500"
            style={{
              opacity: i === imgIndex ? 0.55 : 0,
              filter: `grayscale(0.3) contrast(1.1) brightness(${0.85 - depth * 0.3})`,
            }}
          />
        ))}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, rgba(185,28,28,${
              depth * 0.35
            }) 0%, rgba(0,0,0,0.85) 70%)`,
          }}
        />
      </div>

      {/* Layer 4 — Controls (top) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-zinc-900/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-cyan-500 hover:text-cyan-300 flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans"
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-sans">
            {TITLES[chapter] || `Chapter ${chapter}`}
          </p>
          <button
            onClick={() => setPanelOpen(true)}
            className="text-cyan-500 hover:text-cyan-300 flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans"
          >
            <Sliders size={14} /> Controls
          </button>
        </div>
        <div className="h-0.5 bg-zinc-900">
          <div
            className="h-full bg-cyan-600 transition-all"
            style={{ width: `${depth * 100}%` }}
          />
        </div>
      </header>

      {/* Layer 3 — Manuscript */}
      <article className="relative z-20 pt-32 pb-40 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-zinc-300 uppercase tracking-[0.8em] text-xs text-center mb-24 font-sans">
            {TITLES[chapter] || `Chapter ${chapter}`}
          </h1>
          {loading && (
            <p className="text-zinc-500 text-center text-sm uppercase tracking-widest animate-pulse font-sans">
              Retrieving manuscript…
            </p>
          )}
          {error && (
            <div className="text-center p-8 border border-red-900/40 bg-red-950/30 backdrop-blur-sm">
              <p className="text-red-400 text-sm font-sans">Error: {error}</p>
            </div>
          )}
          {!loading && !error && paragraphs.length === 0 && (
            <p className="text-zinc-500 text-center text-sm font-sans">
              Chapter {chapter} not found in canonical map
            </p>
          )}
          <div className="space-y-10">
            {paragraphs.map((para, i) => (
              <div key={`${chapter}-${i}`} data-para={i}>
                <TaggedParagraph
                  text={para}
                  isDescent={i > 12}
                  state={cp.state}
                />
              </div>
            ))}
          </div>
          <div className="mt-32 flex justify-between items-center border-t border-zinc-900/60 pt-8">
            <button
              onClick={() => go(-1)}
              disabled={!TITLES[chapter - 1]}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans text-zinc-300 hover:text-white disabled:text-zinc-800"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => go(1)}
              disabled={!TITLES[chapter + 1]}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans text-zinc-300 hover:text-white disabled:text-zinc-800"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </article>

      {/* Layer 4 — Slide-in panel */}
      <ControlPanel open={panelOpen} onClose={() => setPanelOpen(false)} cp={cp} />
    </div>
  );
}
