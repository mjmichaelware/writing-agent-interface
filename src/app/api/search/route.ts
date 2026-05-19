import { NextResponse } from "next/server";
import { VectorStore } from "../../../services/memory-engine/vector-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const query = String(
      body?.query || ""
    ).trim();

    if (!query) {
      return NextResponse.json({
        results: [],
      });
    }

    const store = new VectorStore();

    const results = await store.searchParagraphs(
      query
    );

    return NextResponse.json({
      results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        results: [],
        error:
          err instanceof Error
            ? err.message
            : "Search failure",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(
      request.url
    );

    const query = String(
      searchParams.get("q") ||
      searchParams.get("type") ||
      ""
    ).trim();

    if (!query) {
      return NextResponse.json({
        results: [],
      });
    }

    const store = new VectorStore();

    const results = await store.searchParagraphs(
      query
    );

    return NextResponse.json({
      results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        results: [],
        error:
          err instanceof Error
            ? err.message
            : "Search failure",
      },
      {
        status: 500,
      }
    );
  }
}
