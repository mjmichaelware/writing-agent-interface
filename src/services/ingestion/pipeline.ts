import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { GoogleSwarm } from '../orchestration-engine/google-swarm';

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

/**
 * ENGINE PLANE: NARRATIVE INGESTION PIPELINE
 * * Feature 200: Vertex AI Semantic Weighting
 */
export async function ingestChapter(
  partNumber: string,
  chapterNumber: number,
  status: 'drafted' | 'unwritten',
  manifestId: string,
  rawXmlText: string
) {
  const supabase = getSupabase();
  const openai = getOpenAI(); // Still used for embeddings for consistency
  const vertex = GoogleSwarm.getVertexAI();
  const model = vertex.getGenerativeModel({ model: 'gemini-1.5-pro' });

  if (!supabase) throw new Error("Supabase credentials not configured");
  if (!openai) throw new Error("OpenAI API key not configured");

  await GoogleSwarm.logIntegrity('ingestion_start', { manifestId, partNumber, chapterNumber });

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

  await GoogleSwarm.mirrorChapter(chapter);

  const cleanText = rawXmlText.replace(/<[^>]*>?/gm, ''); 
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  let chunkIndex = 0;
  for (const pText of paragraphs) {
    const embedResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: pText,
    });
    const embedding = embedResponse.data[0].embedding;

    // Tenth System / Engine Plane - Google Vertex AI Semantic Pass
    const prompt = `You are the NOS Orchestration Engine. Analyze the text and return JSON:
      {
        "archetypal_weights": { "shadow": 0.0, "persona": 0.0, "anima": 0.0, "self": 0.0, "hero": 0.0 },
        "dualism_map": { "sacred": 0.0, "descent": 0.0 },
        "hebrew_terms": [],
        "biblical_references": [{ "text": "...", "book": "...", "chapter": 0, "verse": 0 }],
        "metadata": { "internal_state": "..." }
      }
      TEXT: ${pText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, '').trim();
    const enrichment = JSON.parse(jsonText);

    const { data: paragraphData, error: pError } = await supabase
      .from('paragraphs')
      .insert({
        chapter_id: chapter.id,
        content: pText,
        chunk_index: chunkIndex,
        embedding,
        archetypal_weights: enrichment.archetypal_weights || {},
        dualism_map: enrichment.dualism_map || {},
        hebrew_spans: enrichment.hebrew_terms || [],
        metadata: enrichment.metadata || {},
      })
      .select()
      .single();

    if (pError) throw pError;

    if (paragraphData) {
      await GoogleSwarm.mirrorParagraph({
        ...paragraphData,
        chapter_number: chapter.chapter_number,
        part_number: chapter.part_number,
      });
    }

    if (paragraphData && enrichment.biblical_references?.length > 0) {
      const refs = enrichment.biblical_references.map((ref: any) => ({
        paragraph_id: paragraphData.id,
        reference_text: ref.text,
        book: ref.book,
        chapter: ref.chapter,
        verse: ref.verse,
      }));
      await supabase.from('biblical_references').insert(refs);
    }
    chunkIndex++;
  }

  await GoogleSwarm.logIntegrity('ingestion_complete', { manifestId, paragraphCount: paragraphs.length });

  return { success: true, chapterId: chapter.id, parsedCount: paragraphs.length };
}