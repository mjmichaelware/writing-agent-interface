import { NextResponse } from 'next/server';
import { parseDocument } from '@/services/document-analyzer/parser';
import { searchCorpus } from '@/services/document-analyzer/corpus-searcher';
import { synthesizeAnalysis } from '@/services/document-analyzer/synthesis-engine';
import { isAuthorized } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { fileBase64, mimeType } = await request.json();

    if (!fileBase64 || !mimeType) {
      return NextResponse.json({ error: 'fileBase64 and mimeType are required' }, { status: 400 });
    }

    const extractedText = await parseDocument(fileBase64, mimeType);
    if (!extractedText) {
      throw new Error("Failed to extract text from document");
    }

    const corpusMatches = await searchCorpus(extractedText);
    const analysis = await synthesizeAnalysis(extractedText, corpusMatches);

    return NextResponse.json({ 
      analysis, 
      extractedText: extractedText.slice(0, 1000),
      matchCount: corpusMatches.length 
    });
  } catch (error: any) {
    console.error("Document analysis failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
