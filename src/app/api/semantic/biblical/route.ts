import { NextResponse } from "next/server";

export const revalidate = 300;

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function sbFetch(path: string, token?: string) {
  const key = token || SB_KEY;
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

    const [anchors, references] = await Promise.all([
      sbFetch(
        "semantic_biblical_anchors?select=anchor_key,biblical_anchor_label,book,chapter,verse_start,verse_end,motif_family,metadata&active=eq.true&order=book.asc,chapter.asc,verse_start.asc",
        token
      ),
      sbFetch(
        "semantic_meaning_spans?select=subject_name,label,evidence_text,interpretation,confidence&claim_family=eq.biblical_reference&active=eq.true&order=confidence.desc&limit=500",
        token
      ),
    ]);

    // Crosslinks involving biblical anchors
    const biblicalCrosslinks = await sbFetch(
      "semantic_crosslinks?select=relation_type,left_anchor_key,right_anchor_key,evidence_text,confidence&relation_type=like.*biblical*&active=eq.true&order=confidence.desc&limit=200",
      token
    );

    // Group references by book
    const byBook: Record<string, any[]> = {};
    for (const r of references) {
      const lbl = r.label || "Other";
      (byBook[lbl] = byBook[lbl] || []).push(r);
    }

    return NextResponse.json({
      anchors,
      references: references.slice(0, 200),
      crosslinks: biblicalCrosslinks,
      by_book: byBook,
      total_anchors: anchors.length,
      total_references: references.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
