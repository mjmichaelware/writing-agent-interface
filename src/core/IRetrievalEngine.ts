export interface IRetrievalEngine {
  query(term: string): Promise<any>;
}
