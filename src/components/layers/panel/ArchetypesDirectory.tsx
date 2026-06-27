"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useAuth } from "@/lib/supabase/useAuth";
import { createClient } from "@/lib/supabase/client";

type Anchor = {
  anchor_key: string;
  canonical_label: string;
  ontology_family: string;
  observation_count: number;
  subjects: string[];
  samples: any[];
};
type Character = { name: string; dominant: string; count: number; tally: Record<string, number> };
type Data = { anchors: Anchor[]; characters: Character[]; total_observations: number };

const ARCHETYPE_COLORS: Record<string, string> = {
  "Self": "#f0d080",
  "Ego": "#e8e4dc",
  "Shadow": "#3a3035",
  "Anima": "#c9a96e",
  "Animus": "#8a9bb5",
  "Persona": "#b5a090",
  "Hero": "#d4a574",
  "Great Mother": "#8fbe8f",
  "Wise Old Man": "#a0a0c0",
  "Trickster": "#c05050",
  "Threshold Guardian": "#808080",
  "Shapeshifter": "#a070a0",
};

function star(n: number, r1: number, r2: number) {
  let path = "";
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = (Math.PI / n) * i - Math.PI / 2;
    path += (i === 0 ? "M" : "L") + r * Math.cos(a) + " " + r * Math.sin(a);
  }
  return path + "Z";
}

