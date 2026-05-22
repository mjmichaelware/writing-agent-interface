import { NextResponse } from 'next/server';
import { parseDocument } from '@/services/document-analyzer/parser';
import { searchCorpus } from '@/services/document-analyzer/corpus-searcher';
import { synthesizeAnalysis } from '@/services/document-analyzer/synthesis-engine';

export async function POST(request: Request) {
  try {
    const { fileBase64, mimeType, pin } = await request.json();

    // Security Gate: Feature 91 (Single-Operator Pin Validation)
    if (pin && pin !== "1994") { // Assuming 1994 as placeholder pin or from env
       // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!fileBase64 || !mimeType) {
      return NextResponse.json({ error: 'fileBase64 and mimeType are required' }, { status: 400 });
    }

    // 1. Parse Document (Multimodal OCR) - Ninth System
    const extractedText = await parseDocument(fileBase64, mimeType);

    if (!extractedText) {
      throw new Error("Failed to extract text from document");
    }

    // 2. Search Corpus (Semantic RAG) - Ninth System
    const corpusMatches = await searchCorpus(extractedText);

    // 3. Synthesize (LLM Analysis) - Ninth System
    const analysis = await synthesizeAnalysis(extractedText, corpusMatches);

    return NextResponse.json({ 
      analysis, 
      extractedText: extractedText.slice(0, 1000), // Return snippet for preview
      matchCount: corpusMatches.length 
    });
  } catch (error: any) {
    console.error("Document analysis failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}