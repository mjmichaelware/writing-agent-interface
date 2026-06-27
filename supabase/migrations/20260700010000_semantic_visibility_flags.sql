ALTER TABLE semantic_meaning_spans
  ADD COLUMN IF NOT EXISTS visible_to_reader BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE semantic_biblical_anchors
  ADD COLUMN IF NOT EXISTS visible_to_reader BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE semantic_archetype_anchors
  ADD COLUMN IF NOT EXISTS visible_to_reader BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE semantic_crosslinks
  ADD COLUMN IF NOT EXISTS visible_to_reader BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_sms_visible ON semantic_meaning_spans (visible_to_reader);
CREATE INDEX IF NOT EXISTS idx_sba_visible ON semantic_biblical_anchors (visible_to_reader);
CREATE INDEX IF NOT EXISTS idx_saa_visible ON semantic_archetype_anchors (visible_to_reader);
CREATE INDEX IF NOT EXISTS idx_scl_visible ON semantic_crosslinks (visible_to_reader);
