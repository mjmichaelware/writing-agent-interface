-- Seed Chapters with manifest_id
INSERT INTO chapters (part_number, chapter_number, status, manifest_id) VALUES
('1', 1, 'drafted', 'man_01'), ('1', 2, 'drafted', 'man_02'), ('1', 3, 'drafted', 'man_03'), ('1', 4, 'drafted', 'man_04'),
('1', 5, 'drafted', 'man_05'), ('1', 6, 'drafted', 'man_06'), ('1', 7, 'drafted', 'man_07'), ('1', 8, 'drafted', 'man_08'),
('1', 9, 'drafted', 'man_09'), ('2', 10, 'drafted', 'man_10'), ('2', 11, 'drafted', 'man_11'), ('2', 12, 'unwritten', 'man_12'),
('2', 13, 'drafted', 'man_13'), ('2', 14, 'unwritten', 'man_14'), ('2', 15, 'unwritten', 'man_15'), ('2', 16, 'unwritten', 'man_16'),
('2', 17, 'unwritten', 'man_17'), ('3', 18, 'unwritten', 'man_18'), ('3', 19, 'unwritten', 'man_19'), ('3', 20, 'unwritten', 'man_20'),
('3', 21, 'unwritten', 'man_21'), ('3', 22, 'unwritten', 'man_22'), ('3', 23, 'unwritten', 'man_23'), ('3', 24, 'unwritten', 'man_24'),
('epilogue', 25, 'unwritten', 'man_25')
ON CONFLICT (manifest_id) DO UPDATE SET 
    part_number = EXCLUDED.part_number,
    chapter_number = EXCLUDED.chapter_number,
    status = EXCLUDED.status;
