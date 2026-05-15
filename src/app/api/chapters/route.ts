import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * NARRATIVE ENGINE API: Manifest-Driven Retrieval
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || '7';

  try {
    // 1. Locate the master manifest
    const manifestPath = path.join(process.cwd(), 'src', 'data-layer', 'initialization-metadata', 'node_manifest.json');
    const manifestData = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestData);

    // 2. Resolve the specific chapter node
    const node = manifest.nodes.find((n: any) => n.id.includes(slug));
    if (!node) return NextResponse.json({ error: 'Node not found' }, { status: 404 });

    // 3. Read the physical EMA XML file
    const rawContent = await fs.readFile(node.file_path, 'utf-8');

    return NextResponse.json({
      title: node.id,
      xml: rawContent,
      aim: node.aim
    });
  } catch (e) {
    return NextResponse.json({ error: 'Manifest execution failed' }, { status: 500 });
  }
}
