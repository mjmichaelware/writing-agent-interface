import { semanticSearch } from "@/services/retrieval-engine/vector-searcher";

export type CorpusSearchResult = {
  content: string;
  score: number;
  file?: string;
  chunkId?: string;
};

export class CorpusSearcher {
  /**
   * PURE SEMANTIC RETRIEVAL ONLY
   * - No keyword matching
   * - No string scanning
   * - No filename dependency
   */
  async search(query: string, topK: number = 5): Promise<CorpusSearchResult[]> {
    if (!query || !query.trim()) return [];

    const results = await semanticSearch(query, { topK });

    return results.map((r: any) => ({
      content: r.content,
      score: r.score,
      file: r.metadata?.file,
      chunkId: r.metadata?.chunkId,
    }));
  }
}
