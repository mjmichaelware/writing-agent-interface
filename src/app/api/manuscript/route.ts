import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get('chapterId');

  if (!chapterId) {
    return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('paragraphs')
    .select('*, biblical_references(*), chapters(part_number, chapter_number)')
    .eq('chapter_id', chapterId)
    .order('chunk_index', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}