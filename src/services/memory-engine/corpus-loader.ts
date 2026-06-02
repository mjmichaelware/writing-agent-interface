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

    // Smart filtering: Group by chapter number and pick the best version
    const chapterMap: Record<number, any> = {};

    nodes.forEach((node: any) => {
      if (!node.file_path.endsWith('.txt')) return;
      if (node.file_path.includes('Notes') || node.file_path.includes('Prompt') || node.file_path.includes('Revision')) return;

      const chapterMatch = node.file_path.match(/Chapter[:_]\s*(\d+)/i) || node.id.match(/Chapter_(\d+)/i);
      if (!chapterMatch) return;

      const chapterNumber = parseInt(chapterMatch[1], 10);
      
      // Heuristic for "best" version: (Final) > (G) > (F) > (A)
      const priority = 
        node.file_path.includes('(Final)') ? 100 :
        node.file_path.includes('(G)') ? 90 :
        node.file_path.includes('(F)') ? 80 :
        node.file_path.includes('(A)') ? 70 : 10;

      if (!chapterMap[chapterNumber] || priority > (chapterMap[chapterNumber].priority || 0)) {
        chapterMap[chapterNumber] = { ...node, priority };
      }
    });

    const toIngest = Object.values(chapterMap);
    console.log(`Starting intelligent ingestion of ${toIngest.length} canonical chapters...`);

    for (const node of toIngest) {
      try {
        const fullPath = path.join(this.baseDir, node.file_path);
        if (!fs.existsSync(fullPath)) {
          console.warn(`File not found: ${fullPath}`);
          continue;
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        
        const chapterMatch = node.file_path.match(/Chapter[:_]\s*(\d+)/i) || node.id.match(/Chapter_(\d+)/i);
        const chapterNumber = parseInt(chapterMatch![1], 10);
        
        const partNumber = chapterNumber <= 9 ? "1" : chapterNumber <= 17 ? "2" : "3";
        const manifestId = `man_${chapterNumber.toString().padStart(2, '0')}`;

        console.log(`[INGEST] Ch ${chapterNumber} | Source: ${node.file_path} | Target: ${manifestId}`);
        
        await ingestChapter(
          partNumber,
          chapterNumber,
          'drafted',
          manifestId,
          content
        );

        console.log(`✓ Success: Ch ${chapterNumber}`);
      } catch (err) {
        console.error(`✗ Failed to ingest Ch ${node.id}:`, err);
      }
    }
  }
}
