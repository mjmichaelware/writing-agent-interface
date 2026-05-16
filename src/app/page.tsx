"use client";

import React, { useEffect, useState, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { getRuntime } from "@/runtime/runtimeContext";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";
import { useControlPanel, classifyWord } from "@/runtime/controlPanel";

import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";

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

function TaggedParagraph({ text, isDescent, state }: any) {
  const cleaned = text.replace(/\r/g, "");
  const tokens = cleaned.split(/(\s+|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <p className="text-justify mb-6 font-serif select-text" style={{ fontSize: `${1.25 * state.fontScale}rem`, lineHeight: state.lineHeight, letterSpacing: `${state.letterSpacing}em`, textIndent: "3rem", color: isDescent ? state.descentColor : state.baseColor, transition: "color 700ms" }}>
      {tokens.map((tok: string, i: number) => {
        if (/^\s+$/.test(tok)) return <span key={i}>{tok}</span>;
        if (tok.startsWith("**") && tok.endsWith("**")) {
          return <strong key={i} style={{ color: state.properColor, fontWeight: 600 }}>{tok.slice(2, -2)}</strong>;
        }
        const style = classifyWord(tok, state);
        return <span key={i} style={{ color: style.color, fontWeight: parseInt(style.weight, 10), fontStyle: style.italic ? "italic" : "normal" }}>{tok}</span>;
      })}
    </p>
  );
}

export default function HomePage() {
  const { bus } = getRuntime();
  const cp = useControlPanel();

  const [chapter, setChapter] = useState<number>(7);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const topCanvasRef = useRef<HTMLDivElement>(null);
  const dedicationRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const manuscriptRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    initAudioListener(bus);
    initDistortionListener(bus);
    initThematicListener(bus);

    bus.on("tone:update", (evt: { tone: string; intensity: number }) => {
      if (evt.tone === "intense") {
        cp.update({ properColor: "#ef4444" });
      } else if (evt.tone === "sacred") {
        cp.update({ sacredColor: "#38bdf8" });
      }
    });
  }, [bus, cp]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const ch = p.get("ch");
    if (ch !== null) {
      const parsed = parseInt(ch, 10);
      if (TITLES[parsed] !== undefined) setChapter(parsed);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/chapters?slug=${chapter}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); setParagraphs([]); }
        else if (d.blocks?.length > 0) { setParagraphs(d.blocks); }
        else { setParagraphs([]); }
        setLoading(false);
        bus.emit("chapter:load", { id: chapter });
      })
      .catch((e) => {
        if (e.name !== "AbortError") { setError(e.message); setLoading(false); }
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
    return () => window.removeEventListener("scroll", onScroll);
  }, [bus, paragraphs, chapter]);

  const go = (delta: number) => {
    const currentIdx = CHAPTER_NUMS.indexOf(chapter);
    if (currentIdx !== -1 && CHAPTER_NUMS[currentIdx + delta] !== undefined) {
      setChapter(CHAPTER_NUMS[currentIdx + delta]);
      setTimeout(() => { manuscriptRef.current?.scrollIntoView({ behavior: "smooth" }); }, 120);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 selection:bg-cyan-950 font-sans">
      <Layer1Void />
      <Layer2Cinema chapter={chapter} activePara={activePara} depth={depth} />
      <Layer3Canvas
        chapter={chapter} setChapter={setChapter} paragraphs={paragraphs} loading={loading} error={error}
        depth={depth} go={go} titleOpacity={titleOpacity} titleScale={titleScale}
        topCanvasRef={topCanvasRef} dedicationRef={dedicationRef} blurbRef={blurbRef} authorRef={authorRef} tocRef={tocRef} manuscriptRef={manuscriptRef}
        TITLES={TITLES} CHAPTER_NUMS={CHAPTER_NUMS} TaggedParagraph={TaggedParagraph} state={cp.state}
      />
      <Layer4Panel
        open={panelOpen} onClose={() => setPanelOpen(false)} cp={cp} chapter={chapter} setChapter={setChapter}
        manuscriptRef={manuscriptRef} TITLES={TITLES} CHAPTER_NUMS={CHAPTER_NUMS} depth={depth} setOpen={setPanelOpen}
      />
    </div>
  );
}
