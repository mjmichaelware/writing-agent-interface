import { createClient } from "@supabase/supabase-js";

export class VectorStore {
  private client = createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  async searchParagraphs(query: string) {
    const { data, error } = await this.client.rpc("match_paragraphs", {
      query_text: query,
      match_threshold: 0.5,
      match_count: 10,
    });
    
    if (error) {
      console.error("VectorStore search error:", error);
      return [];
    }
    return data || [];
  }
}
