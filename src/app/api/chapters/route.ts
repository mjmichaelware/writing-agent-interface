import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 3600;

const CHAPTER_FIELDS = `
  id,
  chapter_number,
  part_number,
  title,
  status,
  slug,
  manifest_id,
  prose_source,
  prose_source_ref
`;

const ALLOWED_PROSE_SOURCES = new Set(['supabase', 'gdrive_file', 'direct_text']);

function isAuthorized(request: NextRequest) {
  const expected = process.env.AUTHOR_PIN;
  const provided = request.headers.get('x-author-pin');
  return Boolean(expected && provided && provided === expected);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (!slug) {
      // Return all chapters metadata for the TOC/Switcher from Supabase
      const { rows: chapters } = await query(
        `SELECT ${CHAPTER_FIELDS}
         FROM chapters 
         ORDER BY chapter_number ASC`
      );
      return NextResponse.json(chapters);
    }

    // Try to find the chapter by manifest_id (man_XX) or chapter_number
    let chapterQuery = `SELECT ${CHAPTER_FIELDS} FROM chapters WHERE manifest_id = $1`;
    let chapterParams: (string | number)[] = [
      slug.startsWith('man_') ? slug : `man_${slug.padStart(2, '0')}`,
    ];

    // Fallback: check if slug is just a number
    if (isNaN(parseInt(slug)) === false && !slug.startsWith('man_')) {
      chapterQuery = `SELECT ${CHAPTER_FIELDS} FROM chapters WHERE chapter_number = $1 OR manifest_id = $2 LIMIT 1`;
      chapterParams = [parseInt(slug), `man_${slug.padStart(2, '0')}`];
    }

    const { rows: chapters } = await query(chapterQuery, chapterParams);

    if (chapters.length === 0) {
      return NextResponse.json(
        { error: `Chapter ${slug} not found in database` },
        { status: 404 }
      );
    }

    const chapter = chapters[0];

    // Get paragraphs for this chapter
    const { rows: paragraphs } = await query(
      `SELECT id, content, chunk_index, archetypal_weights, dualism_map, hebrew_spans, metadata
       FROM paragraphs 
       WHERE chapter_id = $1 
       ORDER BY chunk_index ASC`,
      [chapter.id]
    );

    return NextResponse.json({
      id: chapter.id,
      manifest_id: chapter.manifest_id,
      chapter_number: chapter.chapter_number,
      part_number: chapter.part_number,
      title: chapter.title,
      status: chapter.status,
      slug: chapter.slug,
      prose_source: chapter.prose_source,
      prose_source_ref: chapter.prose_source_ref,
      blocks: paragraphs.map(p => ({
        id: p.id,
        content: p.content,
        archetypal_weights: p.archetypal_weights,
        dualism_map: p.dualism_map,
        hebrew_spans: p.hebrew_spans,
        metadata: p.metadata
      }))
    });
  } catch (e: any) {
    console.error("API Chapters Error:", e);
    return NextResponse.json(
      { error: `Database error: ${e.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const chapterNumber = Number(body?.chapter_number);
  const proseSource = String(body?.prose_source ?? '');
  const proseSourceRef =
    typeof body?.prose_source_ref === 'string' && body.prose_source_ref.trim().length > 0
      ? body.prose_source_ref.trim()
      : null;

  if (!Number.isInteger(chapterNumber) || chapterNumber <= 0) {
    return NextResponse.json({ error: 'chapter_number is required' }, { status: 400 });
  }

  if (!ALLOWED_PROSE_SOURCES.has(proseSource)) {
    return NextResponse.json(
      { error: 'prose_source must be one of supabase, gdrive_file, or direct_text' },
      { status: 400 }
    );
  }

  const nextProseSourceRef = proseSource === 'supabase' ? null : proseSourceRef;

  try {
    const { rows } = await query(
      `UPDATE chapters
       SET prose_source = $1,
           prose_source_ref = $2,
           updated_at = NOW()
       WHERE chapter_number = $3
       RETURNING ${CHAPTER_FIELDS}`,
      [proseSource, nextProseSourceRef, chapterNumber]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (e: any) {
    console.error('Chapter patch error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
