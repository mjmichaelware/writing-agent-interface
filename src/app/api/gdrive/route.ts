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

  // Pull the deduplicated Drive file registry from nos.drive_sources (100 unique files).
  // Falls back to deduped nos.local_imports if drive_sources is empty.
  const { data: sources, error: srcErr } = await supabase
    .schema('nos' as any)
    .from('drive_sources')
    .select('drive_file_id, drive_name, mime_type, modified_time, web_view_link')
    .order('drive_name', { ascending: true });

  if (!srcErr && sources && sources.length > 0) {
    return NextResponse.json({
      files: sources.map((f: any) => ({
        id:           f.drive_file_id,
        name:         f.drive_name ?? f.drive_file_id,
        mimeType:     f.mime_type ?? '',
        modifiedTime: f.modified_time ?? '',
        webViewLink:  f.web_view_link ?? '',
      })),
      source: 'drive_sources',
      total:  sources.length,
    });
  }

  // Fallback: deduplicate local_imports by drive_file_id
  const { data: imports, error: impErr } = await supabase
    .schema('nos' as any)
    .from('local_imports')
    .select('drive_file_id, drive_name, local_basename, status')
    .order('target_index', { ascending: true });

  if (impErr) {
    return NextResponse.json({ files: [], error: impErr.message });
  }

  const seen = new Set<string>();
  const files: any[] = [];
  for (const row of imports ?? []) {
    if (row.drive_file_id && !seen.has(row.drive_file_id)) {
      seen.add(row.drive_file_id);
      files.push({
        id:       row.drive_file_id,
        name:     row.drive_name ?? row.local_basename ?? row.drive_file_id,
        status:   row.status,
      });
    }
  }

  return NextResponse.json({ files, source: 'local_imports', total: imports?.length ?? 0 });
}
