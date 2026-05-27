"use client";

import React, { useEffect, useState } from "react";
import ReaderLayout from "@/components/ReaderLayout";
import Layer1Void from "@/components/layers/Layer1Void";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";
import ManuscriptCore from "@/components/layers/canvas/ManuscriptCore";

export default function Page() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [partNumber, setPartNumber] = useState("I");
  const [chapterNum, setChapterNum] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadChapter() {
      try {
        // Feature 205: Fetch from Supabase Hash Registry
        const chaptersRes = await fetch(`/api/chapters`);
        const chapters = await chaptersRes.json();
        
        // Find by number
        const activeChapter = chapters.find((c: any) => c.chapter_number === chapterNum);

        if (activeChapter) {
            const manuscriptRes = await fetch(`/api/manuscript?chapterId=${activeChapter.id}`);
            const data = await manuscriptRes.json();
            setBlocks(data);
            setPartNumber(activeChapter.part_number || "I");
        } else {
            // Fallback: Local TXT
            const localRes = await fetch(`/data/chapters/${chapterNum}.txt`);
            if (localRes.ok) {
                const text = await localRes.text();
                const paragraphs = text
                  .split(/\n\s*\n/)
                  .map(p => p.trim())
                  .filter(p => p.length > 0 && !p.startsWith("Chapter"));
                setBlocks(paragraphs);
            } else {
                setBlocks([]);
            }
        }
      } catch (err) {
        console.error("Failed to load chapter data:", err);
      }
    }
    loadChapter();
  }, [chapterNum]);

  const handleChapterChange = (n: number) => {
      setChapterNum(n);
  };

  return (
    <>
      <div id="DEPLOY-PROOF-MARKER" style={{ position: "fixed", top: 8, left: 8, zIndex: 99999, background: "#c9a96e", color: "#0a0a0a" }}>NOS-V4-LIVE</div>
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
        <Layer4Panel />
      </ReaderLayout>
    </>
  );
}
