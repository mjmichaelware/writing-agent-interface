import { NextResponse } from 'next/server';
import { getDriveFileMetadata, syncDriveFolder } from '@/services/document-analyzer/gdrive-sync';
import { query } from '@/lib/db';

function isAuthorized(request: Request) {
  const expected = process.env.AUTHOR_PIN;
  const provided = request.headers.get('x-author-pin');
  return Boolean(expected && provided && provided === expected);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const mode = String(body?.mode ?? 'sync');

  if (mode === 'assign') {
    const chapterNumber = Number(body?.chapter_number);
    const gdriveFileId =
      typeof body?.gdrive_file_id === 'string' && body.gdrive_file_id.trim().length > 0
        ? body.gdrive_file_id.trim()
        : null;

    if (!Number.isInteger(chapterNumber) || chapterNumber <= 0) {
      return NextResponse.json({ error: 'chapter_number is required' }, { status: 400 });
    }

    try {
      const { rows: existing } = await query(
        `SELECT prose_source
         FROM chapters
         WHERE chapter_number = $1
         LIMIT 1`,
        [chapterNumber]
      );

      if (existing.length === 0) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }

      const previousSource = existing[0]?.prose_source ?? null;

      if (gdriveFileId === null) {
        const { rows } = await query(
          `UPDATE chapters
           SET prose_source = 'supabase',
               prose_source_ref = NULL,
               updated_at = NOW()
           WHERE chapter_number = $1
           RETURNING chapter_number, prose_source, prose_source_ref`,
          [chapterNumber]
        );

        return NextResponse.json({
          mode: 'assign',
          chapter_number: chapterNumber,
          gdrive_file_id: null,
          file_name: null,
          previous_source: previousSource,
          chapter: rows[0] ?? null,
        });
      }

      let metadata;
      try {
        metadata = await getDriveFileMetadata(gdriveFileId);
      } catch {
        return NextResponse.json(
          { error: 'Drive file not found or not accessible' },
          { status: 404 }
        );
      }

      const { rows } = await query(
        `UPDATE chapters
         SET prose_source = 'gdrive_file',
             prose_source_ref = $2,
             updated_at = NOW()
         WHERE chapter_number = $1
         RETURNING chapter_number, prose_source, prose_source_ref`,
        [chapterNumber, gdriveFileId]
      );

      return NextResponse.json({
        mode: 'assign',
        chapter_number: chapterNumber,
        gdrive_file_id: gdriveFileId,
        file_name: metadata.name,
        previous_source: previousSource,
        chapter: rows[0] ?? null,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message ?? 'Drive assignment failed' },
        { status: 500 }
      );
    }
  }

  try {
    const result = await syncDriveFolder();
    return NextResponse.json({
      mode: 'sync',
      synced: result.synced,
      errors: result.errors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Drive sync failed' },
      { status: 500 }
    );
  }
}
