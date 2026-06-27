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

async function paginatedFetch(table: string, params: string, token?: string): Promise<any[]> {
  const all: any[] = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const rows = await sbFetch(`${table}?${params}&limit=${pageSize}&offset=${offset}`, token);
    all.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

    const [anchors, observations] = await Promise.all([
      sbFetch("semantic_archetype_anchors?select=anchor_key,canonical_label,ontology_family,active&active=eq.true&order=canonical_label.asc", token),
      paginatedFetch(
        "semantic_meaning_spans",
        "select=subject_name,label,interpretation,confidence,claim_family&claim_family=eq.archetype_observation&active=eq.true&order=confidence.desc",
        token
      ),
    ]);

    // Aggregate: count observations per archetype label
    const countByLabel: Record<string, number> = {};
    const subjectsByLabel: Record<string, Set<string>> = {};
    const topByLabel: Record<string, any[]> = {};

    for (const obs of observations) {
      const lbl = obs.label || "unknown";
      countByLabel[lbl] = (countByLabel[lbl] || 0) + 1;
      if (!subjectsByLabel[lbl]) subjectsByLabel[lbl] = new Set();
      if (obs.subject_name) subjectsByLabel[lbl].add(obs.subject_name);
      if (!topByLabel[lbl]) topByLabel[lbl] = [];
      if (topByLabel[lbl].length < 5) topByLabel[lbl].push(obs);
    }

    // Character-level: which archetype is dominant per character
    const characterTally: Record<string, Record<string, number>> = {};
    for (const obs of observations) {
      if (!obs.subject_name) continue;
      if (!characterTally[obs.subject_name]) characterTally[obs.subject_name] = {};
      const lbl = obs.label || "unknown";
      characterTally[obs.subject_name][lbl] = (characterTally[obs.subject_name][lbl] || 0) + 1;
    }
    const characters = Object.entries(characterTally)
      .map(([name, tally]) => {
        const dominant = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
        return { name, dominant: dominant?.[0] || "unknown", count: Object.values(tally).reduce((a, b) => a + b, 0), tally };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);

    const enrichedAnchors = anchors.map((a: any) => ({
      ...a,
      observation_count: countByLabel[a.canonical_label] || 0,
      subjects: Array.from(subjectsByLabel[a.canonical_label] || []),
      samples: topByLabel[a.canonical_label] || [],
    }));

    return NextResponse.json({
      anchors: enrichedAnchors,
      characters,
      total_observations: observations.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
