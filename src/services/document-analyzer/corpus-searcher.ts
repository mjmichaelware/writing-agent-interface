import { CorpusLoader } from '../memory-engine/corpus-loader';

export class CorpusSearcher {
  private loader: CorpusLoader;

  constructor() {
    this.loader = new CorpusLoader();
  }

  // Searches the 181 files for lore related to the extracted threat
  public async searchLore(keyword: string): Promise<string[]> {
    const allFiles = await this.loader.loadAllFiles();
    const results: string[] = [];

    for (const file of allFiles) {
      if (file.content.toLowerCase().includes(keyword.toLowerCase())) {
        // Grab a 300-character window around the keyword for context
        const index = file.content.toLowerCase().indexOf(keyword.toLowerCase());
        const snippet = file.content.substring(Math.max(0, index - 100), Math.min(file.content.length, index + 200));
        results.push(`[Source: ${file.filename}] ...${snippet}...`);
      }
    }
    return results;
  }
}
