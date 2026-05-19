import { NextResponse } from "next/server";
import { VectorStore } from "../../../services/memory-engine/vector-store";

export async function GET() {
  try {
    const store = new VectorStore();

    const dualisms =
      await store.getDualismNodes();

    return NextResponse.json({
      dualisms,
    });
  } catch (err) {
    return NextResponse.json(
      {
        dualisms: [],
        error:
          err instanceof Error
            ? err.message
            : "Graph failure",
      },
      {
        status: 500,
      }
    );
  }
}
