import React from "react";
import ReaderLayout from "../components/ReaderLayout";
import Layer2Cinema from "../components/layers/Layer2Cinema";
import Layer3Canvas from "../components/layers/Layer3Canvas";
import Layer4Panel from "../components/layers/Layer4Panel";

export const dynamic = "force-dynamic";

async function fetchChapterData(slug: string) {
  try {
    // Fetch data from your existing server-side API route
    // This runs on the server, not in the browser
    const res = await fetch(`http://localhost:3000/api/graph?slug=${slug}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("[fetchChapterData]", e);
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
