"use client";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { bus } from "@/core/runtimeEngine";

type RawNode = { id: string; content: string; dualism_map: any; chapter_id?: string };
type SimNode = RawNode & d3.SimulationNodeDatum & { z: number };
type Link = { source: string | SimNode; target: string | SimNode; type?: string; weight?: number };

const ARCHETYPES = [
  { key: "sacred",  color: "#e8d4a0", glow: "#f5e060", label: "Sacred"  },
  { key: "descent", color: "#c23322", glow: "#e04433", label: "Descent" },
  { key: "shadow",  color: "#7a8aaa", glow: "#99aacc", label: "Shadow"  },
  { key: "persona", color: "#c8ccd8", glow: "#e0e4f0", label: "Persona" },
  { key: "anima",   color: "#88bbdd", glow: "#aaddff", label: "Anima"   },
];

function getArchetype(m: any) {
  let best = { color: "#c9a96e", glow: "#e8c880", label: "Other", val: -1 };
  for (const a of ARCHETYPES) {
    if ((m?.[a.key] || 0) > best.val) best = { ...a, val: m[a.key] };
  }
  return best;
}

function getRadius(m: any) {
  const total = Object.values(m || {}).reduce((s: number, v) => s + Math.abs(Number(v) || 0), 0) as number;
  return Math.max(3.5, Math.min(10, 3.5 + total * 2.5));
}

// Seeded pseudo-random (deterministic star positions)
function prng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function buildStars(w: number, h: number, count = 130) {
  const rand = prng(42);
  return Array.from({ length: count }, (_, i) => ({
    x: rand() * w, y: rand() * h,
    r: rand() * 0.9 + 0.25,
    op: rand() * 0.35 + 0.08,
    twinkle: rand() > 0.7,
    delay: rand() * 4,
  }));
}

