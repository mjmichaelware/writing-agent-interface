import OpenAI from "openai";

export class EmbeddingProcessor {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async embed(text: string): Promise<number[]> {
    if (!this.client) {
      throw new Error("OpenAI API key not configured");
    }

    const res = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding;
  }
}
