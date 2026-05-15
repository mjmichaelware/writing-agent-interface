"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getRuntime } from "@/runtime/runtimeContext";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";

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
  13: "XIII. Exodus",
};

function Para({ text, isDescent }: { text: string; isDescent: boolean }) {
  const cleaned = text.replace(/\r/g, "");
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <p
      className={`text-xl md:text-2xl leading-[2.0] text-justify transition-colors duration-1000 ${
        isDescent ? "text-red-800/90" : "text-zinc-200"
      }`}
      style={{ textIndent: "3rem" }}
    >
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span
              key={i}
              className={`font-semibold ${isDescent ? "text-red-500" : "text-amber-300/95"}`}
            >
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
export default function ReaderPage() {
  const { bus } = getRuntime();
  const [chapter, setChapter] = useState<number>(7);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);

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
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bus]);

  const go = (delta: number) => {
    const next = chapter + delta;
    if (TITLES[next]) {
      setChapter(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
return (
    <div className="relative min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, rgba(185,28,28,${depth * 0.25}) 0%, rgba(0,0,0,0.95) 70%)`,
        }}
      />
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-zinc-900/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-cyan-500 flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <p className="text-zinc-400 text-[10px] uppercase tracking-[0.4em] font-sans">
            {TITLES[chapter] || `Chapter ${chapter}`}
          </p>
          <p className="text-zinc-600 text-[10px] tabular-nums font-sans">{Math.round(depth * 100)}%</p>
        </div>
      </header>
      <article className="relative z-10 pt-32 pb-40 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-zinc-400 uppercase tracking-[0.8em] text-xs text-center mb-24 font-sans">
            {TITLES[chapter] || `Chapter ${chapter}`}
          </h1>
          {loading && (
            <p className="text-zinc-600 text-center text-sm uppercase tracking-widest animate-pulse font-sans">
              Retrieving manuscript…
            </p>
          )}
          {error && (
            <div className="text-center p-8 border border-red-900/40 bg-red-950/20">
              <p className="text-red-400 text-sm font-sans">Error: {error}</p>
            </div>
          )}
          {!loading && !error && paragraphs.length === 0 && (
            <p className="text-zinc-600 text-center text-sm font-sans">
              Chapter {chapter} not found
            </p>
          )}
          <div className="space-y-10">
            {paragraphs.map((para, i) => (
              <Para key={`${chapter}-${i}`} text={para} isDescent={i > 12} />
            ))}
          </div>
          <div className="mt-32 flex justify-between items-center border-t border-zinc-900/60 pt-8">
            <button
              onClick={() => go(-1)}
              disabled={!TITLES[chapter - 1]}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans text-zinc-400 hover:text-white disabled:text-zinc-800"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => go(1)}
              disabled={!TITLES[chapter + 1]}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans text-zinc-400 hover:text-white disabled:text-zinc-800"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
