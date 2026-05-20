import React from "react";
import ReaderLayout from "@/components/ReaderLayout";
import Layer2Cinema from "@/components/layers/Layer2Cinema";
import Layer3Canvas from "@/components/layers/Layer3Canvas";
import Layer4Panel from "@/components/layers/Layer4Panel";

export const dynamic = "force-dynamic";

async function getChapterData(slug: string) {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/chapters?slug=${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        slug,
        blocks: [],
        error: "This chapter is not yet available.",
      };
    }

    const data = await res.json();

    return {
      slug,
      blocks: Array.isArray(data.blocks) ? data.blocks : [],
      metadata: data.metadata ?? {},
      total: data.total ?? 0,
    };
  } catch {
    return {
      slug,
      blocks: [],
      error: "This chapter is not yet available.",
    };
  }
}

export default async function Page() {
  const chapterData = await getChapterData("7");

  return (
    <ReaderLayout>
      <Layer2Cinema chapterSlug="7" />
      <Layer3Canvas chapterData={chapterData} />
      <Layer4Panel />
    </ReaderLayout>
  );
}
