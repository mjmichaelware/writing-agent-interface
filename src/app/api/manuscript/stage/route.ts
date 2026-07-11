import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAuthorized } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { createHash } from "crypto";

const BUFFER_DIR = path.join(
  process.cwd(),
  "src/data-layer/ingestion-buffer/gdrive_raw"
);

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function sha256(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

function parseTextToParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 20);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { filename, chapterNumber } = body;
  if (!filename || !chapterNumber) {
    return NextResponse.json({ error: "filename and chapterNumber required" }, { status: 400 });
  }

  const chapterNum = Number(chapterNumber);
  if (!Number.isInteger(chapterNum) || chapterNum < 1) {
    return NextResponse.json({ error: "Invalid chapterNumber" }, { status: 400 });
  }

  // Security: prevent directory traversal
  const safeFilename = path.basename(String(filename));
  const filePath = path.join(BUFFER_DIR, safeFilename);
  if (!filePath.startsWith(BUFFER_DIR)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  let fileContent: string;
  try {
    fileContent = await fs.readFile(filePath, "utf-8");
  } catch {
    return NextResponse.json({ error: `File not found: ${safeFilename}` }, { status: 404 });
  }

  const paragraphs = parseTextToParagraphs(fileContent);
  if (paragraphs.length === 0) {
    return NextResponse.json({ error: "File has no readable paragraphs" }, { status: 400 });
  }

  const client = sb();
  if (!client) {
    // No Supabase — return parsed paragraphs for client-side preview only
    return NextResponse.json({
      staged: paragraphs.length,
      chapterNumber: chapterNum,
      filename: safeFilename,
      paragraphs,
      mode: "preview_only",
      warning: "Supabase not configured — paragraphs not persisted",
    });
  }

  const fileHash = sha256(fileContent);
  const sourceFolder = `staged_buffer/${safeFilename}`;

  // Demote existing canonical rows for this chapter so the new version takes over
  await client
    .from("render_paragraphs")
    .update({ canonical: false })
    .eq("chapter_number", chapterNum)
    .eq("canonical", true);

  // Upsert new canonical rows
  const rows = paragraphs.map((text, idx) => ({
    source_doc_folder: sourceFolder,
    source_document_xml_sha256: fileHash,
    render_para_key: `staged-ch${chapterNum}-${fileHash.slice(0, 8)}-${idx}`,
    render_index: idx,
    text,
    text_sha256: sha256(text),
    chapter_number: chapterNum,
    canonical: true,
    chapter_version: safeFilename,
    active: true,
    metadata: { staged_from_buffer: true, original_filename: safeFilename },
  }));

  const { error } = await client
    .from("render_paragraphs")
    .upsert(rows, { onConflict: "render_para_key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // CRITICAL: update chapters.prose_source so the manuscript API bypasses
  // manuscript_paragraphs and reads directly from render_paragraphs canonical rows.
  // Without this the reader always shows the old manuscript_paragraphs content.
  await client
    .from("chapters")
    .update({ prose_source: "buffer_staged", prose_source_ref: safeFilename })
    .eq("chapter_number", chapterNum);

  return NextResponse.json({
    staged: paragraphs.length,
    chapterNumber: chapterNum,
    filename: safeFilename,
    mode: "persisted",
  });
}
