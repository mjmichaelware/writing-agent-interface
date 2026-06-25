import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ files: [], error: 'Supabase not configured' });
  }

  // Primary: deduplicated Drive file registry (100 unique files)
  const { data: sources, error: srcErr } = await supabase
    .from('v_drive_sources')
    .select('id, name, mime_type, web_view_link, modified_time');

  if (!srcErr && sources && sources.length > 0) {
    return NextResponse.json({
      files: sources.map((f: any) => ({
        id:           f.id,
        name:         f.name ?? f.id,
        mimeType:     f.mime_type ?? '',
        modifiedTime: f.modified_time ?? '',
        webViewLink:  f.web_view_link ?? '',
      })),
      source: 'drive_sources',
      total:  sources.length,
    });
  }

  // Fallback: ingestion buffer deduplicated by drive_file_id (182 rows → unique files)
  const { data: imports, error: impErr } = await supabase
    .from('v_local_imports')
    .select('drive_file_id, drive_name, local_basename, status');

  if (impErr) {
    return NextResponse.json({ files: [], error: impErr.message });
  }

  const seen = new Set<string>();
  const files: any[] = [];
  for (const row of imports ?? []) {
    if (row.drive_file_id && !seen.has(row.drive_file_id)) {
      seen.add(row.drive_file_id);
      files.push({
        id:     row.drive_file_id,
        name:   row.drive_name ?? row.local_basename ?? row.drive_file_id,
        status: row.status,
      });
    }
  }

  return NextResponse.json({ files, source: 'local_imports', total: imports?.length ?? 0 });
}
