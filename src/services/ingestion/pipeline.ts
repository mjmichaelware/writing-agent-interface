import OpenAI from 'openai';
import { query } from '../../lib/db';
import { GoogleSwarm } from '../orchestration-engine/google-swarm';

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
 * * DATABASE: Direct PostgreSQL via pool (lib/db.ts)
 */
export async function ingestChapter(
  partNumber: string,
  chapterNumber: number,
  status: 'drafted' | 'unwritten',
  manifestId: string,
  rawXmlText: string
) {
  const openai = getOpenAI(); 
  if (!openai) throw new Error("OpenAI API key not configured");

  await GoogleSwarm.logIntegrity('ingestion_start', { manifestId, partNumber, chapterNumber });

  // 1. UPSERT Chapter
  const { rows: chapters } = await query(
    `INSERT INTO chapters (part_number, chapter_number, status, manifest_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (manifest_id) 
     DO UPDATE SET part_number = EXCLUDED.part_number, chapter_number = EXCLUDED.chapter_number, status = EXCLUDED.status, updated_at = NOW()
     RETURNING id, part_number, chapter_number`,
    [partNumber, chapterNumber, status, manifestId]
  );

  const chapter = chapters[0];
  if (!chapter) throw new Error("Failed to upsert chapter");

  await GoogleSwarm.mirrorChapter(chapter);

  const chapterMetadata = extractEmaMetadata(rawXmlText);

  // Strip XML for paragraph chunking
  const cleanText = rawXmlText.replace(/<[^>]*>?/gm, ''); 
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  console.log(`Ingesting ${paragraphs.length} paragraphs for Ch ${chapterNumber}...`);

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

      // 2. INSERT Paragraph
      const { rows: paragraphRows } = await query(
        `INSERT INTO paragraphs (
          chapter_id, content, chunk_index, embedding, 
          archetypal_weights, dualism_map, hebrew_spans, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id`,
        [
          chapter.id, pText, i + j, JSON.stringify(embedding),
          enrichment.archetypal_weights || {},
          enrichment.dualism_map || {},
          JSON.stringify(hebrewSpans),
          { ...chapterMetadata, batch_index: i }
        ]
      );

      const paragraphData = paragraphRows[0];

      if (paragraphData && enrichment.biblical_references?.length > 0) {
        for (const ref of enrichment.biblical_references) {
          await query(
            `INSERT INTO biblical_references (paragraph_id, reference_text, book, chapter, verse)
             VALUES ($1, $2, $3, $4, $5)`,
            [paragraphData.id, ref.text || ref.reference_text, ref.book, ref.chapter, ref.verse]
          );
        }
      }
      
      if (paragraphData && enrichment.hyperlinks?.length > 0) {
        for (const link of enrichment.hyperlinks) {
          await query(
            `INSERT INTO hyperlinks (paragraph_id, theme_node_a, theme_node_b, link_type)
             VALUES ($1, $2, $3, $4)`,
            [paragraphData.id, link.theme_node_a, link.theme_node_b, link.link_type || 'dualism']
          );
        }
      }

      await GoogleSwarm.mirrorParagraph({
        ...paragraphData,
        content: pText,
        chapter_number: chapter.chapter_number,
        part_number: chapter.part_number,
      });
    }

    console.log(`✓ Batch ${i/BATCH_SIZE + 1} complete for Ch ${chapterNumber}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await GoogleSwarm.logIntegrity('ingestion_complete', { manifestId, paragraphCount: paragraphs.length });

  return { success: true, chapterId: chapter.id, parsedCount: paragraphs.length };
}
