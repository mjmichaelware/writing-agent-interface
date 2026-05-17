import OpenAI from "openai";

export class EmbeddingProcessor {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async embed(text: string): Promise<number[]> {
    const res = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return res.data[0].embedding;
  }
}
