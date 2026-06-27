import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { embedText } from '@/services/memory-engine/vertex-embedder';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key);
}

function isAuthorized(request: Request) {
  const expected = process.env.AUTHOR_PIN;
  const provided = request.headers.get('x-author-pin');
  return Boolean(expected && provided && provided === expected);
}

function toVectorLiteral(values: number[]) {
  return `[${values.join(',')}]`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const { data: paragraphs, error } = await supabase
      .from('render_paragraphs')
      .select('id, content')
      .is('embedding', null)
      .order('chapter_number', { ascending: true })
      .order('chunk_index', { ascending: true })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const errors: string[] = [];
    let processed = 0;

    for (const paragraph of paragraphs ?? []) {
      const id = String((paragraph as any)?.id ?? '');
      const content = String((paragraph as any)?.content ?? '').trim();

      if (!id) {
        errors.push('missing paragraph id');
        continue;
      }

      if (!content) {
        errors.push(`${id}: empty content`);
        continue;
      }

      try {
        const embedding = await embedText(content);
        const { error: updateError } = await supabase
          .from('render_paragraphs')
          .update({ embedding: toVectorLiteral(embedding) })
          .eq('id', id);

        if (updateError) {
          throw updateError;
        }

        processed += 1;
      } catch (embedError: any) {
        errors.push(`${id}: ${embedError?.message ?? String(embedError)}`);
      }
    }

    const { count: remaining, error: remainingError } = await supabase
      .from('render_paragraphs')
      .select('id', { count: 'exact', head: true })
      .is('embedding', null);

    if (remainingError) {
      return NextResponse.json({ error: remainingError.message }, { status: 500 });
    }

    return NextResponse.json({
      processed,
      remaining: remaining ?? 0,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Embedding backfill failed' },
      { status: 500 }
    );
  }
}
