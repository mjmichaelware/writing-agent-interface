"use client";

import React, { useEffect, useRef, useState } from "react";

import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";

import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";

const mockBus = {
  emit: () => {},
  on: () => {},
  off: () => {}
};

const cp = {
  state: {
    fontScale: 1.125,
    lineHeight: "1.7",
    letterSpacing: 0,
    baseColor: "#e8e4dc"
  },
  update: () => {}
};

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
  13: "Exodus"
};

const CHAPTER_NUMS = [1,2,3,4,5,6,7,8,9,10,11,13];

export default function ReaderPage() {
  const [chapter, setChapter] = useState<number | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [depth, setDepth] = useState(0);
  const [activePara, setActivePara] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const topCanvasRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initAudioListener(mockBus);
    initDistortionListener(mockBus);
    initThematicListener(mockBus);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      const maxScroll =
        document.body.scrollHeight - window.innerHeight;

      const scrollDepth =
        maxScroll > 0 ? scrollY / maxScroll : 0;

      setDepth(scrollDepth);

      const paras = Array.from(
        document.querySelectorAll("[data-para]")
      );

      let currentActive = 0;

      paras.forEach((p) => {
        const rect = p.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.5) {
          currentActive = parseInt(
            p.getAttribute("data-para") || "0",
            10
          );
        }
      });

      setActivePara(currentActive);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const ch = params.get("ch");

    if (ch && TITLES[parseInt(ch, 10)]) {
      setChapter(parseInt(ch, 10));
    }
  }, []);

  useEffect(() => {
    if (!chapter) return;

    setLoading(true);
    setError(null);

    fetch(`/api/chapters?slug=${chapter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setParagraphs(data.blocks || []);
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [chapter]);

  const go = (delta: number) => {
    if (!chapter) return;

    const idx = CHAPTER_NUMS.indexOf(chapter);

    if (
      idx !== -1 &&
      CHAPTER_NUMS[idx + delta] !== undefined
    ) {
      setChapter(CHAPTER_NUMS[idx + delta]);
    }
  };

  return (
    <>
      <Layer1Void />

      <Layer2Cinema
        chapter={chapter || 7}
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
