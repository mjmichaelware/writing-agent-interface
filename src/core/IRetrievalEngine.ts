export interface TheologicalMetric {
  id: string;
  referenceContext: string;
  contextualFootprint: string;
  weight: number;
}

export interface RetrievalSchema {
  term: string;
  strictMode: boolean;
  allowedNodes: string[];
}

export interface IRetrievalEngine {
  query(term: string, schema: RetrievalSchema): Promise<TheologicalMetric[]>;
  scanContext(paragraphId: string): Promise<TheologicalMetric[]>;
}
