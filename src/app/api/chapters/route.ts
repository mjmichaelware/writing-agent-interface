import { NextRequest, NextResponse } from "next/server";
import { VectorStore } from "@/services/memory-engine/vector-store";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const slug = searchParams.get("slug") ?? "7";

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

    const normalizedSlug = String(slug).toLowerCase();

    const targetNode = (manifest.nodes || []).find(
      (n: any) => {
        const id = String(n.id).toLowerCase();

        return (
          id.includes(`chapter_${normalizedSlug}`) ||
          id.includes(`chapter:_${normalizedSlug}`)
        );
      }
    );

    if (!targetNode) {
      return NextResponse.json(
        {
          error: `No manifest node found for slug ${slug}`,
        },
        { status: 404 }
      );
    }

    const matchedChapterId =
      await store.getChapterByManifestId(
        targetNode.id
      );

    if (!matchedChapterId) {
      return NextResponse.json({
        slug,
        blocks: [],
        total: 0,
      });
    }

    const chronologicalParagraphs =
      await store.getParagraphsByChapter(
        matchedChapterId
      );

    return NextResponse.json({
      slug,
      blocks: chronologicalParagraphs,
      total: chronologicalParagraphs.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          "Hierarchical relational retrieval failure",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
