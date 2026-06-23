# UI Panel Truth Audit

## src/app/api/chapters/route.ts
- Present fields: ['archetypal_weights', 'dualism_map', 'hebrew_spans', 'metadata', 'paragraphs', 'chapters']
- Relevant lines:
  - L10: // Return all chapters metadata for the TOC/Switcher from Supabase
  - L11: const { rows: chapters } = await query(
  - L13: FROM chapters
  - L16: return NextResponse.json(chapters);
  - L20: let chapterQuery = `SELECT * FROM chapters WHERE manifest_id = $1`;
  - L25: chapterQuery = `SELECT * FROM chapters WHERE chapter_number = $1 OR manifest_id = $2 LIMIT 1`;
  - L29: const { rows: chapters } = await query(chapterQuery, chapterParams);
  - L31: if (chapters.length === 0) {
  - L38: const chapter = chapters[0];
  - L40: // Get paragraphs for this chapter
  - L41: const { rows: paragraphs } = await query(
  - L42: `SELECT id, content, chunk_index, archetypal_weights, dualism_map, hebrew_spans, metadata
  - L43: FROM paragraphs
  - L55: blocks: paragraphs.map(p => ({
  - L58: archetypal_weights: p.archetypal_weights,
  - L59: dualism_map: p.dualism_map,
  - L60: hebrew_spans: p.hebrew_spans,
  - L61: metadata: p.metadata

## src/app/api/manuscript/route.ts
- Present fields: ['biblical_references', 'paragraphs', 'chapters']
- Relevant lines:
  - L25: .from('paragraphs')
  - L26: .select('*, biblical_references(*), chapters(part_number, chapter_number)')

## src/app/api/biblical-references/route.ts
- Present fields: ['biblical_references']
- Relevant lines:
  - L7: `SELECT * FROM biblical_references ORDER BY book ASC, chapter ASC, verse ASC`

## src/app/api/graph/route.ts
- Present fields: ['dualism_map', 'hyperlinks', 'paragraphs']
- Relevant lines:
  - L6: // Fetch paragraphs that have significant dualism mappings
  - L7: const { rows: paragraphs } = await query(
  - L8: `SELECT id, content, dualism_map, chapter_id
  - L9: FROM paragraphs
  - L10: WHERE dualism_map IS NOT NULL AND dualism_map != '{}'::jsonb`
  - L13: // Also fetch explicit hyperlinks/dualisms
  - L14: const { rows: hyperlinks } = await query(
  - L16: FROM hyperlinks`
  - L20: paragraphs,
  - L21: hyperlinks

## src/components/layers/canvas/ManuscriptCore.tsx
- Present fields: ['archetypal_weights', 'dualism_map', 'hebrew_spans']
- Relevant lines:
  - L37: archetypal_weights?: any;
  - L38: dualism_map?: any;
  - L39: hebrew_spans?: any[];
  - L86: const weights = block?.archetypal_weights || {};
  - L87: const dualisms = block?.dualism_map || {};
  - L142: weights: typeof block === "string" ? {} : block?.archetypal_weights || {},
  - L143: dualisms: typeof block === "string" ? {} : block?.dualism_map || {},

## src/components/layers/panel/BiblicalReferencesDirectory.tsx
- Present fields: []
- Relevant lines:
  - L20: fetch("/api/biblical-references")

## src/components/layers/panel/HyperlinksGraph.tsx
- Present fields: ['dualism_map', 'hyperlinks', 'paragraphs']
- Relevant lines:
  - L6: type Node = { id: string; content: string; dualism_map: any; chapter_id?: string };
  - L16: fetch("/api/graph")
  - L19: const rawNodes = d.paragraphs || [];
  - L20: const rawLinks = d.hyperlinks || [];
  - L25: dualism_map: n.dualism_map || {},
  - L42: if (keys.some(k => (nodes[i].dualism_map?.[k] || 0) > 0.4 &&
  - L43: (nodes[j].dualism_map?.[k] || 0) > 0.4)) {
  - L91: const m = d.dualism_map || {};

## src/components/layers/panel/ArchetypesDirectory.tsx
- Present fields: ['archetypal_weights', 'paragraphs', 'chapters']
- Relevant lines:
  - L5: type P = { id: string; content: string; chapter_number?: number; archetypal_weights?: any };
  - L17: fetch("/api/graph")
  - L20: const raw = d.paragraphs || [];
  - L21: setPs(raw.filter((p: any) => p && p.archetypal_weights && Object.keys(p.archetypal_weights).length > 0));
  - L51: const chapters = Object.keys(by).sort((a, b) => +a - +b);
  - L64: {chapters.map(ch => (
  - L71: const d = dom(p.archetypal_weights);