export default function ArchetypesDirectory() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<{ anchor: Anchor; x: number; y: number } | null>(null);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!session) return;
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session: s } }) => {
      const token = s?.access_token;
      fetch("/api/semantic/archetypes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(r => r.json())
        .then(d => {
          if (d.error) setError(d.error);
          else setData(d);
        })
        .catch(e => setError(e.message));
    });
  }, [session]);

  // Realtime: refresh when new spans are inserted
  useEffect(() => {
    if (!session) return;
    const sb = createClient();
    const channel = sb
      .channel("archetype_updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "semantic_meaning_spans" }, () => {
        sb.auth.getSession().then(({ data: { session: s } }) => {
          fetch("/api/semantic/archetypes", {
            headers: s?.access_token ? { Authorization: `Bearer ${s.access_token}` } : {},
          })
            .then(r => r.json())
            .then(d => { if (!d.error) setData(d); });
        });
      })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [session]);

  useEffect(() => {
    if (!data || !svgRef.current || !wrapRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const W = wrapRef.current.clientWidth || 560;
    const H = wrapRef.current.clientHeight || 420;
    const cx = W / 2;
    const cy = H / 2;

    // Starfield background
    const defs = svg.append("defs");
    const bg = defs.append("radialGradient").attr("id", "sky-bg").attr("cx", "50%").attr("cy", "50%").attr("r", "60%");
    bg.append("stop").attr("offset", "0%").attr("stop-color", "#0d0d18").attr("stop-opacity", 1);
    bg.append("stop").attr("offset", "100%").attr("stop-color", "#030308").attr("stop-opacity", 1);
    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#sky-bg)");

    // Distant stars
    const rng = d3.randomLcg(42);
    for (let i = 0; i < 120; i++) {
      const r = rng() * 1.5;
      svg.append("circle")
        .attr("cx", rng() * W).attr("cy", rng() * H)
        .attr("r", r)
        .attr("fill", "white")
        .attr("opacity", rng() * 0.4 + 0.1);
    }

    // Position archetypes in a circle
    const anchors = data.anchors.filter(a => a.observation_count > 0 || true);
    const maxCount = Math.max(...anchors.map(a => a.observation_count), 1);
    const radius = Math.min(W, H) * 0.36;

    const angleStep = (2 * Math.PI) / anchors.length;
    const positions: Record<string, { x: number; y: number }> = {};

    anchors.forEach((anchor, i) => {
      const angle = angleStep * i - Math.PI / 2;
      positions[anchor.canonical_label] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });

    // Constellation lines between related archetypes
    const PAIRS = [
      ["Self", "Shadow"], ["Self", "Ego"], ["Anima", "Animus"],
      ["Hero", "Threshold Guardian"], ["Persona", "Shadow"],
      ["Trickster", "Shapeshifter"], ["Wise Old Man", "Great Mother"],
    ];
    const lineG = svg.append("g").attr("class", "constellation-lines");
    for (const [a, b] of PAIRS) {
      const pa = positions[a], pb = positions[b];
      if (!pa || !pb) continue;
      lineG.append("line")
        .attr("x1", pa.x).attr("y1", pa.y)
        .attr("x2", pb.x).attr("y2", pb.y)
        .attr("stroke", "rgba(201,169,110,0.12)")
        .attr("stroke-width", 0.8)
        .attr("stroke-dasharray", "4 6");
    }

    // Character satellites (inner ring)
    const charG = svg.append("g").attr("class", "characters");
    data.characters.slice(0, 12).forEach((char, i) => {
      const pos = positions[char.dominant];
      if (!pos) return;
      const angle = angleStep * anchors.findIndex(a => a.canonical_label === char.dominant) - Math.PI / 2;
      const orbitR = 32 + (i % 3) * 14;
      const charAngle = angle + (Math.PI / 4) * (i % 4);
      const cx2 = pos.x + orbitR * Math.cos(charAngle);
      const cy2 = pos.y + orbitR * Math.sin(charAngle);
      charG.append("circle")
        .attr("cx", cx2).attr("cy", cy2)
        .attr("r", 2.5)
        .attr("fill", ARCHETYPE_COLORS[char.dominant] || "#c9a96e")
        .attr("opacity", 0.6);
      charG.append("text")
        .attr("x", cx2 + 4).attr("y", cy2 + 4)
        .attr("fill", "#8a857c")
        .attr("font-size", "9px")
        .attr("font-family", "Georgia, serif")
        .attr("font-style", "italic")
        .text(char.name.length > 12 ? char.name.slice(0, 10) + "…" : char.name);
    });

    // Archetype stars
    const nodeG = svg.append("g").attr("class", "archetypes");
    anchors.forEach(anchor => {
      const pos = positions[anchor.canonical_label];
      if (!pos) return;
      const size = 4 + (anchor.observation_count / maxCount) * 16;
      const color = ARCHETYPE_COLORS[anchor.canonical_label] || "#c9a96e";
      const g = nodeG.append("g")
        .attr("transform", `translate(${pos.x},${pos.y})`)
        .style("cursor", "pointer");

      // Glow
      const glowId = `glow-${anchor.anchor_key.replace(/[^a-z0-9]/gi, "")}`;
      const glow = defs.append("filter").attr("id", glowId).attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
      glow.append("feGaussianBlur").attr("stdDeviation", size * 0.8).attr("result", "blur");
      const feMerge = glow.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "blur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      g.append("path")
        .attr("d", star(4, size * 1.2, size * 0.5))
        .attr("fill", color)
        .attr("opacity", anchor.observation_count > 0 ? 0.85 : 0.3)
        .attr("filter", `url(#${glowId})`);

      g.append("text")
        .attr("y", size * 1.8 + 8)
        .attr("text-anchor", "middle")
        .attr("fill", color)
        .attr("opacity", 0.85)
        .attr("font-size", "10px")
        .attr("font-family", "Georgia, serif")
        .attr("font-style", "italic")
        .text(anchor.canonical_label);

      if (anchor.observation_count > 0) {
        g.append("text")
          .attr("y", size * 1.8 + 20)
          .attr("text-anchor", "middle")
          .attr("fill", "#8a857c")
          .attr("font-size", "8px")
          .attr("font-family", "Georgia, serif")
          .text(anchor.observation_count);
      }

      g.on("mouseenter", function (event) {
        d3.select(this).select("path").transition().duration(200).attr("opacity", 1);
        setHover({ anchor, x: event.offsetX, y: event.offsetY });
      }).on("mouseleave", function () {
        d3.select(this).select("path").transition().duration(200).attr("opacity", anchor.observation_count > 0 ? 0.85 : 0.3);
        setHover(null);
      });
    });

    // Central label
    svg.append("text")
      .attr("x", cx).attr("y", cy)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "rgba(201,169,110,0.15)")
      .attr("font-size", "11px")
      .attr("font-family", "Georgia, serif")
      .attr("font-style", "italic")
      .text("Jungian Constellation");
  }, [data]);

  if (authLoading) return <div className="panel-loading">Summoning…</div>;
  if (!session) return (
    <div className="panel-empty" style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "1rem" }}>Author access required.</p>
      <a href="/login" style={{ color: "#c9a96e", fontStyle: "italic", fontSize: "0.875rem" }}>Enter the manuscript →</a>
    </div>
  );
  if (error) return <div className="panel-empty">{error}</div>;
  if (!data) return <div className="panel-loading">Mapping the constellation…</div>;

  return (
    <div className="flex flex-col h-full animate-fade-in" style={{ position: "relative" }}>
      <h2 className="panel-h2">Archetype Constellation</h2>
      <p className="panel-sub">{data.total_observations.toLocaleString()} observations · {data.anchors.length} archetypes · {data.characters.length} characters</p>

      <div ref={wrapRef} style={{ flex: 1, minHeight: "380px", position: "relative", borderRadius: "4px", overflow: "hidden" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />

        {hover && (
          <div style={{
            position: "absolute",
            left: Math.min(hover.x + 12, (wrapRef.current?.clientWidth || 400) - 220),
            top: Math.max(hover.y - 60, 8),
            background: "rgba(10,10,10,0.95)",
            border: "1px solid rgba(201,169,110,0.3)",
            borderRadius: "3px",
            padding: "0.75rem 1rem",
            maxWidth: "210px",
            pointerEvents: "none",
            zIndex: 10,
          }}>
            <div style={{ color: ARCHETYPE_COLORS[hover.anchor.canonical_label] || "#c9a96e", fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: "0.3rem" }}>
              {hover.anchor.canonical_label}
            </div>
            <div style={{ color: "#8a857c", fontSize: "0.75rem", marginBottom: "0.4rem" }}>
              {hover.anchor.observation_count} observations
            </div>
            {hover.anchor.subjects.length > 0 && (
              <div style={{ color: "#e8e4dc", fontSize: "0.75rem" }}>
                {hover.anchor.subjects.slice(0, 5).join(", ")}
              </div>
            )}
            {hover.anchor.samples[0]?.interpretation && (
              <div style={{ color: "#8a857c", fontSize: "0.7rem", marginTop: "0.4rem", fontStyle: "italic", lineHeight: 1.5 }}>
                &ldquo;{hover.anchor.samples[0].interpretation.slice(0, 120)}…&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
