import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';

  try {
    // Pointing to your internal ingestion-buffer where EMA XML is stored
    const emaPath = path.join(process.cwd(), 'src', 'data-layer', 'ingestion-buffer', `chapter${slug}-ema.xml`);
    const rawXML = await fs.readFile(emaPath, 'utf-8');

    // Basic logic to return the raw XML for the client-side parser
    return NextResponse.json({ xml: rawXML });
  } catch (e) {
    // Fallback if the XML isn't found
    const fallbackPath = path.join(process.cwd(), 'src', 'data', `chapter7-raw.txt`);
    const rawText = await fs.readFile(fallbackPath, 'utf-8');
    return NextResponse.json({ text: rawText, fallback: true });
  }
}
