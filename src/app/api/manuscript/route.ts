import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { fetchDriveFileText } from '@/services/document-analyzer/gdrive-sync';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const SECURITY_FILTERS = [
  ['source_doc_folder', 'ilike', '%compendium%'],
  ['source_doc_folder', 'ilike', '%blueprint%'],
  ['source_doc_folder', 'ilike', '%mandate%'],
  ['source_doc_folder', 'ilike', '%checkpoint%'],
  ['source_doc_folder', 'ilike', '%prompt%'],
] as const;

type StandardParagraph = {
  id: string;
  chapter_number: number;
  chunk_index: number;
  content: string;
  content_hash: string | null;
  canonical: boolean;
  archetypal_weights: any;
  dualism_map: any;
  hebrew_spans: any[] | null;
  metadata: any;
  chapter_id?: string | null;
  biblical_references?: any[] | null;
  chapters?: any | null;
};

function applySecurityFilters(query: any) {
  return SECURITY_FILTERS.reduce(
    (acc, [column, operator, value]) => acc.not(column, operator, value),
    query
  );
}

function mapParagraph(row: any, chapterNumber: number, overrides: Partial<StandardParagraph> = {}): StandardParagraph {
  return {
    id: String(row?.id ?? overrides.id ?? ''),
    chapter_number: Number(row?.chapter_number ?? chapterNumber ?? overrides.chapter_number ?? 0),
    chunk_index: Number(row?.chunk_index ?? overrides.chunk_index ?? 0),
    content: String(row?.content ?? overrides.content ?? ''),
    content_hash: row?.content_hash ?? overrides.content_hash ?? null,
    canonical: Boolean(row?.canonical ?? overrides.canonical ?? false),
    archetypal_weights: row?.archetypal_weights ?? overrides.archetypal_weights ?? null,
    dualism_map: row?.dualism_map ?? overrides.dualism_map ?? null,
    hebrew_spans: row?.hebrew_spans ?? overrides.hebrew_spans ?? null,
    metadata: row?.metadata ?? overrides.metadata ?? null,
    chapter_id: row?.chapter_id ?? overrides.chapter_id ?? null,
    biblical_references: row?.biblical_references ?? overrides.biblical_references ?? null,
    chapters: row?.chapters ?? overrides.chapters ?? null,
  };
}

async function resolveChapter(supabase: ReturnType<typeof getSupabase>, chapterId: string | null, chapterNumber: number | null) {
  if (!supabase) return { error: 'Supabase not configured', status: 503 as const, chapter: null };

  let query = supabase
    .from('chapters')
    .select('id, chapter_number, prose_source, prose_source_ref');

  if (chapterId) {
    query = query.eq('id', chapterId);
  } else if (chapterNumber && chapterNumber > 0) {
    query = query.eq('chapter_number', chapterNumber);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    return { error: error.message, status: 500 as const, chapter: null };
  }

  if (!data) {
    return { error: 'Chapter not found', status: 404 as const, chapter: null };
  }

  return { error: null, status: 200 as const, chapter: data };
}

async function loadRenderParagraphs(supabase: ReturnType<typeof getSupabase>, chapterNumber: number, includeCanonical: boolean) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  let query = applySecurityFilters(
    supabase
      .from('render_paragraphs')
      .select('id, chapter_number, chunk_index, content, content_hash, canonical, archetypal_weights')
      .eq('chapter_number', chapterNumber)
      .order('chunk_index', { ascending: true })
  );

  if (includeCanonical) {
    query = query.eq('canonical', true);
  }

  return query;
}

