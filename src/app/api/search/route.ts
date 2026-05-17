import { EmbeddingProcessor } from "@/services/memory-engine/embedding-processor";
import { VectorStore } from "@/services/memory-engine/vector-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("term") || "";

  const embedder = new EmbeddingProcessor();
  const store = new VectorStore();

  const embedding = await embedder.embed(query);
  const results = await store.search(embedding);

  return Response.json({ results });
}
