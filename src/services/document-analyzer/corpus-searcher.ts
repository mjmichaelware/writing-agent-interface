import { promises as fs } from "fs";
import path from "path";

export interface SearchResult {
  file: string;
  snippet: string;
}

export class CorpusSearcher {
  private corpusPath = path.join(process.cwd(), "src/data-layer/ingestion-buffer/gdrive_raw");

  async search(term: string): Promise<SearchResult[]> {
    try {
      const files = await fs.readdir(this.corpusPath);
      const results: SearchResult[] = [];
      const query = term.toLowerCase();

      for (const file of files) {
        if (!file.endsWith(".txt")) continue;
        const fullPath = path.join(this.corpusPath, file);
        const content = await fs.readFile(fullPath, "utf-8");

        if (content.toLowerCase().includes(query)) {
          const lines = content.split("\n");
          const matchLine = lines.find(l => l.toLowerCase().includes(query)) || "";
          results.push({
            file,
            snippet: matchLine.trim().substring(0, 160)
          });
        }
      }
      return results;
    } catch {
      return [];
    }
  }
}
