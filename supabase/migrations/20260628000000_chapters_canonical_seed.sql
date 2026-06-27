-- Canonical chapters schema and seed
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL,
  part_number TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unwritten',
  slug TEXT NOT NULL,
  manifest_id TEXT
);

ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_chapters_chapter_number_unique
  ON chapters (chapter_number);

CREATE UNIQUE INDEX IF NOT EXISTS idx_chapters_slug_unique
  ON chapters (slug);

UPDATE chapters
SET
  title = COALESCE(
    NULLIF(title, ''),
    CASE
      WHEN chapter_number = 7 THEN 'The Pit'
      WHEN chapter_number = 25 THEN 'Epilogue'
      ELSE 'Chapter ' || chapter_number::text
    END
  ),
  slug = COALESCE(NULLIF(slug, ''), 'chapter-' || chapter_number::text),
  manifest_id = COALESCE(manifest_id, 'man_' || LPAD(chapter_number::text, 2, '0'))
WHERE title IS NULL
   OR title = ''
   OR slug IS NULL
   OR slug = ''
   OR manifest_id IS NULL;

ALTER TABLE chapters
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN slug SET NOT NULL;

INSERT INTO chapters (chapter_number, part_number, title, status, slug, manifest_id) VALUES
  (1, '1', 'Chapter 1', 'drafted', 'chapter-1', 'man_01'),
  (2, '1', 'Chapter 2', 'drafted', 'chapter-2', 'man_02'),
  (3, '1', 'Chapter 3', 'drafted', 'chapter-3', 'man_03'),
  (4, '1', 'Chapter 4', 'drafted', 'chapter-4', 'man_04'),
  (5, '1', 'Chapter 5', 'drafted', 'chapter-5', 'man_05'),
  (6, '1', 'Chapter 6', 'drafted', 'chapter-6', 'man_06'),
  (7, '1', 'The Pit', 'drafted', 'chapter-7', 'man_07'),
  (8, '1', 'Chapter 8', 'drafted', 'chapter-8', 'man_08'),
  (9, '1', 'Chapter 9', 'drafted', 'chapter-9', 'man_09'),
  (10, '2', 'Chapter 10', 'drafted', 'chapter-10', 'man_10'),
  (11, '2', 'Chapter 11', 'drafted', 'chapter-11', 'man_11'),
  (12, '2', 'Chapter 12', 'unwritten', 'chapter-12', 'man_12'),
  (13, '2', 'Chapter 13', 'drafted', 'chapter-13', 'man_13'),
  (14, '2', 'Chapter 14', 'unwritten', 'chapter-14', 'man_14'),
  (15, '2', 'Chapter 15', 'unwritten', 'chapter-15', 'man_15'),
  (16, '2', 'Chapter 16', 'unwritten', 'chapter-16', 'man_16'),
  (17, '2', 'Chapter 17', 'unwritten', 'chapter-17', 'man_17'),
  (18, '3', 'Chapter 18', 'unwritten', 'chapter-18', 'man_18'),
  (19, '3', 'Chapter 19', 'unwritten', 'chapter-19', 'man_19'),
  (20, '3', 'Chapter 20', 'unwritten', 'chapter-20', 'man_20'),
  (21, '3', 'Chapter 21', 'unwritten', 'chapter-21', 'man_21'),
  (22, '3', 'Chapter 22', 'unwritten', 'chapter-22', 'man_22'),
  (23, '3', 'Chapter 23', 'unwritten', 'chapter-23', 'man_23'),
  (24, '3', 'Chapter 24', 'unwritten', 'chapter-24', 'man_24'),
  (25, 'epilogue', 'Epilogue', 'unwritten', 'chapter-25', 'man_25')
ON CONFLICT (chapter_number) DO NOTHING;
