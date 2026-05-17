import { CorpusFile } from "../../services/memory-engine/corpus-loader";

export class IndexStore {
  private files: CorpusFile[] = [];

  load(files: CorpusFile[]) {
    this.files = files;
  }

  getAll() {
    return this.files;
  }

  // semantic layer will sit above this later
}
