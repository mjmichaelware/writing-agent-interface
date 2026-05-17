import path from "path";
import { promises as fs } from "fs";
import { VectorStore } from "./vector-store";

// 13 canonical chapter picks. Slug → filename in gdrive_raw/.
const PICKS: Record<number, string> = {
  1:  "(R)_Chapter:_1_-_Stardust_to_Stardust_.txt",
  2:  "(G)_Chapter_2-_Living_Sacrifice.txt",
  3:  "(Final)_Chapter_3-_Lift_Up.txt",
  4:  "*Chapter_4:_Pilgrimage.txt",
  5:  "(Final)_Chapter_5_-_The_Snare.txt",
  6:  "(C)_Chapter_6-_Beelzebub,_Beelzebub.txt",
  7:  "(Final) Chapter: 7 - The Pit.txt",
  8:  "Chapter:_8_(Final).txt",
  9:  "*Chapter_9:_The_Ascent.txt",
  10: "(G)_Final_)_Chapter:_10_-_Forsaken.txt",
  11: "Chapter_11._Forsaken.txt",
  13: "Chapter_13:_Exodus.txt",
  24: "Chapter_2nd_to_last.txt",
};

const RAW_DIR = path.join(
  process.cwd(),
  "src/data-layer/ingestion-buffer/gdrive_raw"
);

export class CorpusLoader {
  private initialized = false;

  async ingestCorpus(): Promise<void> {
    if (this.initialized) return;

    const vectorStore = new VectorStore();

    for (const [slug, filename] of Object.entries(PICKS)) {
      const manifestId = `chapter_${slug}`;
      const filePath = path.join(RAW_DIR, filename);

      try {
        const raw = await fs.readFile(filePath, "utf-8");

        const clean = raw
          .replace(/\r/g, "")
          .replace(/\uFEFF/g, "");

        // Skip embeddings — OpenAI not funded. Re-run ingest later to backfill.
        const chapterUuid = await vectorStore.insertChapter(
          manifestId,
          null as any
        );

        await vectorStore.clearParagraphs(chapterUuid);

        const paragraphs = clean
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean);

        for (let i = 0; i < paragraphs.length; i++) {
          await vectorStore.insertParagraph(
            chapterUuid,
            i,
            paragraphs[i]
          );
        }

        console.log(`[INGEST] ${manifestId} -> ${paragraphs.length} blocks`);
      } catch (err: any) {
        console.error(`[INGEST ERROR] ${manifestId} (${filename}):`, err.message);
      }
    }

    this.initialized = true;
  }

  async reindex(): Promise<void> {
    this.initialized = false;
    await this.ingestCorpus();
  }
}
