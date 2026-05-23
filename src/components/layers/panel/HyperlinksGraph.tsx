"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { bus } from "@/core/runtimeEngine";

type Node = { id: string; content: string; dualism_map: any; archetypal_weights?: any; x?: number; y?: number };
type Link = { source: string; target: string };

export default function HyperlinksGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    fetch("/api/graph", { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        clearTimeout(timeout);
        const nodes = d.dualisms || [];
        const links: Link[] = [];
        const dKeys = ["sacred", "descent", "shadow", "persona", "anima"];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const shared = dKeys.some(k => 
              nodes[i].dualism_map?.[k] > 0.5 && nodes[j].dualism_map?.[k] > 0.5
            );
            if (shared) links.push({ source: nodes[i].id, target: nodes[j].id });
          }
        }
        setData({ nodes, links });
      })
      .catch(e => {
        clearTimeout(timeout);
        setError(e.name === "AbortError" ? "No semantic data available" : "Graph unavailable");
      });
    
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    const sim = d3.forceSimulation(data.nodes as any)
      .force("charge", d3.forceManyBody().strength(-60))
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(50))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => Math.sqrt((d.content?.length || 50) / 4) + 2));
    
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", "var(--accent-gold)")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 0.5);
    
    const node = svg.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d: any) => Math.max(2.5, Math.sqrt((d.content?.length || 50) / 8)))
      .attr("fill", (d: any) => {
        const dm = d.dualism_map || {};
        const max = Math.max(dm.sacred || 0, dm.descent || 0, dm.shadow || 0, dm.persona || 0, dm.anima || 0);
        if (dm.sacred === max && max > 0) return "#e8d4a0";
        if (dm.descent === max && max > 0) return "#6b2c2c";
        if (dm.shadow === max && max > 0) return "#2a2a2a";
        if (dm.persona === max && max > 0) return "#8a857c";
        return "#c9a96e";
      })
      .style("cursor", "pointer")
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
  if (!data) return <div className="panel-loading">Loading constellation...</div>;
  
  return (
    <div className="hyperlinks-graph-container">
      <h2 className="panel-heading">Parallelisms & Dualisms</h2>
      <svg ref={svgRef} className="hyperlinks-graph-svg" style={{ width: '100%', height: '500px' }} />
      <div className="dualism-legend">
        {[
          { label: "Sacred", color: "#e8d4a0" },
          { label: "Descent", color: "#6b2c2c" },
          { label: "Shadow", color: "#2a2a2a", border: "1px solid #8a857c" },
          { label: "Persona", color: "#8a857c" },
          { label: "Anima", color: "#c9a96e" }
        ].map(item => (
          <div key={item.label} className="dualism-legend-item">
            <div className="dualism-legend-dot" style={{ background: item.color, border: item.border || 'none' }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
