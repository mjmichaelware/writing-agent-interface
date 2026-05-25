import { createClient } from '@supabase/supabase-js';
import { VertexAI } from '@google-cloud/vertexai';
import { NextResponse } from 'next/server';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

function getVertexAI() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  if (!project) return null;
  return new VertexAI({ project, location });
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const vertexAI = getVertexAI();

  if (!supabase || !vertexAI) {
    return NextResponse.json({ error: 'System components not configured' }, { status: 503 });
  }

  const { query } = await request.json();

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 });
  }

  // 1. Generate Embedding via Vertex AI
  const embedModel = vertexAI.preview.getGenerativeModel({ model: 'text-embedding-004' });
  const embedResponse = await embedModel.embedContent(query);
  const embedding = embedResponse.embedding.values;

  // 2. Vector Search via Supabase RPC
  const { data, error } = await supabase.rpc('match_paragraphs', {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 10,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ results: data });
}