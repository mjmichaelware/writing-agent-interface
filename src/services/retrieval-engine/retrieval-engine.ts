import { IRetrievalEngine } from "@/core/IRetrievalEngine";

export class RetrievalEngine implements IRetrievalEngine {
  async query(term: string): Promise<any> {
    return Promise.resolve({ results: [] });
  }
}
