import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Returns the raw ingestion buffer — v_local_imports in Supabase.
// This is NOT Google Drive; it's the local file registry (182 files).
export async function GET() {
  const client = sb();
  if (!client) return NextResponse.json({ files: [], error: "Supabase not configured" });

  const { data, error } = await client
    .from("v_local_imports")
    .select("drive_file_id, drive_name, local_basename, status, created_at");

  if (error) return NextResponse.json({ files: [], error: error.message }, { status: 500 });

  // Deduplicate by drive_file_id
  const seen = new Set<string>();
  const files: any[] = [];
  for (const row of data ?? []) {
    const key = row.drive_file_id || row.local_basename;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    files.push({
      id:       key,
      name:     row.drive_name || row.local_basename || key,
      status:   row.status,
      created:  row.created_at,
    });
  }

  return NextResponse.json({ files, total: files.length, source: "ingestion_buffer" });
}
