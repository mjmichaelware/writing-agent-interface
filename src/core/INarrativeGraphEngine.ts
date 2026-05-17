export type MetaphysicalPole = "Ascent" | "Descent" | "Void";

export interface StructuralEcho {
  sourceParagraphId: string;
  targetParagraphId: string;
  thematicLink: string;
  polarity: MetaphysicalPole;
  weight: number;
}

export interface GraphNode {
  id: string;
  chapterIndex: number;
  type: "Prose" | "Biblical" | "Archetypal";
  contentFragment: string;
}

export interface AdjacencyMatrix {
  nodes: GraphNode[];
  edges: StructuralEcho[];
}

export interface INarrativeGraphEngine {
  sync(manuscriptDataPayload: string[]): Promise<void>;
  buildAdjacencyMatrix(chapterIndex: number): Promise<AdjacencyMatrix>;
  queryEchoes(nodeId: string): Promise<StructuralEcho[]>;
}
