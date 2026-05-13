import { promises as fs } from 'fs';
import path from 'path';

export class CorpusLoader {
  private corpusPath: string;

  constructor() {
    // Dynamically locates the gdrive_raw folder in the Next.js environment
    this.corpusPath = path.join(process.cwd(), 'src', 'data-layer', 'ingestion-buffer', 'gdrive_raw');
  }

  public async loadAllFiles(): Promise<{ filename: string; content: string }[]> {
    const files = await fs.readdir(this.corpusPath);
    const loadedFiles = [];

    for (const file of files) {
      // Ignore hidden files and non-text files
      if (!file.startsWith('.') && file.endsWith('.txt')) {
        const filePath = path.join(this.corpusPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        loadedFiles.push({ filename: file, content });
      }
    }
    
    return loadedFiles;
  }
}
