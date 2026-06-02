import OpenAI from 'openai';
import { query } from '../../lib/db';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

// System 9: Document Analyzer - Corpus Searcher
// Perform semantic search across the WoS corpus via the same embeddings
export async function searchCorpus(extractedText: string) {
  const openai = getOpenAI();
  if (!openai) {
    console.warn("OpenAI not configured for searchCorpus");
    return [];
  }

  try {
    // 1. Generate Embedding via OpenAI
    const embedResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: extractedText.slice(0, 8000),
    });
    const embedding = embedResponse.data[0].embedding;

    // 2. Vector Search via Direct SQL
    const { rows: results } = await query(
      `SELECT
        id,
        content,
        archetypal_weights,
        dualism_map,
        1 - (embedding <=> $1::vector) AS similarity
      FROM paragraphs
      WHERE 1 - (embedding <=> $1::vector) > 0.3
      ORDER BY similarity DESC
      LIMIT 5`,
      [JSON.stringify(embedding)]
    );

    return results;
  } catch (e: any) {
    console.error("searchCorpus failed:", e.message);
    return [];
  }
}
