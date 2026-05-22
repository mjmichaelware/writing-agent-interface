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
  const chapterSlug = "7";

  useEffect(() => {
    async function loadChapter() {
      try {
        // Step 1: Identify Chapter ID in Supabase
        const chaptersRes = await fetch(`/api/chapters`);
        const chapters = await chaptersRes.json();
        const activeChapter = chapters.find((c: any) => c.chapter_number === parseInt(chapterSlug));

        if (activeChapter) {
            // Step 2: Fetch Semantic Blocks from Supabase
            const manuscriptRes = await fetch(`/api/manuscript?chapterId=${activeChapter.id}`);
            const data = await manuscriptRes.json();
            setBlocks(data);
            setPartNumber(activeChapter.part_number || "I");
        } else {
            // Fallback: Local TXT (Pure prose, no weights)
            const localRes = await fetch(`/data/chapters/${chapterSlug}.txt`);
            const text = await localRes.text();
            const paragraphs = text
              .split(/\n\s*\n/)
              .map(p => p.trim())
              .filter(p => p.length > 0 && !p.startsWith("Chapter"));
            setBlocks(paragraphs);
        }
      } catch (err) {
        console.error("Failed to load chapter data:", err);
      }
    }
    loadChapter();
  }, [chapterSlug]);

  return (
    <ReaderLayout>
      <Layer1Void />
      <Layer2Cinema />
      <Layer3Canvas>
        <ManuscriptCore 
            blocks={blocks} 
            chapterSlug={chapterSlug} 
            partNumber={partNumber} 
        />
      </Layer3Canvas>
      <Layer4Panel />
    </ReaderLayout>
  );
}
