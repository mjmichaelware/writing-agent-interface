import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'chapters', `${slug}.txt`);
    const rawContent = await fs.readFile(filePath, 'utf-8');
    const isXML = rawContent.trim().startsWith('<');
    return NextResponse.json({ 
      xml: isXML ? rawContent : null,
      blocks: isXML ? [] : rawContent.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    });
  } catch (e) {
    return NextResponse.json({ error: 'Manifest link failed' }, { status: 500 });
  }
}
