import { NextResponse } from "next/server";
import { getAll } from "@/lib/narrative/fileService";

export async function GET() {
  const files = await getAll();

  return NextResponse.json({
    status: "production",
    nodes: files.length,
    files: files.map(f => f.filename)
  });
}
