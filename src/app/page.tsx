import React from "react";
import ReaderLayout from "../components/ReaderLayout";
import Layer2Cinema from "../components/layers/Layer2Cinema";
import Layer3Canvas from "../components/layers/Layer3Canvas";
import Layer4Panel from "../components/layers/Layer4Panel";
import { VectorStore } from "../services/memory-engine/vector-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const store = new VectorStore();
  
  // 1. Fetch the chapter identifier
  const chapterId = await store.getChapterByManifestId("Chapter_7");
  
  // 2. Retrieve blocks or default to an empty array to prevent null-pointer crashes
  const blocks = chapterId ? await store.getParagraphsByChapter(chapterId) : [];

  // 3. Construct the contract expected by Layer3Canvas
  const chapterData = {
    slug: "7",
    blocks: blocks
  };

  return (
    <ReaderLayout>
      <Layer2Cinema chapterSlug="7" />
      
      <Layer3Canvas chapterData={chapterData} />
      
      <Layer4Panel />
    </ReaderLayout>
  );
}