export default function HyperlinksGraph() {
  const svgRef    = useRef<SVGSVGElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const paraRef   = useRef<SVGGElement>(null);
  const mouseRef  = useRef({ nx: 0, ny: 0 });
  const rafRef    = useRef(0);

  const [data, setData]       = useState<{ nodes: RawNode[]; links: Link[] } | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [dims, setDims]       = useState({ w: 600, h: 480 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // ── Data fetch ──────────────────────────────────────────────
  function parseGraph(d: any) {
    const rawNodes = d.paragraphs || [];
    const rawLinks = d.hyperlinks || [];
    const nodes: RawNode[] = rawNodes.map((n: any) => ({
      id: n.id, content: n.content,
      dualism_map: n.dualism_map || {}, chapter_id: n.chapter_id,
    }));
    let links: Link[] = rawLinks.map((l: any) => ({
      source: l.paragraph_id,
      target: nodes.find(n => n.id === l.theme_node_b)?.id || l.theme_node_b,
      type: l.link_type, weight: l.weight,
    })).filter((l: any) => l.source && l.target);
    if (links.length < 5) {
      const keys = ["sacred","descent","shadow","persona","anima"];
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++)
          if (keys.some(k => (nodes[i].dualism_map?.[k] || 0) > 0.4 &&
                             (nodes[j].dualism_map?.[k] || 0) > 0.4))
            links.push({ source: nodes[i].id, target: nodes[j].id, type: "implicit" });
    }
    return { nodes, links };
  }

  useEffect(() => {
    fetch("/api/graph").then(r => r.json()).then(d => setData(parseGraph(d))).catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;
    let cleanup: (() => void) | undefined;
    import("@supabase/supabase-js").then(({ createClient }) => {
      const client  = createClient(url, key);
      const channel = client.channel("graph-crosslinks")
        .on("postgres_changes", { event: "*", schema: "public", table: "semantic_crosslinks" }, () => {
          fetch("/api/graph").then(r => r.json()).then(d => setData(parseGraph(d))).catch(() => {});
        }).subscribe();
      cleanup = () => client.removeChannel(channel);
    });
    return () => cleanup?.();
  }, []);

  // ── Resize observer ─────────────────────────────────────────
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width || 600, h: height || 480 });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth || 600, h: el.clientHeight || 480 });
    return () => ro.disconnect();
  }, []);

  // ── Mouse parallax RAF ───────────────────────────────────────
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      nx: (e.clientX - rect.left - rect.width  / 2) / rect.width,
      ny: (e.clientY - rect.top  - rect.height / 2) / rect.height,
    };
  };

  useEffect(() => {
    const animate = () => {
      const el = paraRef.current;
      if (el) {
        const { nx, ny } = mouseRef.current;
        el.style.transform = `translate(${nx * 8}px, ${ny * 6}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── D3 render ────────────────────────────────────────────────
  useEffect(() => {
    if (!data || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { w, h } = dims;
    const stars = buildStars(w, h);

    // Add z-depth to nodes
    const simNodes: SimNode[] = data.nodes.map((n, i) => ({ ...n, z: 0.3 + (i % 10) / 10 * 0.7 }));
    const simLinks = data.links.map(l => ({ ...l }));

    // ── Defs ──
    const defs = svg.append("defs");

    // Space background gradient
    const bgGrad = defs.append("radialGradient").attr("id", "cosmos-bg").attr("cx", "38%").attr("cy", "42%").attr("r", "72%");
    bgGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0a0818");
    bgGrad.append("stop").attr("offset", "55%").attr("stop-color", "#050410");
    bgGrad.append("stop").attr("offset", "100%").attr("stop-color", "#020208");

    // Nebula 1 (purple, top-left)
    const neb1 = defs.append("radialGradient").attr("id", "neb1").attr("cx", "25%").attr("cy", "30%").attr("r", "45%");
    neb1.append("stop").attr("offset", "0%").attr("stop-color", "rgba(80,40,140,0.14)");
    neb1.append("stop").attr("offset", "100%").attr("stop-color", "rgba(0,0,0,0)");

    // Nebula 2 (blue, bottom-right)
    const neb2 = defs.append("radialGradient").attr("id", "neb2").attr("cx", "75%").attr("cy", "70%").attr("r", "50%");
    neb2.append("stop").attr("offset", "0%").attr("stop-color", "rgba(20,50,110,0.12)");
    neb2.append("stop").attr("offset", "100%").attr("stop-color", "rgba(0,0,0,0)");

    // Glow filters
    const makeGlow = (id: string, std: number) => {
      const f = defs.append("filter").attr("id", id).attr("x", "-150%").attr("y", "-150%").attr("width", "400%").attr("height", "400%");
      f.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", std).attr("result", "blur");
      const m = f.append("feMerge");
      m.append("feMergeNode").attr("in", "blur");
      m.append("feMergeNode").attr("in", "SourceGraphic");
    };
    makeGlow("glow-xs", 1.5);
    makeGlow("glow-sm", 3);
    makeGlow("glow-md", 6);
    makeGlow("glow-lg", 12);

    // ── Background layers ──
    svg.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#cosmos-bg)");

    // Parallax group (shifted by mouse)
    const para = svg.append("g").attr("class", "parallax-bg");
    (paraRef as any).current = para.node();

    para.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#neb1)");
    para.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#neb2)");

    // Background stars
    const starGroup = para.append("g").attr("class", "bg-stars");
    stars.forEach((s, i) => {
      const c = starGroup.append("circle")
        .attr("cx", s.x).attr("cy", s.y).attr("r", s.r)
        .attr("fill", "white").attr("opacity", s.op);
      if (s.twinkle) {
        c.style("animation", `star-twinkle ${1.8 + s.delay}s ease-in-out ${s.delay}s infinite alternate`);
      }
    });

    // ── Main simulation group ──
    const g = svg.append("g").attr("class", "sim-group");

    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force("link", d3.forceLink<SimNode, any>(simLinks).id((d) => d.id).distance(80).strength(0.45))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide<SimNode>().radius(d => getRadius(d.dualism_map) + 10));

    // Links
    const linkSel = g.append("g").attr("class", "links")
      .selectAll<SVGLineElement, Link>("line")
      .data(simLinks).join("line")
      .attr("class", "constellation-link")
      .attr("stroke", d => d.type === "implicit" ? "rgba(180,160,120,0.10)" : "rgba(201,169,110,0.20)")
      .attr("stroke-width", d => (d.weight || 1) * 0.4 + 0.3)
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", d => d.type === "implicit" ? "2 5" : null);

    // Node groups
    const nodeSel = g.append("g").attr("class", "nodes")
      .selectAll<SVGGElement, SimNode>("g.star-node")
      .data(simNodes).join("g")
      .attr("class", "star-node")
      .style("cursor", "pointer");

    // Outer halo (largest, most transparent)
    nodeSel.append("circle").attr("class", "halo-outer")
      .attr("r", d => getRadius(d.dualism_map) * 3.5)
      .attr("fill", d => getArchetype(d.dualism_map).glow)
      .attr("opacity", d => 0.04 + d.z * 0.03)
      .attr("filter", "url(#glow-lg)");

    // Mid glow
    nodeSel.append("circle").attr("class", "halo-mid")
      .attr("r", d => getRadius(d.dualism_map) * 1.8)
      .attr("fill", d => getArchetype(d.dualism_map).glow)
      .attr("opacity", d => 0.10 + d.z * 0.06)
      .attr("filter", "url(#glow-md)");

    // Core star
    nodeSel.append("circle").attr("class", "star-core")
      .attr("r", d => getRadius(d.dualism_map))
      .attr("fill", d => getArchetype(d.dualism_map).color)
      .attr("opacity", d => 0.75 + d.z * 0.25)
      .attr("filter", "url(#glow-sm)");

    // Bright pinpoint center
    nodeSel.append("circle").attr("class", "star-point")
      .attr("r", d => Math.max(1, getRadius(d.dualism_map) * 0.3))
      .attr("fill", "white")
      .attr("opacity", d => 0.5 + d.z * 0.5)
      .attr("filter", "url(#glow-xs)");

    // Scale by z-depth (perspective)
    nodeSel.each(function(d) {
      d3.select(this).attr("transform", `scale(${0.55 + d.z * 0.55})`);
    });

    // Interaction
    nodeSel
      .on("mouseenter", function(event, d) {
        setHovered(d.id);
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) setTooltip({ text: d.content?.slice(0, 90) + "…", x: event.clientX - rect.left, y: event.clientY - rect.top - 12 });
      })
      .on("mousemove", function(event) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) setTooltip(t => t ? { ...t, x: event.clientX - rect.left, y: event.clientY - rect.top - 12 } : null);
      })
      .on("mouseleave", () => { setHovered(null); setTooltip(null); })
      .on("click", (_e, d) => { bus.emit("navigate:paragraph", { id: d.id }); bus.emit("panel:close"); });

    // Drag
    nodeSel.call(
      d3.drag<SVGGElement, SimNode>()
        .on("start", (ev, d) => { if (!ev.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag",  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
        .on("end",   (ev, d) => { if (!ev.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
    );

    // Tick
    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      nodeSel.attr("transform", d => {
        const scale = 0.55 + d.z * 0.55;
        return `translate(${d.x ?? 0},${d.y ?? 0}) scale(${scale})`;
      });
    });

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.15, 8])
      .on("zoom", e => g.attr("transform", e.transform.toString()));
    svg.call(zoom as any);

    return () => simulation.stop();
  }, [data, dims]);

  // ── Hover highlighting ───────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current || !data) return;
    const svg = d3.select(svgRef.current);
    if (hovered) {
      const connected = new Set([hovered]);
      data.links.forEach((l: any) => {
        const s = typeof l.source === "object" ? l.source.id : l.source;
        const t = typeof l.target === "object" ? l.target.id : l.target;
        if (s === hovered) connected.add(t);
        if (t === hovered) connected.add(s);
      });
      svg.selectAll<SVGGElement, SimNode>("g.star-node")
        .style("opacity", d => connected.has(d.id) ? 1 : 0.08)
        .style("transition", "opacity 200ms");
      svg.selectAll<SVGLineElement, Link>("line.constellation-link")
        .style("opacity", (d: any) => {
          const s = typeof d.source === "object" ? d.source.id : d.source;
          const t = typeof d.target === "object" ? d.target.id : d.target;
          return s === hovered || t === hovered ? 0.85 : 0.03;
        })
        .attr("stroke-width", (d: any) => {
          const s = typeof d.source === "object" ? d.source.id : d.source;
          const t = typeof d.target === "object" ? d.target.id : d.target;
          return s === hovered || t === hovered ? 1.2 : 0.2;
        })
        .attr("stroke", (d: any) => {
          const s = typeof d.source === "object" ? d.source.id : d.source;
          const t = typeof d.target === "object" ? d.target.id : d.target;
          return s === hovered || t === hovered ? "rgba(232,212,160,0.7)" : "rgba(201,169,110,0.06)";
        });
    } else {
      svg.selectAll("g.star-node").style("opacity", 1).style("transition", "opacity 400ms");
      svg.selectAll<SVGLineElement, Link>("line.constellation-link")
        .style("opacity", null)
        .attr("stroke-width", (d: any) => (d.weight || 1) * 0.4 + 0.3)
        .attr("stroke", (d: any) => d.type === "implicit" ? "rgba(180,160,120,0.10)" : "rgba(201,169,110,0.20)");
    }
  }, [hovered, data]);

  if (error) return <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#8a857c" }}>{error}</div>;
  if (!data)  return <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#8a857c" }}>Mapping the constellation…</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.125rem", color: "#e8e4dc", margin: 0 }}>
          Parallelisms & Dualisms
        </h2>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: "#8a857c" }}>
          {data.nodes.length} stars · {data.links.length} connections
        </span>
      </div>

      {/* Canvas */}
      <div ref={wrapRef} onMouseMove={onMouseMove}
        style={{ flex: 1, minHeight: 420, position: "relative", overflow: "hidden", borderRadius: 2, border: "1px solid rgba(201,169,110,0.08)" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: "absolute", left: tooltip.x + 12, top: tooltip.y - 8,
            background: "rgba(8,6,3,0.92)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(201,169,110,0.25)",
            padding: "0.5rem 0.75rem", maxWidth: 220, pointerEvents: "none",
            fontFamily: "Georgia, serif", fontStyle: "italic",
            fontSize: "0.75rem", color: "#c9a96e", lineHeight: 1.5,
            boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          }}>
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.75rem", justifyContent: "center" }}>
        {ARCHETYPES.map(a => (
          <div key={a.key} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color, boxShadow: `0 0 6px ${a.glow}` }} />
            <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: "#8a857c" }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Twinkling animation */}
      <style>{`
        @keyframes star-twinkle {
          from { opacity: var(--op-from, 0.08); transform: scale(0.9); }
          to   { opacity: var(--op-to,   0.35); transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
