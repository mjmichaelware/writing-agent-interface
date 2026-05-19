import React from "react";
import ReaderLayout from "../components/ReaderLayout";
import Layer2Cinema from "../components/layers/Layer2Cinema";
import Layer3Canvas from "../components/layers/Layer3Canvas";
import Layer4Panel from "../components/layers/Layer4Panel";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

async function fetchChapterData(slug: string) {
  try {
    const store = new VectorStore();

    const manifestPath = path.join(
      process.cwd(),
      "nos_manifest.json"
    );

    const manifestRaw = await fs.readFile(
      manifestPath,
      "utf-8"
    );

    const manifest = JSON.parse(
      manifestRaw || '{"nodes":[]}'
    );

    const targetNode = (manifest.nodes || []).find(
      (n: any) =>
        String(n.id)
          .toLowerCase()
          .includes(`chapter_${slug}`)
    );

    if (!targetNode) {
      return null;
    }

    const matchedChapterId =
      await store.getChapterByManifestId(
        targetNode.id
      );

    if (!matchedChapterId) {
      return null;
    }

    const blocks =
      await store.getParagraphsByChapter(
        matchedChapterId
      );

    return {
      slug,
      blocks,
      total: blocks.length,
    };
  } catch (e) {
    console.error("[fetchChapterData]", e);
    return null;
  }
}

export default async function Page() {
  const chapterData =
    await fetchChapterData("7");

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
