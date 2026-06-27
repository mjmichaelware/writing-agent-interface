"use client";

import React, { useEffect, useState } from "react";
import ReaderLayout from "@/components/ReaderLayout";
import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";
import ManuscriptCore from "@/components/layers/canvas/ManuscriptCore";
import { bus } from "@/core/runtimeEngine";
import { initAudioListener } from "@/runtime/listeners/audioListener";
import { initDistortionListener } from "@/runtime/listeners/distortionListener";
import { initThematicListener } from "@/runtime/listeners/thematicListener";

export default function Page() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [partNumber, setPartNumber] = useState("I");
  const [chapterNum, setChapterNum] = useState(1);
  const [source, setSource] = useState<"db" | "txt" | "drive">("db");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = bus.on("chapter:set", (d: any) => {
      if (d?.chapterNumber > 0) {
        setChapterNum(d.chapterNumber);
        if (d.source) setSource(d.source);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsubs = [
      initThematicListener(),
      initAudioListener(),
      initDistortionListener(),
    ];

    return () => {
      unsubs.forEach((unsub) => {
        if (typeof unsub === "function") unsub();
      });
    };
  }, []);

  useEffect(() => {
    async function loadChapter() {
      setLoading(true);
      try {
        if (source === "txt") {
          const localRes = await fetch(`/data/chapters/${chapterNum}.txt`);
          if (localRes.ok) {
            const text = await localRes.text();
            const paragraphs = text
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter((p) => p.length > 0 && !p.startsWith("Chapter"));
            setBlocks(paragraphs);
          } else {
            setBlocks([]);
          }
          setPartNumber(chapterNum <= 9 ? "I" : "II");
          return;
        }

        // Primary: render_paragraphs from the semantic pipeline (deterministic source)
        const res = await fetch(`/api/manuscript?chapterNumber=${chapterNum}`);
        if (res.ok) {
          const data = await res.json();
          const paragraphs = Array.isArray(data) ? data : data?.paragraphs;
          if (Array.isArray(paragraphs) && paragraphs.length > 0) {
            setBlocks(paragraphs);
            setPartNumber(chapterNum <= 9 ? "I" : "II");
            return;
          }
        }

        // Fallback: local TXT if render_paragraphs has no rows yet for this chapter
        const localRes = await fetch(`/data/chapters/${chapterNum}.txt`);
        if (localRes.ok) {
          const text = await localRes.text();
          const paragraphs = text
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter((p) => p.length > 0 && !p.startsWith("Chapter"));
          setBlocks(paragraphs);
        } else {
          setBlocks([]);
        }
      } catch (err) {
        console.error("Failed to load chapter data:", err);
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    }
    loadChapter();
  }, [chapterNum, source]);

  const handleChapterChange = (n: number) => {
      setChapterNum(n);
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden">
      {/* Layer 4 is mounted in layout.tsx for root-level persistence and max z-index */}

      <ReaderLayout>
        <Layer1Void />
        <Layer2Cinema chapterSlug={chapterNum.toString()} />
        <Layer3Canvas>
          <ManuscriptCore 
              blocks={blocks} 
              chapterSlug={chapterNum.toString()} 
              partNumber={partNumber} 
              onLoadChapter={handleChapterChange}
          />
        </Layer3Canvas>
      </ReaderLayout>
    </main>
  );
}
