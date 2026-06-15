import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (!slug) {
      // Return all chapters metadata for the TOC/Switcher from Supabase
      const { rows: chapters } = await query(
        `SELECT id, part_number, chapter_number, status, manifest_id 
         FROM chapters 
         ORDER BY part_number, chapter_number ASC`
      );
      return NextResponse.json(chapters);
    }

    // Try to find the chapter by manifest_id (man_XX) or chapter_number
    let chapterQuery = `SELECT * FROM chapters WHERE manifest_id = $1`;
    let chapterParams = [slug.startsWith('man_') ? slug : `man_${slug.padStart(2, '0')}`];

    // Fallback: check if slug is just a number
    if (isNaN(parseInt(slug)) === false && !slug.startsWith('man_')) {
      chapterQuery = `SELECT * FROM chapters WHERE chapter_number = $1 OR manifest_id = $2 LIMIT 1`;
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
      status: chapter.status,
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
