import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Returns LIKE patterns that match a chapter number in the folder name.
// Covers: "chapter_1_", "chapter_1-", "chapter1_", "chapter1q", etc.
function chapterFolderPatterns(n: number): string[] {
  return [
    `%chapter_${n}_%`,
    `%chapter_${n}-%`,
    `%chapter${n}_%`,
    `%chapter${n}-%`,
    `%chapter${n}q%`,
  ];
}

// Among discovered folders for a chapter, pick the best one for reading:
// - drop folders whose name signals they are notes/drafts (notes_p_, _notes_)
// - prefer folders whose name contains "final"
// - otherwise take the first alphabetically (numeric prefix = original source order)
function pickBestFolder(folders: string[]): string | null {
  if (folders.length === 0) return null;
  const clean = folders.filter((f) => !/notes_p_|_notes_/i.test(f));
  const pool = clean.length > 0 ? clean : folders;
  const withFinal = pool.find((f) => /final/i.test(f));
  return withFinal ?? pool.sort()[0];
}

// Prose filter: skip very short strings and chapter headings that bleed into render_paragraphs
function isProse(text: string): boolean {
  const t = text.trim();
  return t.length > 40 && !/^CHAPTER\s+\d+/i.test(t);
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);

  const chapterNumber = parseInt(searchParams.get('chapterNumber') ?? '0', 10);
  const sourceFolder = searchParams.get('sourceFolder') ?? null;

  // --- Semantic path: query render_paragraphs from the pipeline ---
  if ((chapterNumber > 0 || sourceFolder) && supabase) {
    let targetFolder = sourceFolder;

    if (!targetFolder && chapterNumber > 0) {
      const patterns = chapterFolderPatterns(chapterNumber);
      const seen = new Set<string>();

      for (const pattern of patterns) {
        const { data } = await supabase
          .from('render_paragraphs')
          .select('source_doc_folder')
          .ilike('source_doc_folder', pattern)
          .eq('active', true)
          .limit(100);

        for (const row of data ?? []) seen.add(row.source_doc_folder);
      }

      targetFolder = pickBestFolder([...seen]);
    }

    if (!targetFolder) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from('render_paragraphs')
      .select('render_para_key, render_index, text, source_doc_folder')
      .eq('source_doc_folder', targetFolder)
      .eq('active', true)
      .order('render_index', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const prose = (data ?? []).filter((p) => isProse(p.text));

    return NextResponse.json(
      prose.map((p) => ({
        id: p.render_para_key,
        content: p.text,
        archetypal_weights: {},
        dualism_map: {},
      }))
    );
  }

  // --- Legacy path: chapterId against the paragraphs table ---
  const chapterId = searchParams.get('chapterId');

  if (chapterId && supabase) {
    const { data, error } = await supabase
      .from('paragraphs')
      .select('*, biblical_references(*), chapters(part_number, chapter_number)')
      .eq('chapter_id', chapterId)
      .order('chunk_index', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  return NextResponse.json({ error: 'chapterNumber or chapterId required' }, { status: 400 });
}
