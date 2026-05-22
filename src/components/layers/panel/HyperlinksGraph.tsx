"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { bus } from "@/core/runtimeEngine";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  content: string;
  radius: number;
  color: string;
  archetype: string;
  dualisms: Record<string, number>;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

/**
 * ARCHITECTURAL SPECIFICATION: SEMANTIC TOPOLOGY GRAPH
 * * Visualizes the Narrative Arc as a force-directed neural network.
 * * Connects paragraphs via shared psychological coefficients.
 */
export default function HyperlinksGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    async function fetchGraph() {
      try {
        const res = await fetch("/api/graph", { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const json = await res.json();
        if (json.dualisms) {
          setData(json.dualisms);
        } else {
          setData([]);
        }
      } catch (err: any) {
        console.error("Graph fetch failed:", err);
        if (err.name === 'AbortError') {
          setError("Request timed out");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchGraph();
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 500;

    const colors: Record<string, string> = {
      sacred: "#e8d4a0",
      descent: "#6b2c2c",
      shadow: "#0a0a0a",
      persona: "#8a857c",
      anima: "#c9a96e",
      self: "#d4af37",
      none: "#444444"
    };

    const nodes: Node[] = data.map((d) => {
      const weights = d.archetypal_weights || {};
      const dominant = Object.entries(weights).reduce(
        (a, b) => ((b[1] as number) > (a[1] as number) ? b : a),
        ["none", 0]
      );

      return {
        id: d.id,
        content: d.content,
        radius: Math.sqrt(d.content.length) * 0.7 + 5,
        color: colors[dominant[0]] || colors.none,
        archetype: dominant[0],
        dualisms: d.dualism_map || {}
      };
    });

    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // High connection if they share strong dualisms or archetypes
        const sharedDualisms = Object.keys(nodes[i].dualisms).filter(
          (k) => nodes[i].dualisms[k] > 0.5 && nodes[j].dualisms[k] > 0.5
        );
        
        if (sharedDualisms.length > 0 || nodes[i].archetype === nodes[j].archetype) {
            links.push({
              source: nodes[i].id,
              target: nodes[j].id,
              value: sharedDualisms.length + (nodes[i].archetype === nodes[j].archetype ? 1 : 0)
            });
        }
      }
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Defs for Glow Filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
        .attr("id", "glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");
    
    filter.append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "blur");
    filter.append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "blur")
        .attr("operator", "over");

    const g = svg.append("g");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 8));

    const link = g.append("g")
      .attr("stroke", "rgba(201, 169, 110, 0.1)")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 0.5);

    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        bus.emit("navigate:paragraph", { id: d.id });
        bus.emit("panel:close", {});
      });

    // Outer Halo
    nodeGroup.append("circle")
      .attr("r", (d) => d.radius + 3)
      .attr("fill", "transparent")
      .attr("stroke", (d) => d.color)
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1)
      .attr("filter", "url(#glow)");

    // Inner Node
    nodeGroup.append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#0a0a0a")
      .attr("stroke-width", 2);

    nodeGroup.call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
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

    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any);

  }, [data]);

  return (
    <div className="w-full h-[60vh] bg-[#020203]/40 border border-white/5 rounded-sm overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Legend */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        {["sacred", "descent", "shadow", "anima", "self"].map(a => (
            <div key={a} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ({
                    sacred: "#e8d4a0",
                    descent: "#6b2c2c",
                    shadow: "#0a0a0a",
                    anima: "#c9a96e",
                    self: "#d4af37"
                } as any)[a] }} />
                <span className="font-hebrew text-[8px] uppercase tracking-widest text-[#8a857c]">{a}</span>
            </div>
        ))}
      </div>

      {!isLoading && !data.length && (
        <div className="absolute inset-0 flex items-center justify-center font-serif italic text-[#8a857c]">
          {error ? "No semantic data available" : "No semantic connections found"}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center font-serif italic text-[#8a857c] animate-pulse">
          Scanning semantic topology...
        </div>
      )}
    </div>
  );
}
