"use client";

import React, { useEffect, useRef, useState } from "react";

import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";

import { EventBus } from "@/core/runtimeEngine";
import { useControlPanel } from "@/runtime/controlPanel";

import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";

// Module-level singleton — every render shares the same bus
const bus = new EventBus();

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

export default function ReaderPage() {
  const cp = useControlPanel();

  const [chapter, setChapter] = useState<number | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const topCanvasRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Wire feature listeners to the real EventBus
  useEffect(() => {
    initAudioListener(bus);
    initDistortionListener(bus);
    initThematicListener(bus);
  }, []);

  // Read ?ch= on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ch = params.get("ch");
    if (ch && TITLES[parseInt(ch, 10)]) {
      setChapter(parseInt(ch, 10));
    }
  }, []);

  // Sync chapter back to URL (no reload, back button works)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (chapter == null) url.searchParams.delete("ch");
    else url.searchParams.set("ch", String(chapter));
    window.history.replaceState({}, "", url.toString());
  }, [chapter]);

  // Window scroll → depth, activePara, broadcast to bus
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollDepth = maxScroll > 0 ? scrollY / maxScroll : 0;
      setDepth(scrollDepth);

      const paras = Array.from(document.querySelectorAll("[data-para]"));
      let currentActive = 0;
      paras.forEach((p) => {
        const rect = p.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          currentActive = parseInt(p.getAttribute("data-para") || "0", 10);
        }
      });
      setActivePara(currentActive);

      bus.emit("scroll:update", { depth: scrollDepth, activePara: currentActive });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch chapter content; abort prior request if user switches mid-fetch
  useEffect(() => {
    if (!chapter) {
      setParagraphs([]);
      return;
    }
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/chapters?slug=${chapter}`, { signal: ac.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setParagraphs([]);
        } else {
          setParagraphs(data.blocks || []);
        }
        setLoading(false);
        bus.emit("chapter:load", { id: chapter });
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => ac.abort();
  }, [chapter]);

  const go = (delta: number) => {
    if (!chapter) return;
    const idx = CHAPTER_NUMS.indexOf(chapter);
    if (idx !== -1 && CHAPTER_NUMS[idx + delta] !== undefined) {
      setChapter(CHAPTER_NUMS[idx + delta]);
    }
  };

  return (
    <>
      <Layer1Void />

      <Layer2Cinema
        chapter={chapter}
        activePara={activePara}
        depth={depth}
      />

      <Layer3Canvas
        chapter={chapter}
        setChapter={setChapter}
        paragraphs={paragraphs}
        loading={loading}
        error={error}
        depth={depth}
        go={go}
        topCanvasRef={topCanvasRef}
        scrollContainerRef={scrollContainerRef}
        TITLES={TITLES}
        CHAPTER_NUMS={CHAPTER_NUMS}
        state={cp.state}
      />

      <Layer4Panel
        open={panelOpen}
        setOpen={setPanelOpen}
        onClose={() => setPanelOpen(false)}
        cp={cp}
        chapter={chapter}
        setChapter={setChapter}
        manuscriptRef={topCanvasRef}
        TITLES={TITLES}
        CHAPTER_NUMS={CHAPTER_NUMS}
        depth={depth}
      />
    </>
  );
}
