-- Phase 1 Delta Sync
-- Ensure hyperlinks table exists
CREATE TABLE IF NOT EXISTS hyperlinks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paragraph_id UUID REFERENCES paragraphs(id) ON DELETE CASCADE,
    theme_node_a TEXT NOT NULL,
    theme_node_b TEXT,
    link_type TEXT DEFAULT 'dualism', -- e.g. 'dualism', 'foreshadowing', 'motif'
    weight FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure RLS is enabled
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE biblical_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyperlinks ENABLE ROW LEVEL SECURITY;

-- Ensure public read policies exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only access to chapters') THEN
        CREATE POLICY "Allow public read-only access to chapters" ON chapters FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only access to paragraphs') THEN
        CREATE POLICY "Allow public read-only access to paragraphs" ON paragraphs FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only access to biblical references') THEN
        CREATE POLICY "Allow public read-only access to biblical references" ON biblical_references FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only access to hyperlinks') THEN
        CREATE POLICY "Allow public read-only access to hyperlinks" ON hyperlinks FOR SELECT USING (true);
    END IF;
END $$;
