import { NextRequest, NextResponse } from "next/server";
import { vectorSearcher } from "@/services/retrieval-engine/vector-searcher";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "7";

  try {
    // treat chapter as semantic query, NOT filename
    const results = await vectorSearcher.search(`chapter ${slug}`, {
      topK: 20,
      threshold: 0.6,
    });

    return NextResponse.json({
      slug,
      blocks: results.map((r) => r.text),
      total: results.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "chapter retrieval failed", message: err.message },
      { status: 500 }
    );
  }
}
