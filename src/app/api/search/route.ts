import { VectorStore } from "@/services/memory-engine/vector-store";
import { Embedder } from "@/services/memory-engine/embedder";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = String(body?.query || "").trim();

    if (!query) {
      return Response.json({ results: [], error: "Missing query" }, { status: 400 });
    }

    const embedder = new Embedder();
    const store = new VectorStore();
    const embedding = await embedder.embed(query);
    const chapterId = await store.searchTopChapter(embedding);

    if (!chapterId) {
      return Response.json({ results: [] });
    }

    const paragraphs = await store.getParagraphsByChapter(chapterId);

    return Response.json({
      results: paragraphs.map((content, index) => ({
        index,
        content,
      })),
    });
  } catch (err) {
    console.error("[api/search]", err);
    return Response.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
