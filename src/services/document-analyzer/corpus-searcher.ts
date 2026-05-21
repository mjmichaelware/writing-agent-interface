import { createClient } from '@supabase/supabase-js';
import { VertexAI } from '@google-cloud/vertexai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const vertexAI = new VertexAI({ project: process.env.GOOGLE_CLOUD_PROJECT || 'weight-of-the-sky', location: 'us-central1' });

// System 9: Document Analyzer - Corpus Searcher
export async function searchCorpus(extractedText: string) {
  // 1. Generate Embedding
  const embedModel = vertexAI.preview.getGenerativeModel({ model: 'text-embedding-004' });
  const embedResponse = await embedModel.embedContent(extractedText);
  const embedding = embedResponse.embedding.values;

  // 2. Vector Search
  const { data, error } = await supabase.rpc('match_paragraphs', {
    query_embedding: embedding,
    match_threshold: 0.3, // Lower threshold for external document matching
    match_count: 5,
  });

  if (error) throw error;
  return data;
}