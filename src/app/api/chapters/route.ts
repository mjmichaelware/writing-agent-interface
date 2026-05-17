import { NextRequest, NextResponse } from "next/server";
import { VectorStore } from "@/services/memory-engine/vector-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "7";
  const manifestId = `chapter_${slug}`;

  try {
    const store = new VectorStore();
    const chapterId = await store.getChapterByManifestId(manifestId);

    if (!chapterId) {
      return NextResponse.json({
        slug,
        blocks: [],
        total: 0,
      });
    }

    const blocks = await store.getParagraphsByChapter(chapterId);
    return NextResponse.json({ slug, blocks, total: blocks.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
