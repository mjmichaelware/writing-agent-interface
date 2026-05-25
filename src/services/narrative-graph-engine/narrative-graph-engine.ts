import { INarrativeGraphEngine, AdjacencyMatrix, StructuralEcho } from "@/core/INarrativeGraphEngine";

export class NarrativeGraphEngine implements INarrativeGraphEngine {
  async sync(manuscriptDataPayload: string[]): Promise<void> {
    return Promise.resolve();
  }

  async buildAdjacencyMatrix(chapterIndex: number): Promise<AdjacencyMatrix> {
    return Promise.resolve({ nodes: [], edges: [] });
  }

  async queryEchoes(nodeId: string): Promise<StructuralEcho[]> {
    return Promise.resolve([]);
  }
}
