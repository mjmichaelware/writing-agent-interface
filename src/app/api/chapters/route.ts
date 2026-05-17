import { NextRequest, NextResponse } from "next/server";
import { EmbeddingProcessor } from "@/services/memory-engine/embedding-processor";
import { VectorStore } from "@/services/memory-engine/vector-store";

// Force Next.js to skip static pre-evaluation optimization for this route
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "7";

  try {
    // Instantiate inside the execution context so it never runs during build-time
    const embedder = new EmbeddingProcessor();
    const store = new VectorStore();

    const embedding = await embedder.embed(`chapter ${slug}`);
    const results = await store.search(embedding, 20);
    return NextResponse.json({
      slug,
      blocks: results.map((r: any) => r.content),
      total: results.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "chapter retrieval failed", message: err.message },
      { status: 500 }
    );
  }
}
