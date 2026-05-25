-- Vector Search Function
CREATE OR REPLACE FUNCTION match_paragraphs (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  chapter_id uuid,
  content text,
  archetypal_weights jsonb,
  dualism_map jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    paragraphs.id,
    paragraphs.chapter_id,
    paragraphs.content,
    paragraphs.archetypal_weights,
    paragraphs.dualism_map,
    1 - (paragraphs.embedding <=> query_embedding) AS similarity
  FROM paragraphs
  WHERE 1 - (paragraphs.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
