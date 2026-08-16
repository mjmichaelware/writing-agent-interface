import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const LOCAL_BUFFER_DIR = path.join(
  process.cwd(),
  "src/data-layer/ingestion-buffer/gdrive_raw"
);

// Returns the full ingestion buffer — both the Supabase v_local_imports registry
// AND the local filesystem buffer at src/data-layer/ingestion-buffer/gdrive_ooxml_raw/.
// These are separate from Google Drive; they are staged local files.
export async function GET() {
  const seen = new Set<string>();
  const files: any[] = [];

  // Primary: Supabase v_local_imports registry (up to 182 files)
  const client = sb();
  if (client) {
    const { data } = await client
      .from("v_local_imports")
      .select("drive_file_id, drive_name, local_basename, status, created_at");

    for (const row of data ?? []) {
      const id = row.drive_file_id || row.local_basename;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      files.push({
        id,
        name:    row.drive_name || row.local_basename || id,
        status:  row.status || "registered",
        source:  "supabase",
      });
    }
  }

  // Secondary: local filesystem buffer (files already pulled from Drive)
  try {
    const entries = await fs.readdir(LOCAL_BUFFER_DIR);
    for (const name of entries) {
      const id = name;
      if (seen.has(id)) continue;
      seen.add(id);
      // Human-readable label: strip extension, replace underscores/hyphens with spaces
      const label = name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
      files.push({
        id,
        name:    label || name,
        status:  "local",
        source:  "filesystem",
        filename: name,
      });
    }
  } catch {
    // Directory may not exist in all environments
  }

  return NextResponse.json({ files, total: files.length, source: "ingestion_buffer" });
}
