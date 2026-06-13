import { NextRequest, NextResponse } from "next/server";
import {
  getRuntimeSourceSummary,
  listRuntimeSources,
  type RuntimeSourceKind,
} from "@/lib/runtime-source-reader";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const includePreview = url.searchParams.get("preview") === "1";
  const kind = url.searchParams.get("kind") as RuntimeSourceKind | null;

  try {
    const sources = listRuntimeSources({
      includePreview,
      maxPreviewChars: 1200,
      kind: kind || undefined,
    });

    return NextResponse.json({
      status: "ok",
      activeRuntimeSources: true,
      archive: false,
      summary: getRuntimeSourceSummary(),
      sources,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        activeRuntimeSources: true,
        archive: false,
        message: error instanceof Error ? error.message : "Unknown runtime source error",
      },
      { status: 500 },
    );
  }
}
