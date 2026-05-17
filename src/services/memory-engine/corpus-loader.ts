import path from "path";
import { promises as fs } from "fs";
import { EmbeddingProcessor } from "./embedding-processor";
import { VectorStore } from "./vector-store";

const embeddingProcessor = new EmbeddingProcessor();
const vectorStore = new VectorStore();

const CORPUS_PATH = path.join(
  process.cwd(),
  "src/data-layer/ingestion-buffer/gdrive_raw"
);

export type CorpusFile = {
  filename: string;
  content: string;
  embedding: number[];
};

export class CorpusLoader {
  private initialized = false;

  async ingestCorpus(): Promise<void> {
    if (this.initialized) return;
    const files = await fs.readdir(CORPUS_PATH);

    for (const file of files) {
      if (!file.endsWith(".txt")) continue;
      const fullPath = path.join(CORPUS_PATH, file);
      const raw = await fs.readFile(fullPath, "utf-8");
      const clean = raw
        .replace(/\r/g, "")
        .replace(/\uFEFF/g, "");
      const embedding = await embeddingProcessor.embed(clean);

      await vectorStore.insertDocument(file, 0, clean, embedding);
    }

    this.initialized = true;
  }

  async reindex(): Promise<void> {
    this.initialized = false;
    await this.ingestCorpus();
  }
}
