import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';
  
  try {
    const directoryPath = path.join(process.cwd(), 'src/data-layer/ingestion-buffer/gdrive_raw');
    const files = fs.readdirSync(directoryPath);
    
    const targetFile = files.find(f => 
      f.toLowerCase().includes(`chapter`) && 
      f.toLowerCase().includes(`${slug}`) && 
      f.endsWith('.txt')
    );

    if (!targetFile) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const rawContent = fs.readFileSync(path.join(directoryPath, targetFile), 'utf-8');
    const words = rawContent.split(/\s+/).filter(w => w.length > 0);
    
    const blockSize = 200;
    const blocks = [];
    
    for (let i = 0; i < words.length; i += blockSize) {
      const blockText = words.slice(i, i + blockSize).join(' ');
      const tone = blockText.includes('fall') || blockText.includes('darkness') ? 'intense' : 'neutral';
      
      blocks.push({
        id: `${slug}-${blocks.length}`,
        text: blockText,
        tone: tone
      });
    }

    return NextResponse.json({
      id: parseInt(slug),
      title: targetFile.replace('.txt', ''),
      blocks: blocks
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load chapter' }, { status: 500 });
  }
}
