import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';
  
  try {
    const filePath = path.join(process.cwd(), 'src/data-layer/ingestion-buffer/gdrive_raw', `(B)_Chapter_${slug}:_The_Pit.txt`);
    const content = await fs.readFile(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (e) {
    return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 });
  }
}
