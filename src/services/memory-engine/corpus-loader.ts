export interface CorpusFile {
  id: string;
  path: string;
  filename: string;
  content: string;
}

export class CorpusLoader {
  async load(path: string): Promise<CorpusFile> {
    return { id: "default", path, filename: path.split('/').pop() || "", content: "" };
  }
  
  async ingestCorpus(): Promise<void> {
    // Contract implementation to satisfy IngestAction
    return Promise.resolve();
  }
}
