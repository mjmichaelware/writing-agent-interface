-- Phase A: Database schema + ingestion pipeline

-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- System 11: Canonical Novel Structure
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number TEXT NOT NULL, -- 1, 2, 3, or 'epilogue'
    chapter_number INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unwritten', -- 'drafted', 'unwritten'
    manifest_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Plane: Paragraphs with embedded payload
CREATE TABLE paragraphs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    chunk_index INT NOT NULL DEFAULT 0,
    embedding vector(1536), -- Supports Vertex AI or OpenAI embeddings
    archetypal_weights JSONB DEFAULT '{}'::jsonb, -- shadow, persona, anima, self, hero
    dualism_map JSONB DEFAULT '{}'::jsonb, -- sacred vs descent
    hebrew_spans JSONB DEFAULT '[]'::jsonb, -- System 12: Hebrew Typography spans
    metadata JSONB DEFAULT '{}'::jsonb, -- System 14: EMA XML metadata (scene_id, time_of_day, weather)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relational data for graph UI
CREATE TABLE biblical_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paragraph_id UUID REFERENCES paragraphs(id) ON DELETE CASCADE,
    reference_text TEXT NOT NULL,
    book TEXT,
    chapter INT,
    verse INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblical_references ENABLE ROW LEVEL SECURITY;

-- Allow read access to all for the front-end components
CREATE POLICY "Allow public read-only access to chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to paragraphs" ON paragraphs FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to biblical references" ON biblical_references FOR SELECT USING (true);
L SECURITY;

-- Allow read access to all for the front-end components
CREATE POLICY "Allow public read-only access to chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to paragraphs" ON paragraphs FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to biblical references" ON biblical_references FOR SELECT USING (true);
