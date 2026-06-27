-- The embedding column is not present in the current render_paragraphs schema,
-- so this migration adds it and the matching ivfflat index.
ALTER TABLE render_paragraphs
  ADD COLUMN IF NOT EXISTS embedding vector(1536);

CREATE INDEX IF NOT EXISTS idx_render_paragraphs_embedding
  ON render_paragraphs
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
