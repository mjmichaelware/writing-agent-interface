import { NextResponse } from "next/server";
import { VectorStore } from "@/services/memory-engine/vector-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = String(searchParams.get("q") || "").trim();
    const type = searchParams.get("type") || "general";

    if (!query) {
      return NextResponse.json({ results: [], archetypes: [], records: [] });
    }

    const store = new VectorStore();

    // Safe ILIKE search — works without full-text index
    const results = await store.searchParagraphs(query);

    return NextResponse.json({ results, type });
  } catch (err) {
    console.error("[search/route]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Search failed" },
      { status: 500 }
    );
  }
}
