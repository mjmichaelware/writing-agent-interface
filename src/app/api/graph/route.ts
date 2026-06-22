import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Ensure real-time graph updates

export async function GET() {
  try {
    // 1. Fetch paragraphs with archetypes and dualisms
    const { rows: paragraphs } = await query(
      `SELECT id, chapter_id, content, archetypal_weights, dualism_map 
       FROM paragraphs 
       WHERE (archetypal_weights IS NOT NULL AND archetypal_weights != '{}'::jsonb)
          OR (dualism_map IS NOT NULL AND dualism_map != '{}'::jsonb)`
    );

    // 2. Fetch biblical references
    const { rows: bibRefs } = await query(
      `SELECT id, paragraph_id, reference_text, book, chapter, verse 
       FROM biblical_references`
    );

    // 3. Fetch explicit hyperlinks
    const { rows: hyperlinks } = await query(
      `SELECT id, paragraph_id, theme_node_a, theme_node_b, link_type, weight 
       FROM hyperlinks`
    );

    const nodes = new Map<string, any>();
    const links: any[] = [];

    // Helper to add nodes
    const addNode = (id: string, group: string, label: string, val: number = 1) => {
      if (!nodes.has(id)) {
        nodes.set(id, { id, group, label, val });
      } else {
        nodes.get(id).val += val;
      }
    };

    // Helper to add links
    const addLink = (source: string, target: string, type: string, value: number = 1) => {
      if (!source || !target) return;
      links.push({ source, target, type, value });
    };

    // Process Paragraphs
    for (const p of paragraphs) {
      addNode(p.id, 'paragraph', p.content ? (p.content.substring(0, 40) + '...') : 'Paragraph', 1);

      // Process Archetypes
      if (p.archetypal_weights && typeof p.archetypal_weights === 'object') {
        Object.entries(p.archetypal_weights).forEach(([arch, weight]) => {
          const archId = `arch_${arch}`;
          addNode(archId, 'archetype', arch.toUpperCase(), 3);
          addLink(p.id, archId, 'has_archetype', Number(weight) || 1);
        });
      }

      // Process Dualisms
      if (p.dualism_map && typeof p.dualism_map === 'object') {
        Object.entries(p.dualism_map).forEach(([dual, val]) => {
          const dualId = `dual_${dual}`;
          addNode(dualId, 'dualism', dual, 2);
          addLink(p.id, dualId, 'exhibits_dualism', Number(val) || 1);
        });
      }
    }

    // Process Biblical References
    for (const ref of bibRefs) {
      const refId = `bib_${ref.book}_${ref.chapter}`;
      addNode(refId, 'biblical', `${ref.book} ${ref.chapter}:${ref.verse}`, 4);
      if (ref.paragraph_id) {
        addLink(ref.paragraph_id, refId, 'references', 2);
      }
    }

    // Process Hyperlinks
    for (const hl of hyperlinks) {
      const nodeA = `theme_${hl.theme_node_a}`;
      const nodeB = hl.theme_node_b ? `theme_${hl.theme_node_b}` : null;
      
      addNode(nodeA, 'theme', hl.theme_node_a, 2);
      if (nodeB) {
        addNode(nodeB, 'theme', hl.theme_node_b, 2);
        addLink(nodeA, nodeB, hl.link_type, hl.weight || 1);
      }
      if (hl.paragraph_id) {
        addLink(hl.paragraph_id, nodeA, hl.link_type, hl.weight || 1);
      }
    }

    return NextResponse.json({ 
      nodes: Array.from(nodes.values()),
      links 
    });
  } catch (e: any) {
    console.error("Graph API Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
