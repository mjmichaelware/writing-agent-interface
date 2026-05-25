import { CorpusFile } from "@/services/memory-engine/corpus-loader";

export class IndexStore {
  private index: Map<string, CorpusFile> = new Map();

  register(file: CorpusFile) {
    this.index.set(file.id, file);
  }

  get(id: string): CorpusFile | undefined {
    return this.index.get(id);
  }

  getAll(): CorpusFile[] {
    return Array.from(this.index.values());
  }
}

