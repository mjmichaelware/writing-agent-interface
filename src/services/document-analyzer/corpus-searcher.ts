import OpenAI from 'openai';
import { query } from '../../lib/db';

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export type CorpusMatch = {
  id: string;
  content: string;
  chapter_slug: string;
  chapter_number: number | null;
  similarity_score: number;
  match_type: 'cosine' | 'keyword';
};

let paragraphSourceFilterSupported: boolean | null = null;

function vectorLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}

async function supportsParagraphSourceFilter() {
  if (paragraphSourceFilterSupported !== null) {
    return paragraphSourceFilterSupported;
  }

  try {
    const { rows } = await query(
      `SELECT 1
       FROM information_schema.columns
       WHERE table_name = 'paragraphs'
         AND column_name = 'source_doc_folder'
       LIMIT 1`
    );
    paragraphSourceFilterSupported = rows.length > 0;
  } catch {
    paragraphSourceFilterSupported = false;
  }

  return paragraphSourceFilterSupported;
}

function extractSearchTerms(text: string) {
  const properNouns = Array.from(
    new Set(
      (text.match(/\b[A-Z][a-z]{2,}\b/g) || [])
        .filter((term) => !["The", "And", "But", "For", "With", "That", "This"].includes(term))
        .slice(0, 8)
    )
  );

  const biblicalRefs = Array.from(
    new Set(
      text.match(/\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Psalms?|Proverbs|Isaiah|Jeremiah|Ezekiel|Daniel|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Hebrews|James|Peter|Revelation)\s+\d+(?::\d+)?\b/gi) || []
    )
  );

  return [...properNouns, ...biblicalRefs].slice(0, 12);
}

async function searchSemanticMatches(embedding: number[], limit: number): Promise<CorpusMatch[]> {
  const sourceFilter = (await supportsParagraphSourceFilter())
    ? `AND COALESCE(p.source_doc_folder, '') !~* '(compendium|blueprint|mandate|checkpoint|prompt)'`
    : '';

  const { rows } = await query(
    `SELECT
       p.id,
       p.content,
       COALESCE(c.manifest_id, CONCAT('chapter-', c.chapter_number::text)) AS chapter_slug,
       c.chapter_number,
       1 - (p.embedding <=> $1::vector) AS similarity_score
     FROM paragraphs p
     JOIN chapters c ON c.id = p.chapter_id
     WHERE p.embedding IS NOT NULL
       ${sourceFilter}
     ORDER BY p.embedding <=> $1::vector
     LIMIT $2`,
    [vectorLiteral(embedding), limit]
  );

  return rows.map((row) => ({
    id: String(row.id),
    content: String(row.content ?? ""),
    chapter_slug: String(row.chapter_slug ?? ""),
    chapter_number: row.chapter_number == null ? null : Number(row.chapter_number),
    similarity_score: Number(row.similarity_score ?? 0),
    match_type: "cosine" as const,
  }));
}

async function searchKeywordMatches(terms: string[], limit: number): Promise<CorpusMatch[]> {
  if (terms.length === 0) return [];

  const patterns = terms.map((term) => `%${term}%`);
  const sourceFilter = (await supportsParagraphSourceFilter())
    ? `AND COALESCE(p.source_doc_folder, '') !~* '(compendium|blueprint|mandate|checkpoint|prompt)'`
    : '';

  const { rows } = await query(
    `SELECT
       p.id,
       p.content,
       COALESCE(c.manifest_id, CONCAT('chapter-', c.chapter_number::text)) AS chapter_slug,
       c.chapter_number,
       CASE
         WHEN EXISTS (
           SELECT 1
           FROM biblical_references br
           WHERE br.paragraph_id = p.id
             AND (
               br.reference_text ILIKE ANY($1::text[])
               OR br.book ILIKE ANY($1::text[])
             )
         ) THEN 0.99
         ELSE 0.75
       END AS similarity_score
     FROM paragraphs p
     JOIN chapters c ON c.id = p.chapter_id
     WHERE p.content ILIKE ANY($1::text[])
        OR EXISTS (
          SELECT 1
          FROM biblical_references br
          WHERE br.paragraph_id = p.id
            AND (
              br.reference_text ILIKE ANY($1::text[])
              OR br.book ILIKE ANY($1::text[])
            )
        )
       ${sourceFilter}
     ORDER BY similarity_score DESC, c.chapter_number ASC, p.chunk_index ASC
     LIMIT $2`,
    [patterns, limit]
  );

  return rows.map((row) => ({
    id: String(row.id),
    content: String(row.content ?? ""),
    chapter_slug: String(row.chapter_slug ?? ""),
    chapter_number: row.chapter_number == null ? null : Number(row.chapter_number),
    similarity_score: Number(row.similarity_score ?? 0),
    match_type: "keyword" as const,
  }));
}

export async function searchCorpus(extractedText: string): Promise<CorpusMatch[]> {
  const openai = getOpenAI();
  if (!openai) {
    console.warn("OpenAI not configured for searchCorpus");
    return [];
  }

  try {
    const embedResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: extractedText.slice(0, 8000),
    });
    const embedding = embedResponse.data[0].embedding;
    const semanticMatches = await searchSemanticMatches(embedding, 10);
    const keywordMatches = await searchKeywordMatches(extractSearchTerms(extractedText), 10);

    const merged = new Map<string, CorpusMatch>();

    for (const match of [...semanticMatches, ...keywordMatches]) {
      const existing = merged.get(match.id);
      if (!existing) {
        merged.set(match.id, match);
        continue;
      }

      const replace =
        match.match_type === "cosine" && existing.match_type !== "cosine"
          ? true
          : match.similarity_score > existing.similarity_score;

      if (replace) {
        merged.set(match.id, match);
      }
    }

    return Array.from(merged.values())
      .sort((a, b) => {
        if (a.match_type !== b.match_type) {
          return a.match_type === "cosine" ? -1 : 1;
        }
        return b.similarity_score - a.similarity_score;
      })
      .slice(0, 10);
  } catch (e: any) {
    console.error("searchCorpus failed:", e.message);
    return [];
  }
}
