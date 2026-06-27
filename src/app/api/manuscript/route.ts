import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  _supabase = createClient(url, key);
  return _supabase;
}

// Match "chapter_N" or "chapterN" NOT followed by another digit.
// Uses JS regex (not SQL ILIKE) to avoid _ being treated as a wildcard.
// Correctly matches: chapter_1_, chapter_1-, chapter1_, chapter1q
// Does NOT match: chapter_10, chapter_13, chapter_10.5
function matchesChapter(folder: string, n: number): boolean {
  return new RegExp(`chapter[_\\-\\s]?${n}([^0-9]|$)`, 'i').test(folder);
}

// Pick the best source folder for display:
// - drop "notes_p_" folders (alternate drafts, not reading prose)
// - prefer folders whose name contains "final"
// - otherwise take first alphabetically (numeric prefix = stable source order)
function pickBestFolder(folders: string[]): string | null {
  if (folders.length === 0) return null;
  const clean = folders.filter((f) => !/notes_p_|_notes_/i.test(f));
  const pool = clean.length > 0 ? clean : folders;
  return pool.find((f) => /final/i.test(f)) ?? pool.sort()[0];
}

// Prose filter: skip very short lines and chapter heading lines
function isProse(text: string | null | undefined): boolean {
  if (!text) return false;
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
      // Fetch all distinct folders (only 16 total) and filter in JS with
      // a proper regex — avoids SQL ILIKE treating _ as a single-char wildcard
      // which causes chapter_1_ to incorrectly match chapter_10_, chapter_13_, etc.
      const { data: folderRows, error: folderError } = await supabase
        .from('render_paragraphs')
        .select('source_doc_folder')
        .eq('active', true);

      if (folderError) {
        return NextResponse.json({ error: folderError.message }, { status: 500 });
      }

      const allFolders = [
        ...new Set(
          (folderRows ?? [])
            .map((r: any) => r.source_doc_folder as string)
            .filter(Boolean)
        ),
      ];
      const matching = allFolders.filter((f) => matchesChapter(f, chapterNumber));
      targetFolder = pickBestFolder(matching);
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

    const prose = (data ?? []).filter((p: any) => isProse(p.text));

    return NextResponse.json(
      prose.map((p: any) => ({
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
