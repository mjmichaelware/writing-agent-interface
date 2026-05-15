import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';
  
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'canon', `${slug}.txt`);
    const rawText = await fs.readFile(filePath, 'utf-8');
    
    // Detect if the file is EMA XML format
    const isXML = rawText.trim().startsWith('<');

    return NextResponse.json({
      title: `Chapter ${slug}`,
      // If it's XML, we send it raw; if text, we send an array of blocks
      xml: isXML ? rawText : null,
      blocks: isXML ? [] : rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    });
  } catch (e) {
    return NextResponse.json({ error: 'Canon retrieval failed' }, { status: 404 });
  }
}

