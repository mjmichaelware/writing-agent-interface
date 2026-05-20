import React from "react";
import ReaderLayout from "../components/ReaderLayout";
import Layer2Cinema from "../components/layers/Layer2Cinema";
import Layer3Canvas from "../components/layers/Layer3Canvas";
import Layer4Panel from "../components/layers/Layer4Panel";

export const dynamic = "force-dynamic";

async function fetchChapterData(slug: string) {
  try {
    // Rely on your established API route, which has server-side context
    const res = await fetch(`http://localhost:3000/api/graph?slug=${slug}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("[fetchChapterData] Fetch failed:", e);
    return null;
  }
}

export default async function Page() {
  const chapterData = await fetchChapterData("7");
  
  return (
    <ReaderLayout>
      <Layer2Cinema
        chapter={7}
        activePara={0}
        depth={0}
      />
      <Layer3Canvas
        chapterData={chapterData}
      />
      <Layer4Panel />
    </ReaderLayout>
  );
}
