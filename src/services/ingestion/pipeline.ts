import { createClient } from '@supabase/supabase-js';
import { VertexAI } from '@google-cloud/vertexai';
import OpenAI from 'openai';

// Data Plane - Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Tenth System - Orchestration
// We use Vertex AI for embeddings as per Directive Phase 1 update
const project = process.env.GOOGLE_CLOUD_PROJECT || 'weight-of-the-sky';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const vertexAI = new VertexAI({ project, location });
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// For semantic enrichment, we continue using OpenAI or can switch to Gemini.
// The user requested Multi-LLM Orchestration.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function ingestChapter(
  partNumber: string,
  chapterNumber: number,
  status: 'drafted' | 'unwritten',
  manifestId: string,
  rawXmlText: string
) {
  // 1. Establish Canonical Chapter Node
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .insert({
      part_number: partNumber,
      chapter_number: chapterNumber,
      status,
      manifest_id: manifestId,
    })
    .select()
    .single();

  if (chapterError || !chapter) throw chapterError || new Error("Failed to insert chapter");

  // 2. XML Stripping & Semantic Chunking
  const cleanText = rawXmlText.replace(/<[^>]*>?/gm, ''); 
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  // 3. Engine Plane: Semantic Enrichment Pass
  for (const pText of paragraphs) {
    // Generate Embedding via Vertex AI (Feature 51: text-embedding-004/005)
    // Using the Vertex AI SDK for "actual hashing"
    const embedModel = vertexAI.preview.getGenerativeModel({ model: 'text-embedding-004' });
    const embedResponse = await embedModel.embedContent(pText);
    const embedding = embedResponse.embedding.values;

    // Tenth System / Engine Plane - LLM Semantic Weighting
    const enrichmentResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are the NOS Orchestration Engine. Analyze the text and return JSON:
          {
            "archetypal_weights": { "shadow": 0.0, "persona": 0.0, "anima": 0.0, "self": 0.0, "hero": 0.0 },
            "dualism_map": { "sacred": 0.0, "descent": 0.0 },
            "hebrew_terms": ["Hebron"],
            "biblical_references": [{ "text": "...", "book": "...", "chapter": 0, "verse": 0 }],
            "metadata": { "scene_id": "...", "time_of_day": "...", "weather": "...", "character_present": "...", "internal_state": "..." }
          }`
        },
        { role: 'user', content: pText },
      ],
    });

    const enrichment = JSON.parse(enrichmentResponse.choices[0].message.content || '{}');

    // 4. Persistence into Postgres
    const { data: paragraphData, error: pError } = await supabase
      .from('paragraphs')
      .insert({
        chapter_id: chapter.id,
        content: pText,
        embedding,
        archetypal_weights: enrichment.archetypal_weights || {},
        dualism_map: enrichment.dualism_map || {},
        hebrew_spans: enrichment.hebrew_terms || [],
        metadata: enrichment.metadata || {},
      })
      .select()
      .single();

    if (pError) throw pError;

    if (enrichment.biblical_references && enrichment.biblical_references.length > 0) {
      const refs = enrichment.biblical_references.map((ref: any) => ({
        paragraph_id: paragraphData.id,
        reference_text: ref.text,
        book: ref.book,
        chapter: ref.chapter,
        verse: ref.verse,
      }));
      await supabase.from('biblical_references').insert(refs);
    }
  }

  return { success: true, chapterId: chapter.id, parsedCount: paragraphs.length };
}