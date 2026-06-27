ALTER TABLE render_paragraphs
  ADD COLUMN IF NOT EXISTS chapter_number INTEGER,
  ADD COLUMN IF NOT EXISTS content_hash TEXT,
  ADD COLUMN IF NOT EXISTS canonical BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS chapter_version TEXT;

CREATE INDEX IF NOT EXISTS idx_render_paragraphs_canonical
  ON render_paragraphs (chapter_number, canonical)
  WHERE canonical = true;

CREATE INDEX IF NOT EXISTS idx_render_paragraphs_content_hash
  ON render_paragraphs (content_hash);
