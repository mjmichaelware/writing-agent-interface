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

function splitParagraphs(text: string): string[] {
  // Strip CR + BOM
  const clean = text.replace(/\r/g, "").replace(/\uFEFF/g, "");

  // Try blank-line splitting first
  const byBlank = clean
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  // If that yields a healthy paragraph count (>= 10), use it.
  // Otherwise the file likely has single-newline paragraph breaks.
  if (byBlank.length >= 10) return byBlank;

  // Fallback: split on every newline, trim, drop the title line and empties.
  return clean
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0 && !/^Chapter\s+\d+:?\s/i.test(p));
}

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

        // Skip embeddings — OpenAI not funded.
        const chapterUuid = await vectorStore.insertChapter(
          manifestId,
          null as any
        );

        await vectorStore.clearParagraphs(chapterUuid);

        const paragraphs = splitParagraphs(raw);

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
