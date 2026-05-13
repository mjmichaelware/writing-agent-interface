import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';

  try {
    const res = await fetch(`/data/chapters/${slug}.txt`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Not found');
    
    const rawText = await res.text();
    const words = rawText.split(/\s+/).filter(w => w.length > 0);
    const blocks = [];
    for (let i = 0; i < words.length; i += 200) {
      blocks.push(words.slice(i, i + 200).join(' '));
    }

    return NextResponse.json({
      title: `Chapter ${slug}`,
      blocks: blocks,
      totalBlocks: blocks.length
    });
  } catch (e) {
    return NextResponse.json({ error: 'Retrieval failed', fallback: true }, { status: 404 });
  }
}
