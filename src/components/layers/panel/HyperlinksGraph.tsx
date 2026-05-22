"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { bus } from "@/core/runtimeEngine";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  content: string;
  chapter_id: string;
  radius: number;
  color: string;
  dualisms: Record<string, number>;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

export default function HyperlinksGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGraph() {
      try {
        const res = await fetch("/api/graph");
        const json = await res.json();
        if (json.dualisms) setData(json.dualisms);
      } catch (err) {
        console.error("Graph fetch failed:", err);
      }
    }
    fetchGraph();
  }, []);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 500;

    // Process nodes
    const nodes: Node[] = data.map((d) => {
      const dualisms = d.dualism_map || {};
      const dominant = Object.entries(dualisms).reduce(
        (a, b) => ((b[1] as number) > (a[1] as number) ? b : a),
        ["none", 0]
      );
      
      const colors: Record<string, string> = {
        sacred: "#e8d4a0",
        descent: "#6b2c2c",
        shadow: "#ffffff",
        persona: "#8a857c",
        anima: "#c9a96e",
        none: "#444444"
      };

      return {
        id: d.id,
        content: d.content,
        chapter_id: d.chapter_id,
        radius: Math.sqrt(d.content.length) * 0.8 + 4,
        color: colors[dominant[0]] || colors.none,
        dualisms
      };
    });

    // Process links based on shared dualism keys
    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sharedKeys = Object.keys(nodes[i].dualisms).filter(
          (k) => nodes[j].dualisms[k] !== undefined
        );
        if (sharedKeys.length > 0) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            value: sharedKeys.length
          });
        }
      }
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 2));

    const link = g.append("g")
      .attr("stroke", "#c9a96e")
      .attr("stroke-opacity", 0.15)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#0a0a0a")
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        bus.emit("navigate:paragraph", { id: d.id });
        bus.emit("ui:menu_close", {});
      })
      .call(d3.drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("title").text((d) => d.content.substring(0, 100) + "...");

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

    // Zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any);

  }, [data]);

  return (
    <div className="w-full h-[50vh] bg-black/20 border border-white/5 rounded-sm overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full" />
      {!data.length && (
        <div className="absolute inset-0 flex items-center justify-center font-serif italic text-[#8a857c]">
          Scanning semantic topology...
        </div>
      )}
    </div>
  );
}