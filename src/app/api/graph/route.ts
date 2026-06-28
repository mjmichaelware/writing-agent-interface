import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const client = sb();
  if (!client) return NextResponse.json({ paragraphs: [], crosslinks: [], archetypes: [], error: "Supabase not configured" });

  const [parasRes, crossRes, archRes] = await Promise.all([
    client
      .from("render_paragraphs")
      .select("id, render_para_key, render_index, text, metadata, source_doc_folder")
      .eq("active", true)
      .order("render_index")
      .limit(300),
    client
      .from("semantic_crosslinks")
      .select("id, crosslink_key, relation_family, relation_type, left_span_key, right_span_key, evidence_text, left_anchor_key, right_anchor_key, left_family, right_family")
      .limit(600),
    client
      .from("semantic_archetype_anchors")
      .select("id, anchor_key, canonical_label, ontology_family, metadata")
      .eq("active", true),
  ]);

  const paragraphs = (parasRes.data || []).map((p: any) => ({
    id:             p.id,
    content:        p.text,
    chapter_id:     p.metadata?.chapter_number ?? null,
    chapter_number: p.metadata?.chapter_number ?? null,
    dualism_map:    p.metadata?.dualism_map ?? {},
    archetypal_weights: p.metadata?.archetypal_weights ?? {},
    render_index:   p.render_index,
    source_doc:     p.source_doc_folder,
  }));

  // Build crosslinks as both parallelism and dualism typed links
  const crosslinks = (crossRes.data || []).map((c: any) => ({
    id:                   c.id,
    source_paragraph_id:  c.left_span_key,
    target_paragraph_id:  c.right_span_key,
    relation_family:      c.relation_family,
    relation_type:        c.relation_type,
    left_family:          c.left_family,
    right_family:         c.right_family,
    evidence_text:        c.evidence_text,
    // Tag as parallelism (lateral mirror) or dualism (high/low opposition)
    link_type: ["parallelism","parallel","mirror","echo","chiasm"].includes(c.relation_type?.toLowerCase())
      ? "parallelism"
      : "dualism",
  }));

  const archetypes = (archRes.data || []).map((a: any) => ({
    id:    a.id,
    key:   a.anchor_key,
    label: a.canonical_label,
    family: a.ontology_family,
  }));

  return NextResponse.json({
    paragraphs,
    crosslinks,
    hyperlinks: crosslinks, // backwards-compat alias for HyperlinksGraph
    archetypes,
    error: parasRes.error?.message ?? crossRes.error?.message ?? null,
  });
}
