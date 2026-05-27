/* ==================== FILE: src/app/api/chapters/route.ts ==================== */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const GDRIVE = 'src/data-layer/ingestion-buffer/gdrive_raw';

// Canonical file per chapter slug
const CANON: Record<string, { dir: string; file: string }> = {
  '1':  { dir: GDRIVE, file: '(Final)_Chapter_1_-_Stardust_to_Stardust.txt' },
  '2':  { dir: GDRIVE, file: '(Final)_Chapter_2-_Living_Sacrifice.txt' },
  '3':  { dir: GDRIVE, file: '(Final)_Chapter_3-_Lift_Up.txt' },
  '4':  { dir: GDRIVE, file: 'Chapter_4:_Pilgrimage.txt' },
  '5':  { dir: GDRIVE, file: '(Final)_Chapter_5_-_The_Snare.txt' },
  '6':  { dir: GDRIVE, file: 'Chapter_6:_Beelzebub,_Beelzebub.txt' },
  '7':  { dir: 'public/data/chapters', file: '7.txt' },
  '8':  { dir: GDRIVE, file: 'Chapter:_8_(Final).txt' },
  '9':  { dir: GDRIVE, file: 'Chapter_9:_The_Ascent.txt' },
  '10': { dir: GDRIVE, file: 'Chapter_10_Forsaken_FINAL_DEFINITIVE.txt' },
  '11': { dir: GDRIVE, file: 'Chapter_11._Forsaken.txt' },
  '13': { dir: GDRIVE, file: 'Chapter_13:_Exodus.txt' },
  '24': { dir: GDRIVE, file: 'Chapter_2nd_to_last.txt' },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';
  const entry = CANON[slug];

  if (!entry) {
    return NextResponse.json(
      { error: `Chapter ${slug} not in canonical map`, available: Object.keys(CANON) },
      { status: 404 }
    );
  }

  try {
    const filePath = path.join(process.cwd(), entry.dir, entry.file);
    const raw = await fs.readFile(filePath, 'utf-8');
    const cleaned = raw.replace(/^\uFEFF/, '').replace(/\r/g, '');
    const isXML = cleaned.trim().startsWith('<');

    if (isXML) {
      return NextResponse.json({ slug, xml: cleaned, blocks: [], source: entry.file });
    }

    const blocks = cleaned
      .split(/\n\s*\n/)
      .map(b => b.trim())
      .filter(b => b.length > 0);

    return NextResponse.json({ slug, xml: null, blocks, source: entry.file });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Could not read ${entry.file}: ${e.message}`, slug, attempted: entry.file },
      { status: 500 }
    );
  }
}


