import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: "online",
      nodes: [],
      total: 0,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "graph failed", message: err.message },
      { status: 500 }
    );
  }
}
