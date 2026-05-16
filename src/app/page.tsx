"use client";

import React, { useEffect, useState, useRef } from "react";
import { getRuntime } from "@/runtime/runtimeContext";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";
import { useControlPanel } from "@/runtime/controlPanel";

import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";

const TITLES: Record<number, string> = {
  1: "Stardust to Stardust",
  2: "Living Sacrifice",
  3: "Lift Up",
  4: "Pilgrimage",
  5: "The Snare",
  6: "Beelzebub, Beelzebub",
  7: "The Pit",
  8: "Sea People",
  9: "The Ascent",
  10: "Forsaken",
  11: "Forsaken (II)",
  13: "Exodus",
};
const CHAPTER_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13];

export default function HomePage() {
  const { bus } = getRuntime();
  const cp = useControlPanel();
  
  // Chapter defaults to null so the Title Page shows cleanly
  const [chapter, setChapter] = useState<number | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topCanvasRef = useRef<HTMLDivElement>(null);
  const manuscriptRef = useRef<HTMLDivElement>(null);

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
      if (TITLES[parsed] !== undefined) {
        setChapter(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (!chapter) return;
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
        (bus as any).emit("chapter:load", { id: chapter });
      })
      .catch((e) => {
        if (e.name !== "AbortError") { setError(e.message); setLoading(false); }
      });
    return () => ac.abort();
  }, [chapter, bus]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const max = el.scrollHeight - el.clientHeight;
    const d = max > 0 ? el.scrollTop / max : 0;
    setDepth(d);
    (bus as any).emit("scroll:update", { depth: d });

    const paras = el.querySelectorAll("[data-para]");
    let active = 0;
    paras.forEach((pEl, i) => {
      const r = pEl.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.5) active = i;
    });
    setActivePara(active);
  };

  const go = (delta: number) => {
    if (!chapter) return;
    const currentIdx = CHAPTER_NUMS.indexOf(chapter);
    if (currentIdx !== -1 && CHAPTER_NUMS[currentIdx + delta] !== undefined) {
      setChapter(CHAPTER_NUMS[currentIdx + delta]);
      setTimeout(() => { 
        document.getElementById("reading")?.scrollIntoView({ behavior: "smooth" }); 
      }, 50);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-zinc-100 font-sans selection:bg-cyan-950/60">
      
      {/* Z-0: Fixed Black Void */}
      <Layer1Void />
      
      {/* Z-10: Fixed Cinema Backdrop */}
      <Layer2Cinema chapter={chapter || 1} activePara={activePara} depth={depth} />

      {/* Z-20: Relative Scroll Canvas */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden z-20 scroll-smooth"
        // REMOVED THE CSS MASKS THAT BROKE YOUR LAYER 2 VISIBILITY
        style={{}}
      >
        <Layer3Canvas
          chapter={chapter} 
          setChapter={setChapter} 
          paragraphs={paragraphs} 
          loading={loading} 
          error={error}
          depth={depth} 
          go={go} 
          scrollContainerRef={scrollContainerRef}
          topCanvasRef={topCanvasRef} 
          TITLES={TITLES} 
          CHAPTER_NUMS={CHAPTER_NUMS} 
          state={cp.state}
        />
      </div>

      {/* Z-40 / Z-50: HUD & Panel */}
      <Layer4Panel
        open={panelOpen} 
        onClose={() => setPanelOpen(false)} 
        cp={cp} 
        chapter={chapter || 1} 
        setChapter={setChapter}
        manuscriptRef={manuscriptRef} 
        TITLES={TITLES} 
        CHAPTER_NUMS={CHAPTER_NUMS} 
        depth={depth} 
        setOpen={setPanelOpen}
      />
    </div>
  );
}
