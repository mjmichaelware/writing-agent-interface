import { NextRequest, NextResponse } from "next/server";
import { semanticSearch } from "@/services/retrieval-engine/vector-searcher";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("term");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await semanticSearch(query, {
      topK: 6
    });

    return NextResponse.json({
      results: results.map(r => ({
        content: r.content,
        score: r.score,
        source: r.metadata?.file
      }))
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "semantic search failed", message: err.message },
      { status: 500 }
    );
  }
}

