import { OpenAI } from 'openai';
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

type MatchRow = {
  id: string;
  content: string;
  chapter_number: number | null;
  chapter_slug: string;
  similarity_score: number;
  match_type: 'cosine' | 'keyword';
};

let paragraphSourceFilterSupported: boolean | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function embedQueryText(text: string) {
  const client = getOpenAI();
  if (!client) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0]?.embedding ?? [];
}

async function supportsParagraphSourceFilter() {
  if (paragraphSourceFilterSupported !== null) {
    return paragraphSourceFilterSupported;
  }

  try {
    const { rows } = await query(
      `SELECT 1
       FROM information_schema.columns
       WHERE table_name = 'paragraphs'
         AND column_name = 'source_doc_folder'
       LIMIT 1`
    );
    paragraphSourceFilterSupported = rows.length > 0;
  } catch {
    paragraphSourceFilterSupported = false;
  }

  return paragraphSourceFilterSupported;
}

async function cosineSearch(text: string, chapter: number | null) {
  const embedding = await embedQueryText(text);
  if (!embedding.length) return [] as MatchRow[];

  const params: any[] = [JSON.stringify(embedding)];
  let chapterClause = '';
  const sourceFilter = (await supportsParagraphSourceFilter())
    ? `AND COALESCE(p.source_doc_folder, '') !~* '(compendium|blueprint|mandate|checkpoint|prompt)'`
    : '';

  if (chapter) {
    params.push(chapter);
    chapterClause = 'AND c.chapter_number = $2';
  }

  const { rows } = await query(
    `
      SELECT
        p.id::text AS id,
        p.content,
        c.chapter_number,
        COALESCE(c.slug, c.manifest_id, CONCAT('chapter-', c.chapter_number)) AS chapter_slug,
        1 - (p.embedding <=> $1::vector) AS similarity_score
      FROM paragraphs p
      JOIN chapters c
        ON c.id = p.chapter_id
      WHERE p.embedding IS NOT NULL
        ${chapterClause}
        ${sourceFilter}
      ORDER BY p.embedding <=> $1::vector
      LIMIT 10
    `,
    params
  );

  return rows.map((row) => ({
    id: String(row.id),
    content: String(row.content ?? ''),
    chapter_number: row.chapter_number == null ? null : Number(row.chapter_number),
    chapter_slug: String(row.chapter_slug ?? ''),
    similarity_score: Number(row.similarity_score ?? 0),
    match_type: 'cosine' as const,
  }));
}

async function keywordSearch(text: string, chapter: number | null) {
  const params: any[] = [`%${text}%`];
  let chapterClause = '';
  const sourceFilter = (await supportsParagraphSourceFilter())
    ? `AND COALESCE(p.source_doc_folder, '') !~* '(compendium|blueprint|mandate|checkpoint|prompt)'`
    : '';

  if (chapter) {
    params.push(chapter);
    chapterClause = 'AND c.chapter_number = $2';
  }

  const { rows } = await query(
    `
      SELECT DISTINCT ON (p.id)
        p.id::text AS id,
        p.content,
        c.chapter_number,
        COALESCE(c.slug, c.manifest_id, CONCAT('chapter-', c.chapter_number)) AS chapter_slug,
        CASE
          WHEN p.content ILIKE $1 THEN 0.95
          ELSE 0.75
        END AS similarity_score
      FROM paragraphs p
      JOIN chapters c
        ON c.id = p.chapter_id
      LEFT JOIN biblical_references br
        ON br.paragraph_id = p.id
      WHERE (
          p.content ILIKE $1
          OR COALESCE(br.reference_text, '') ILIKE $1
          OR COALESCE(br.book, '') ILIKE $1
        )
        ${chapterClause}
        ${sourceFilter}
      ORDER BY p.id, similarity_score DESC, c.chapter_number ASC, p.chunk_index ASC
      LIMIT 20
    `,
    params
  );

  return rows.map((row) => ({
    id: String(row.id),
    content: String(row.content ?? ''),
    chapter_number: row.chapter_number == null ? null : Number(row.chapter_number),
    chapter_slug: String(row.chapter_slug ?? ''),
    similarity_score: Number(row.similarity_score ?? 0),
    match_type: 'keyword' as const,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const mode = (searchParams.get('mode') || 'both').trim();
  const chapterParam = searchParams.get('chapter');
  const chapter = chapterParam ? Number(chapterParam) : null;

  if (!q) {
    return NextResponse.json({ error: 'q is required' }, { status: 400 });
  }

  if (!['cosine', 'keyword', 'both'].includes(mode)) {
    return NextResponse.json({ error: 'mode must be cosine, keyword, or both' }, { status: 400 });
  }

  try {
    const cosineResults = mode === 'keyword' ? [] : await cosineSearch(q, chapter);
    const keywordResults = mode === 'cosine' ? [] : await keywordSearch(q, chapter);

    const merged = new Map<string, MatchRow>();
    [...cosineResults, ...keywordResults].forEach((result) => {
      const existing = merged.get(result.id);
      if (!existing) {
        merged.set(result.id, result);
        return;
      }

      if (existing.match_type === 'cosine') {
        return;
      }

      if (result.match_type === 'cosine' || result.similarity_score > existing.similarity_score) {
        merged.set(result.id, result);
      }
    });

    const results = [...merged.values()]
      .sort((a, b) => {
        if (a.match_type !== b.match_type) {
          return a.match_type === 'cosine' ? -1 : 1;
        }
        return b.similarity_score - a.similarity_score;
      })
      .slice(0, 10);

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Semantic search failed' },
      { status: 500 }
    );
  }
}
