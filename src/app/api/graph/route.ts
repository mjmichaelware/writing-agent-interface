import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch paragraphs that have significant dualism mappings
    const { rows: paragraphs } = await query(
      `SELECT id, content, dualism_map, chapter_id
       FROM paragraphs 
       WHERE dualism_map IS NOT NULL AND dualism_map != '{}'::jsonb`
    );

    // Also fetch explicit hyperlinks/dualisms
    const { rows: hyperlinks } = await query(
      `SELECT id, paragraph_id, theme_node_a, theme_node_b, link_type, weight
       FROM hyperlinks`
    );

    return NextResponse.json({ 
      paragraphs,
      hyperlinks
    });
  } catch (e: any) {
    console.error("Graph API Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
