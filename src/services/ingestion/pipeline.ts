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

// Extractor for Hebrew typography terms
function extractHebrewSpans(text: string) {
  const hebrewTerms = ['Hebron', 'Hermon', 'Mamre', 'Beelzebub', 'Megiddo', 'Sak', 'Rafa'];
  const spans: any[] = [];
  hebrewTerms.forEach(term => {
    let index = text.indexOf(term);
    while (index !== -1) {
      spans.push({ term, start: index, length: term.length });
      index = text.indexOf(term, index + 1);
    }
  });
  return spans;
}

// Extractor for XML metadata
function extractEmaMetadata(xmlText: string) {
  const metadata: any = {};
  const sceneMatch = xmlText.match(/<scene\s+id="([^"]+)"/);
  const timeMatch = xmlText.match(/time_of_day="([^"]+)"/);
  const weatherMatch = xmlText.match(/weather="([^"]+)"/);
  
  if (sceneMatch) metadata.scene_id = sceneMatch[1];
  if (timeMatch) metadata.time_of_day = timeMatch[1];
  if (weatherMatch) metadata.weather = weatherMatch[1];
  
  return metadata;
}

/**
 * ENGINE PLANE: NARRATIVE INGESTION PIPELINE
 * * Feature 200: Meaning-Driven Semantic Weighting
 * * BATCH OPTIMIZED: Processes 5 paragraphs per LLM call.
 */
export async function ingestChapter(
  partNumber: string,
  chapterNumber: number,
  status: 'drafted' | 'unwritten',
  manifestId: string,
  rawXmlText: string
) {
  const supabase = getSupabase();
  const openai = getOpenAI(); 

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

  const chapterMetadata = extractEmaMetadata(rawXmlText);

  // Strip XML for paragraph chunking
  const cleanText = rawXmlText.replace(/<[^>]*>?/gm, ''); 
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const BATCH_SIZE = 5;
  for (let i = 0; i < paragraphs.length; i += BATCH_SIZE) {
    const batch = paragraphs.slice(i, i + BATCH_SIZE);
    
    // Feature 200: Semantic Enrichment Batch Pass
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `You are the NOS Orchestration Engine. Analyze the ${batch.length} texts and return valid JSON only. 
          Return an object with a "results" array. Each item must have:
          "archetypal_weights": { "shadow": 0.0, "persona": 0.0, "anima": 0.0, "self": 0.0, "hero": 0.0 },
          "dualism_map": { "sacred": 0.0, "descent": 0.0 },
          "biblical_references": [{ "text": "...", "book": "...", "chapter": 0, "verse": 0 }],
          "hyperlinks": [{ "theme_node_a": "...", "theme_node_b": "...", "link_type": "dualism" }]` 
        },
        { role: "user", content: JSON.stringify(batch) }
      ],
      response_format: { type: "json_object" }
    });

    const enrichedBatch = JSON.parse(completion.choices[0].message.content || '{"results":[]}').results;

    for (let j = 0; j < batch.length; j++) {
      const pText = batch[j];
      const enrichment = enrichedBatch[j] || {};
      const hebrewSpans = extractHebrewSpans(pText);

      const embedResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: pText,
      });
      const embedding = embedResponse.data[0].embedding;

      const { data: paragraphData, error: pError } = await supabase
        .from('paragraphs')
        .insert({
          chapter_id: chapter.id,
          content: pText,
          chunk_index: i + j,
          embedding,
          archetypal_weights: enrichment.archetypal_weights || {},
          dualism_map: enrichment.dualism_map || {},
          hebrew_spans: hebrewSpans,
          metadata: { ...chapterMetadata, batch_index: i },
        })
        .select()
        .single();

      if (pError) throw pError;

      // Insert Biblical References
      if (paragraphData && enrichment.biblical_references?.length > 0) {
        const refs = enrichment.biblical_references.map((ref: any) => ({
          paragraph_id: paragraphData.id,
          reference_text: ref.text || ref.reference_text,
          book: ref.book,
          chapter: ref.chapter,
          verse: ref.verse,
        }));
        await supabase.from('biblical_references').insert(refs);
      }
      
      // Insert Hyperlinks/Dualisms
      if (paragraphData && enrichment.hyperlinks?.length > 0) {
        const links = enrichment.hyperlinks.map((link: any) => ({
          paragraph_id: paragraphData.id,
          theme_node_a: link.theme_node_a,
          theme_node_b: link.theme_node_b,
          link_type: link.link_type || 'dualism'
        }));
        await supabase.from('hyperlinks').insert(links);
      }

      await GoogleSwarm.mirrorParagraph({
        ...paragraphData,
        chapter_number: chapter.chapter_number,
        part_number: chapter.part_number,
      });
    }

    console.log(`Ingested paragraphs ${i} to ${i + batch.length - 1} for Chapter ${chapterNumber}`);
    // Throttle to respect API limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await GoogleSwarm.logIntegrity('ingestion_complete', { manifestId, paragraphCount: paragraphs.length });

  return { success: true, chapterId: chapter.id, parsedCount: paragraphs.length };
}