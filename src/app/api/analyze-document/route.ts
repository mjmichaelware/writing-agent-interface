import { NextResponse } from 'next/server';
import { parseDocument } from '@/services/document-analyzer/parser';
import { searchCorpus } from '@/services/document-analyzer/corpus-searcher';
import { synthesizeAnalysis } from '@/services/document-analyzer/synthesis-engine';

export async function POST(request: Request) {
  try {
    const { fileBase64, mimeType } = await request.json();

    if (!fileBase64 || !mimeType) {
      return NextResponse.json({ error: 'fileBase64 and mimeType are required' }, { status: 400 });
    }

    // 1. Parse Document (Multimodal OCR)
    const extractedText = await parseDocument(fileBase64, mimeType);

    // 2. Search Corpus (Semantic RAG)
    const corpusMatches = await searchCorpus(extractedText);

    // 3. Synthesize (LLM Analysis)
    const analysis = await synthesizeAnalysis(extractedText, corpusMatches);

    return NextResponse.json({ analysis, extractedText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}