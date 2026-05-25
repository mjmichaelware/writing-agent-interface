import fs from 'fs';
import path from 'path';
import { ingestChapter } from '../ingestion/pipeline';

export interface CorpusFile {
  id: string;
  path: string;
  filename: string;
  content: string;
}

export class CorpusLoader {
  private manifestPath = path.join(process.cwd(), 'nos_manifest.json');
  private baseDir = path.join(process.cwd());

  async ingestCorpus(): Promise<void> {
    if (!fs.existsSync(this.manifestPath)) {
      throw new Error("nos_manifest.json not found");
    }

    const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf-8'));
    const nodes = manifest.nodes || [];

    // Filter for canonical chapters or specific IDs we want to ingest
    const toIngest = nodes.filter((node: any) => 
      node.file_path.endsWith('.txt') && 
      (node.id.startsWith('Chapter_') || node.id.includes('Stardust')) &&
      !node.file_path.includes('Notes') && 
      !node.file_path.includes('Prompt')
    );

    console.log(`Starting ingestion of ${toIngest.length} nodes...`);

    for (const node of toIngest) {
      try {
        const fullPath = path.join(this.baseDir, node.file_path);
        if (!fs.existsSync(fullPath)) {
          console.warn(`File not found: ${fullPath}`);
          continue;
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Extract metadata from ID or path
        const chapterMatch = node.id.match(/Chapter_(\d+)/i);
        const chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : 0;
        const partNumber = chapterNumber <= 9 ? "1" : chapterNumber <= 17 ? "2" : "3";
        const status = node.id.toLowerCase().includes('draft') ? 'drafted' : 'drafted'; // Default to drafted for now

        console.log(`Ingesting: ${node.id} (${node.file_path})`);
        
        await ingestChapter(
          partNumber,
          chapterNumber,
          status,
          node.id,
          content
        );

        console.log(`✓ Success: ${node.id}`);
      } catch (err) {
        console.error(`✗ Failed to ingest ${node.id}:`, err);
      }
    }
  }
}
