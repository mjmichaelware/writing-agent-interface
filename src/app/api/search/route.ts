import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { VertexAI } from '@google-cloud/vertexai';

function getVertexAI() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  if (!project) return null;
  return new VertexAI({ project, location });
}

export async function POST(request: Request) {
  const vertexAI = getVertexAI();

  if (!vertexAI) {
    return NextResponse.json({ error: 'Vertex AI not configured' }, { status: 503 });
  }

  const { query: searchQuery } = await request.json();

  if (!searchQuery) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 });
  }

  try {
    // 1. Generate Embedding via Vertex AI
    const embedModel = vertexAI.preview.getGenerativeModel({ model: 'text-embedding-004' });
    const embedResponse = await embedModel.embedContent(searchQuery);
    const embedding = embedResponse.embedding.values;

    // 2. Vector Search via SQL (replaces Supabase RPC for direct pg usage)
    const { rows: results } = await query(
      `SELECT
        id,
        chapter_id,
        content,
        archetypal_weights,
        dualism_map,
        1 - (embedding <=> $1::vector) AS similarity
      FROM paragraphs
      WHERE 1 - (embedding <=> $1::vector) > 0.5
      ORDER BY similarity DESC
      LIMIT 10`,
      [JSON.stringify(embedding)]
    );

    return NextResponse.json({ results });
  } catch (e: any) {
    console.error("Search API Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
