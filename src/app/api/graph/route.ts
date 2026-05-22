import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 503 });
  }

  // Fetch paragraphs that have significant dualism mappings
  const { data, error } = await supabase
    .from('paragraphs')
    .select('id, content, dualism_map, chapter_id')
    .not('dualism_map', 'is', null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Structure for HyperlinksGraph
  // Nodes: Paragraphs
  // Links: Shared themes or strong opposing poles (Sacred vs Descent)
  return NextResponse.json({ dualisms: data });
}