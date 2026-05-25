"use client";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { bus } from "@/core/runtimeEngine";

type Node = { id: string; content: string; dualism_map: any; chapter_id?: string };
type Link = { source: string; target: string };

export default function HyperlinksGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch("/api/graph", { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        clearTimeout(timeout);
        const nodes: Node[] = (d.dualisms || []).filter((n: any) => 
          n && n.dualism_map && typeof n.dualism_map === "object"
        );
        const links: Link[] = [];
        const dKeys = ["sacred", "descent", "shadow", "persona", "anima"];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const shared = dKeys.some(k =>
              (nodes[i].dualism_map?.[k] || 0) > 0.1 && 
              (nodes[j].dualism_map?.[k] || 0) > 0.1
            );
            if (shared) links.push({ source: nodes[i].id, target: nodes[j].id });
          }
        }
        setData({ nodes, links });
      })
      .catch(e => {
        clearTimeout(timeout);
        setError(e.name === "AbortError" 
          ? "Constellation timed out — semantic graph unavailable" 
          : "Could not load constellation");
      });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const dominantDualism = (dm: any) => {
      const dKeys = ["sacred", "descent", "shadow", "persona", "anima"];
      let max = 0; let dom = "self";
      for (const k of dKeys) {
        if ((dm?.[k] || 0) > max) { max = dm[k]; dom = k; }
      }
      return dom;
    };
    const colorFor = (dual: string) => ({
      sacred: "#e8d4a0", descent: "#6b2c2c", shadow: "#2a2a2a",
      persona: "#8a857c", anima: "#c9a96e", self: "#c9a96e"
    } as any)[dual] || "#c9a96e";

    const sim = d3.forceSimulation(data.nodes as any)
      .force("charge", d3.forceManyBody().strength(-40))
      .force("link", d3.forceLink(data.links)
        .id((d: any) => d.id).distance(50).strength(0.4))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => 
        Math.max(4, Math.sqrt((d.content?.length || 50) / 6)) + 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "#c9a96e")
      .attr("stroke-opacity", 0.25)
      .attr("stroke-width", 0.5);

    const node = svg.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d: any) => Math.max(3, Math.sqrt((d.content?.length || 50) / 6)))
      .attr("fill", (d: any) => colorFor(dominantDualism(d.dualism_map)))
      .attr("stroke", (d: any) => 
        dominantDualism(d.dualism_map) === "shadow" ? "#8a857c" : "none")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .style("transition", "r 350ms cubic-bezier(0.22, 1, 0.36, 1)")
      .on("mouseover", function() { d3.select(this).attr("r", (d: any) => 
        Math.max(3, Math.sqrt((d.content?.length || 50) / 6)) + 2); })
      .on("mouseout", function() { d3.select(this).attr("r", (d: any) => 
        Math.max(3, Math.sqrt((d.content?.length || 50) / 6))); })
      .on("click", (event, d: any) => {
        bus.emit("navigate:paragraph", { id: d.id });
        bus.emit("panel:close");
      });

    sim.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    });

    return () => { sim.stop(); };
  }, [data]);

  if (error) return <div className="panel-empty-state">{error}</div>;
  if (!data) return <div className="panel-loading">Loading constellation…</div>;
  if (data.nodes.length === 0) 
    return <div className="panel-empty-state">No dualism data available yet</div>;

  return (
    <div className="hyperlinks-container">
      <h2 className="panel-heading">Parallelisms & Dualisms</h2>
      <div ref={containerRef} className="hyperlinks-svg-wrap">
        <svg ref={svgRef} className="hyperlinks-svg" />
      </div>
      <div className="dualism-legend">
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#e8d4a0" }} />
          <span>Sacred</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#6b2c2c" }} />
          <span>Descent</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" 
            style={{ background: "#2a2a2a", border: "1px solid #8a857c" }} />
          <span>Shadow</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#8a857c" }} />
          <span>Persona</span>
        </div>
        <div className="dualism-legend-item">
          <span className="dualism-dot" style={{ background: "#c9a96e" }} />
          <span>Anima</span>
        </div>
      </div>
      <p className="hyperlinks-hint">
        Tap any node to navigate to that paragraph. Connected paragraphs share thematic poles.
      </p>
    </div>
  );
}