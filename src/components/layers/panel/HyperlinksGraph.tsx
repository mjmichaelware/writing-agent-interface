"use client";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { bus } from "@/core/runtimeEngine";

type Node = { id: string; content: string; dualism_map: any; chapter_id?: string };
type Link = { source: string; target: string; type?: string; weight?: number };

export default function HyperlinksGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: 400, h: 400 });

  useEffect(() => {
    fetch("/api/graph")
      .then(r => r.json())
      .then(d => {
        const rawNodes = d.paragraphs || [];
        const rawLinks = d.hyperlinks || [];

        const nodes: Node[] = rawNodes.map((n: any) => ({
          id: n.id,
          content: n.content,
          dualism_map: n.dualism_map || {},
          chapter_id: n.chapter_id
        }));

        // Use explicit links from the database
        const links: Link[] = rawLinks.map((l: any) => ({
          source: l.paragraph_id,
          target: nodes.find(n => n.id === l.theme_node_b)?.id || l.theme_node_b, // Simple mapping for now
          type: l.link_type,
          weight: l.weight
        })).filter((l: any) => l.source && l.target);

        // Add implicit links based on shared archetypes if few explicit links exist
        if (links.length < 5) {
          const keys = ["sacred","descent","shadow","persona","anima"];
          for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
              if (keys.some(k => (nodes[i].dualism_map?.[k] || 0) > 0.4 &&
                                 (nodes[j].dualism_map?.[k] || 0) > 0.4)) {
                links.push({ source: nodes[i].id, target: nodes[j].id, type: 'implicit' });
              }
            }
          }
        }

        setData({ nodes, links });
      })
      .catch(e => {
        setError(`Error: ${e.message}`);
      });
  }, []);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    let cleanup: (() => void) | undefined;

    import("@supabase/supabase-js").then(({ createClient }) => {
      const client = createClient(supabaseUrl, supabaseKey);
      const channel = client
        .channel("graph-crosslinks")
        .on("postgres_changes", { event: "*", schema: "public", table: "semantic_crosslinks" }, () => {
          fetch("/api/graph")
            .then(r => r.json())
            .then(d => {
              const rawNodes = d.paragraphs || [];
              const rawLinks = d.hyperlinks || [];
              const nodes: Node[] = rawNodes.map((n: any) => ({ id: n.id, content: n.content, dualism_map: n.dualism_map || {}, chapter_id: n.chapter_id }));
              const links: Link[] = rawLinks.map((l: any) => ({ source: l.paragraph_id, target: nodes.find(n => n.id === l.theme_node_b)?.id || l.theme_node_b, type: l.link_type, weight: l.weight })).filter((l: any) => l.source && l.target);
              if (links.length < 5) {
                const keys = ["sacred","descent","shadow","persona","anima"];
                for (let i = 0; i < nodes.length; i++) {
                  for (let j = i + 1; j < nodes.length; j++) {
                    if (keys.some(k => (nodes[i].dualism_map?.[k] || 0) > 0.4 && (nodes[j].dualism_map?.[k] || 0) > 0.4)) {
                      links.push({ source: nodes[i].id, target: nodes[j].id, type: "implicit" });
                    }
                  }
                }
              }
              setData({ nodes, links });
            })
            .catch(() => {});
        })
        .subscribe();
      cleanup = () => { client.removeChannel(channel); };
    });

    return () => { cleanup?.(); };
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        setDims({ w: e.contentRect.width || 400, h: e.contentRect.height || 400 });
      }
    });
    ro.observe(wrap);
    setDims({ w: wrap.clientWidth || 400, h: wrap.clientHeight || 400 });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !wrapRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const w = dims.w;
    const h = dims.h;
    
    const g = svg.append("g");
    
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 8])
      .on("zoom", (e) => g.attr("transform", e.transform.toString()));
    svg.call(zoom as any);

    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "node-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const link = g.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#c9a96e")
      .attr("stroke-opacity", 0.18)
      .attr("stroke-width", (d: any) => (d.weight || 1) * 0.6);

    const node = g.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 7)
      .attr("fill", (d: any) => {
        const m = d.dualism_map || {};
        if (m.sacred > 0.5) return "#e8d4a0";
        if (m.descent > 0.5) return "#6b2c2c";
        if (m.shadow > 0.5) return "#3a3530";
        return "#c9a96e";
      })
      .attr("stroke", (d: any) => {
        const m = d.dualism_map || {};
        if (m.sacred > 0.5) return "rgba(232,212,160,0.6)";
        if (m.descent > 0.5) return "rgba(107,44,44,0.7)";
        return "rgba(201,169,110,0.5)";
      })
      .attr("stroke-width", 1)
      .attr("filter", "url(#node-glow)")
      .call(d3.drag<SVGCircleElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (_e, d: any) => {
        bus.emit("navigate:paragraph", { id: d.id });
        bus.emit("panel:close");
      });

    node.append("title").text((d: any) => d.content.substring(0, 100) + "...");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [data, dims]);

  if (error) return <div className="panel-empty">{error}</div>;
  if (!data) return <div className="panel-loading">Mapping narrative connections...</div>;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h2 className="panel-h2">Parallelisms & Dualisms</h2>
      <p className="panel-sub">{data.nodes.length} nodes · {data.links.length} connections</p>
      
      <div ref={wrapRef} className="flex-1 min-h-[400px] relative overflow-hidden rounded" style={{ background: "linear-gradient(135deg, rgba(8,6,3,0.8) 0%, rgba(12,9,5,0.6) 100%)", border: "1px solid rgba(201,169,110,0.1)", boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)" }}>
        <svg ref={svgRef} className="w-full h-full cursor-move" style={{ width: dims.w, height: dims.h }} />
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#e8d4a0" }} />
          <span>Sacred</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#6b2c2c" }} />
          <span>Descent</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#2a2a2a", border: "1px solid #8a857c" }} />
          <span>Shadow</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#c9a96e" }} />
          <span>Other</span>
        </div>
      </div>
    </div>
  );
}
