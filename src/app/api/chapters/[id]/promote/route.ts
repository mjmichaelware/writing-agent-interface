import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

function isAuthorized(request: Request) {
  const expected = process.env.AUTHOR_PIN || '9187';
  const provided = request.headers.get('x-author-pin');
  return Boolean(expected && provided && provided === expected);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const chapterNumber = Number(body?.chapter_number);
  const versionTag = typeof body?.version_tag === 'string' ? body.version_tag.trim() : '';

  if (!Number.isInteger(chapterNumber) || chapterNumber <= 0) {
    return NextResponse.json({ error: 'chapter_number is required' }, { status: 400 });
  }

  if (!versionTag) {
    return NextResponse.json({ error: 'version_tag is required' }, { status: 400 });
  }

  try {
    const { data: currentRows, error: currentError } = await supabase
      .from('manuscript_paragraphs')
      .select('id, generated_image_hash')
      .eq('chapter_number', chapterNumber)
      .not('generated_image_hash', 'is', null);

    if (currentError) {
      throw currentError;
    }

    const invalidatedHashes = (currentRows ?? [])
      .map((row: any) => row?.generated_image_hash)
      .filter((value: any): value is string => typeof value === 'string' && value.length > 0);

    const { data: demotedRows, error: demoteError } = await supabase
      .from('manuscript_paragraphs')
      .update({
        is_promoted: false,
        generated_image_hash: null,
      })
      .eq('chapter_number', chapterNumber)
      .neq('chapter_version', versionTag)
      .select('id');

    if (demoteError) {
      throw demoteError;
    }

    const { data: promotedRows, error: promoteError } = await supabase
      .from('manuscript_paragraphs')
      .update({
        is_promoted: true,
        generated_image_hash: null,
      })
      .eq('chapter_number', chapterNumber)
      .eq('chapter_version', versionTag)
      .select('id');

    if (promoteError) {
      throw promoteError;
    }

    return NextResponse.json({
      promoted_count: promotedRows?.length ?? 0,
      invalidated_hashes: invalidatedHashes,
      demoted_count: demotedRows?.length ?? 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Chapter promotion failed' },
      { status: 500 }
    );
  }
}