async function loadLegacyParagraphs(supabase: ReturnType<typeof getSupabase>, chapterId: string) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  return supabase
    .from('paragraphs')
    .select('*, biblical_references(*), chapters(part_number, chapter_number)')
    .eq('chapter_id', chapterId)
    .order('chunk_index', { ascending: true });
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);

  const chapterId = searchParams.get('chapterId');
  const chapterNumberParam = searchParams.get('chapterNumber');
  const chapterNumber = chapterNumberParam ? Number(chapterNumberParam) : null;

  if (!chapterId && (!chapterNumber || chapterNumber <= 0)) {
    return NextResponse.json({ error: 'chapterId or chapterNumber required' }, { status: 400 });
  }

  const chapterResult = await resolveChapter(supabase, chapterId, chapterNumber);
  if (chapterResult.error) {
    return NextResponse.json({ error: chapterResult.error }, { status: chapterResult.status });
  }

  const chapter = chapterResult.chapter!;
  const resolvedChapterNumber = Number(chapter.chapter_number ?? chapterNumber ?? 0);
  const proseSource = String(chapter.prose_source ?? 'supabase');
  const proseSourceRef = chapter.prose_source_ref ?? null;

  if (proseSource === 'gdrive_file') {
    if (!proseSourceRef) {
      return NextResponse.json(
        {
          error: 'Drive file unavailable',
          gdrive_file_id: null,
        },
        { status: 502 }
      );
    }

    try {
      const driveFile = await fetchDriveFileText(String(proseSourceRef));
      const paragraphs = driveFile.text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .map((content, index) =>
          mapParagraph(
            {
              id: `gdrive-${index}`,
              chapter_number: resolvedChapterNumber,
              chunk_index: index,
              content,
              content_hash: null,
              canonical: true,
              archetypal_weights: null,
              dualism_map: null,
              hebrew_spans: null,
              metadata: null,
            },
            resolvedChapterNumber
          )
        );

      return NextResponse.json({
        paragraphs,
        prose_source: proseSource,
        chapter_number: resolvedChapterNumber,
      });
    } catch {
      return NextResponse.json(
        {
          error: 'Drive file unavailable',
          gdrive_file_id: String(proseSourceRef),
        },
        { status: 502 }
      );
    }
  }

  if (proseSource === 'direct_text') {
    if (proseSourceRef) {
      const { data, error } = await applySecurityFilters(
        supabase!
          .from('render_paragraphs')
          .select('id, chapter_number, chunk_index, content, content_hash, canonical, archetypal_weights')
          .eq('chapter_number', resolvedChapterNumber)
          .eq('chapter_version', String(proseSourceRef))
          .order('chunk_index', { ascending: true })
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const paragraphs = (data ?? []).map((row: any) =>
        mapParagraph(row, resolvedChapterNumber, {
          canonical: Boolean(row?.canonical ?? false),
        })
      );

      return NextResponse.json({
        paragraphs,
        prose_source: proseSource,
        chapter_number: resolvedChapterNumber,
      });
    }

    return NextResponse.json({
      paragraphs: [],
      prose_source: proseSource,
      chapter_number: resolvedChapterNumber,
    });
  }

  let renderParagraphs: StandardParagraph[] = [];

  try {
    const { data, error } = await loadRenderParagraphs(supabase, resolvedChapterNumber, true);
    if (error) throw error;
    renderParagraphs = (data ?? []).map((row: any) => mapParagraph(row, resolvedChapterNumber));
  } catch (error: any) {
    const message = error?.message ?? String(error);
    if (/canonical/i.test(message)) {
      console.warn(
        'render_paragraphs canonical filter unavailable; falling back to chunk_index ordering',
        message
      );

      try {
        const { data, error: fallbackError } = await loadRenderParagraphs(
          supabase,
          resolvedChapterNumber,
          false
        );
        if (fallbackError) throw fallbackError;
        renderParagraphs = (data ?? []).map((row: any) => mapParagraph(row, resolvedChapterNumber));
      } catch (fallbackError: any) {
        console.error('render_paragraphs fallback query failed:', fallbackError);
        return NextResponse.json(
          { error: fallbackError?.message ?? String(fallbackError) },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (renderParagraphs.length === 0) {
    if (!chapter.id) {
      return NextResponse.json({
        paragraphs: [],
        prose_source: proseSource,
        chapter_number: resolvedChapterNumber,
      });
    }

    const { data, error } = await loadLegacyParagraphs(supabase, String(chapter.id));
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const legacyParagraphs = (data ?? []).map((row: any, index: number) =>
      mapParagraph(
        {
          id: String(row?.id ?? `legacy-${index}`),
          chapter_number: Number(row?.chapters?.chapter_number ?? resolvedChapterNumber),
          chunk_index: Number(row?.chunk_index ?? index),
          content: String(row?.content ?? ''),
          content_hash: null,
          canonical: false,
          archetypal_weights: row?.archetypal_weights ?? null,
          dualism_map: row?.dualism_map ?? null,
          hebrew_spans: row?.hebrew_spans ?? null,
          metadata: row?.metadata ?? null,
          chapter_id: row?.chapter_id ?? chapter.id,
          biblical_references: row?.biblical_references ?? null,
          chapters: row?.chapters ?? null,
        },
        resolvedChapterNumber
      )
    );

    return NextResponse.json({
      paragraphs: legacyParagraphs,
      prose_source: proseSource,
      chapter_number: resolvedChapterNumber,
    });
  }

  return NextResponse.json({
    paragraphs: renderParagraphs,
    prose_source: proseSource,
    chapter_number: resolvedChapterNumber,
  });
}
