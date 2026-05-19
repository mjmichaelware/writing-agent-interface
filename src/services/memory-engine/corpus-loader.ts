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
}
