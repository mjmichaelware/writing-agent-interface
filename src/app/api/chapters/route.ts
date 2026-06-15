import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SERVICE_ROLE_KEY ||
    process.env.SETVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required'
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeManifestSlug(slug: string) {
  if (slug.startsWith('man_')) return slug;
  return `man_${slug.padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    const supabase = getSupabaseAdmin();

    if (!slug) {
      const { data, error } = await supabase
        .from('chapters')
        .select('id, part_number, chapter_number, status, manifest_id')
        .order('part_number', { ascending: true })
        .order('chapter_number', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json(data ?? []);
    }

    const manifestId = normalizeManifestSlug(slug);
    const numericSlug = Number.parseInt(slug, 10);

    let chapter: any = null;

    const byManifest = await supabase
      .from('chapters')
      .select('*')
      .eq('manifest_id', manifestId)
      .limit(1)
      .maybeSingle();

    if (byManifest.error) {
      throw new Error(byManifest.error.message);
    }

    chapter = byManifest.data;

    if (!chapter && Number.isFinite(numericSlug) && !slug.startsWith('man_')) {
      const byNumber = await supabase
        .from('chapters')
        .select('*')
        .eq('chapter_number', numericSlug)
        .limit(1)
        .maybeSingle();

      if (byNumber.error) {
        throw new Error(byNumber.error.message);
      }

      chapter = byNumber.data;
    }

    if (!chapter) {
      return NextResponse.json(
        { error: `Chapter ${slug} not found in database` },
        { status: 404 }
      );
    }

    const { data: paragraphs, error: paragraphError } = await supabase
      .from('paragraphs')
      .select('id, content, chunk_index, archetypal_weights, dualism_map, hebrew_spans, metadata')
      .eq('chapter_id', chapter.id)
      .order('chunk_index', { ascending: true });

    if (paragraphError) {
      throw new Error(paragraphError.message);
    }

    return NextResponse.json({
      id: chapter.id,
      manifest_id: chapter.manifest_id,
      chapter_number: chapter.chapter_number,
      part_number: chapter.part_number,
      status: chapter.status,
      blocks: (paragraphs ?? []).map((p: any) => ({
        id: p.id,
        content: p.content,
        archetypal_weights: p.archetypal_weights,
        dualism_map: p.dualism_map,
        hebrew_spans: p.hebrew_spans,
        metadata: p.metadata,
      })),
    });
  } catch (e: any) {
    console.error('API Chapters Error:', e);
    return NextResponse.json(
      { error: `Supabase chapters error: ${e?.message || 'unknown error'}` },
      { status: 500 }
    );
  }
}
