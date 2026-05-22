import { createClient } from '@supabase/supabase-js';
import { VertexAI } from '@google-cloud/vertexai';
import OpenAI from 'openai';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

function getVertexAI() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  if (!project) return null;
  return new VertexAI({ project, location });
}

export async function ingestChapter(
  partNumber: string,
  chapterNumber: number,
  status: 'drafted' | 'unwritten',
  manifestId: string,
  rawXmlText: string
) {
  const supabase = getSupabase();
  const openai = getOpenAI();
  const vertexAI = getVertexAI();

  if (!supabase) throw new Error("Supabase credentials not configured");
  if (!openai) throw new Error("OpenAI API key not configured");
  if (!vertexAI) throw new Error("Google Cloud Project not configured for Vertex AI");
  // 1. Establish Canonical Chapter Node
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .upsert({
      part_number: partNumber,
      chapter_number: chapterNumber,
      status,
      manifest_id: manifestId,
    }, { onConflict: 'manifest_id' })
    .select()
    .single();

  if (chapterError || !chapter) throw chapterError || new Error("Failed to insert/upsert chapter");

  // 2. XML Stripping & Semantic Chunking
  const cleanText = rawXmlText.replace(/<[^>]*>?/gm, ''); 
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  // 3. Engine Plane: Semantic Enrichment Pass
  for (const pText of paragraphs) {
    // Generate Embedding via OpenAI (Optimized for speed and consistency)
    if (!openai) throw new Error("OpenAI API key not configured");
    
    const embedResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: pText,
    });
    const embedding = embedResponse.data[0].embedding;

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