import { createClient } from '@supabase/supabase-js';
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

// System 9: Document Analyzer - Corpus Searcher
export async function searchCorpus(extractedText: string) {
  const supabase = getSupabase();
  const openai = getOpenAI();

  if (!supabase || !openai) {
    console.warn("Supabase or OpenAI not configured for searchCorpus");
    return [];
  }

  // 1. Generate Embedding via OpenAI
  const embedResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: extractedText.slice(0, 8000), // OpenAI limit
  });
  const embedding = embedResponse.data[0].embedding;

  // 2. Vector Search via Supabase RPC
  const { data, error } = await supabase.rpc('match_paragraphs', {
    query_embedding: embedding,
    match_threshold: 0.3, // Lower threshold for external document matching
    match_count: 5,
  });

  if (error) {
    console.error("Search RPC failed:", error.message);
    return [];
  }
  
  return data;
}