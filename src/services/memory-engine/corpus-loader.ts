import path from "path";
import { promises as fs } from "fs";
import { embeddingProcessor } from "./embedding-processor";
import { vectorStore } from "./vector-store";

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

  /**
   * INGESTION ONLY
   * - No runtime search
   * - No keyword logic
   * - No filename-based retrieval dependency
   */
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

      await vectorStore.upsert({
        id: file,
        vector: embedding,
        content: clean,
        metadata: {
          filename: file,
          source: "corpus-loader"
        }
      });
    }

    this.initialized = true;
  }

  /**
   * Optional reindex hook (manual only)
   */
  async reindex(): Promise<void> {
    this.initialized = false;
    await this.ingestCorpus();
  }
}
