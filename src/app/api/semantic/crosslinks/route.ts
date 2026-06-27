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

    // Top crosslinks by confidence
    const topLinks = await sbFetch(
      "semantic_crosslinks?select=relation_type,left_family,right_family,left_anchor_key,right_anchor_key,evidence_text,rationale,confidence&active=eq.true&order=confidence.desc&limit=200",
      token
    );

    // Dualism spans summary
    const dualisms = await sbFetch(
      "semantic_meaning_spans?select=subject_name,label,interpretation,confidence&claim_family=eq.dualism_relation&active=eq.true&order=confidence.desc&limit=1000",
      token
    );

    // Parallelism spans summary
    const parallelisms = await sbFetch(
      "semantic_meaning_spans?select=subject_name,label,interpretation,confidence&claim_family=eq.parallelism&active=eq.true&order=confidence.desc&limit=500",
      token
    );

    // Aggregate relation type counts
    const byType: Record<string, number> = {};
    for (const l of topLinks) {
      byType[l.relation_type] = (byType[l.relation_type] || 0) + 1;
    }

    // Dualism subjects
    const dualismSubjects: Record<string, { labels: Set<string>; count: number }> = {};
    for (const d of dualisms) {
      if (!d.subject_name) continue;
      if (!dualismSubjects[d.subject_name]) dualismSubjects[d.subject_name] = { labels: new Set(), count: 0 };
      dualismSubjects[d.subject_name].labels.add(d.label || "");
      dualismSubjects[d.subject_name].count++;
    }

    const subjects = Object.entries(dualismSubjects)
      .map(([name, v]) => ({ name, labels: Array.from(v.labels).slice(0, 6), count: v.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return NextResponse.json({
      summary: { total: topLinks.length, by_type: byType },
      top_crosslinks: topLinks.slice(0, 100),
      dualism_subjects: subjects,
      parallelism_sample: parallelisms.slice(0, 50),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
