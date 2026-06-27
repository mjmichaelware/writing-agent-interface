import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const ALLOWED_TABLES = new Set([
  'semantic_meaning_spans',
  'semantic_biblical_anchors',
  'semantic_archetype_anchors',
  'semantic_crosslinks',
]);

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}

function isAuthorized(request: Request) {
  const expected = process.env.AUTHOR_PIN;
  const provided = request.headers.get('x-author-pin');
  return Boolean(expected && provided && provided === expected);
}

export async function PATCH(request: Request) {
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

  const table = String(body?.table ?? '');
  const id = String(body?.id ?? '');
  const visibleToReader = body?.visible_to_reader;

  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: 'Invalid semantic visibility table' }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  if (typeof visibleToReader !== 'boolean') {
    return NextResponse.json({ error: 'visible_to_reader must be a boolean' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(table as any)
    .update({ visible_to_reader: visibleToReader })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Row not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
