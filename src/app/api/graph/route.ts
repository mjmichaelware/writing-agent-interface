import { NextResponse } from "next/server";
import { vectorSearcher } from "@/services/retrieval-engine/vector-searcher";

export async function GET() {
  try {
    const nodes = await vectorSearcher.getIndexedNodes();

    return NextResponse.json({
      status: "online",
      nodes: nodes.map((n) => ({
        id: n.id,
        embedding_cluster: n.cluster,
        type: n.type,
      })),
      total: nodes.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "graph failed", message: err.message },
      { status: 500 }
    );
  }
}
