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
import { initAudioPlaybackListener } from "@/runtime/listeners/audioPlaybackListener";
import { initDistortionListener } from "@/runtime/listeners/distortionListener";
import { initThematicListener } from "@/runtime/listeners/thematicListener";
import CursorGlow from "@/components/CursorGlow";
import ScrollToTop from "@/components/ScrollToTop";
import ChapterSettings from "@/components/layers/panel/ChapterSettings";

const getPartNumber = (n: number) => {
  if (n <= 9) return "I";
  if (n <= 17) return "II";
  if (n <= 24) return "III";
  return "Epilogue";
};

export default function Page() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [partNumber, setPartNumber] = useState("I");
  const [chapterNum, setChapterNum] = useState(1);
  const [source, setSource] = useState<"db" | "txt" | "drive">("db");
  const [loading, setLoading] = useState(false);
  const [showReaderSettings, setShowReaderSettings] = useState(false);

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
      initAudioPlaybackListener(),
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
          setPartNumber(getPartNumber(chapterNum));
          return;
        }

        // Primary: render_paragraphs from the semantic pipeline (deterministic source)
        const res = await fetch(`/api/manuscript?chapterNumber=${chapterNum}`);
        if (res.ok) {
          const data = await res.json();
          const paragraphs = Array.isArray(data) ? data : data?.paragraphs;
          if (Array.isArray(paragraphs) && paragraphs.length > 0) {
            setBlocks(paragraphs);
            setPartNumber(getPartNumber(chapterNum));
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
      <div className="noise-grain" aria-hidden="true" />
      {/* 2. Ambient cursor warm glow */}
      <CursorGlow />
      {/* 18. Floating return-to-top ornament */}
      <ScrollToTop />

      {/* Reader settings — top-left, accessible without PIN */}
      <button
        onClick={() => setShowReaderSettings(v => !v)}
        aria-label="Reader settings"
        style={{
          position: "fixed",
          top: "1.25rem",
          left: "1.25rem",
          zIndex: 2147483646,
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: "50%",
          background: "rgba(20,16,10,0.72)",
          border: "1px solid rgba(201,169,110,0.28)",
          color: "#c9a96e",
          fontSize: "1rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: showReaderSettings ? 1 : 0.55,
          transition: "opacity 0.2s",
        }}
      >
        ⚙
      </button>

      {/* Reader settings drawer */}
      {showReaderSettings && (
        <>
          <div
            onClick={() => setShowReaderSettings(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 2147483640,
              background: "rgba(0,0,0,0.35)",
            }}
          />
          <div style={{
            position: "fixed",
            top: "3.75rem",
            left: "1rem",
            zIndex: 2147483645,
            width: "min(320px, calc(100vw - 2rem))",
            background: "rgba(14,12,8,0.96)",
            border: "1px solid rgba(201,169,110,0.22)",
            borderRadius: "6px",
            padding: "1.5rem 1.25rem",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
            maxHeight: "calc(100vh - 5rem)",
            overflowY: "auto",
          }}>
            <ChapterSettings />
          </div>
        </>
      )}


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
