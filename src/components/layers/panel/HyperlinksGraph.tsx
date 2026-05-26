"use client";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { bus } from "@/core/runtimeEngine";

type Node = { id: string; content: string; dualism_map: any; chapter_id?: string };
type Link = { source: string; target: string };

export default function HyperlinksGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{ nodes: Node[]; links: Link[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 8000);
    fetch("/api/graph", { signal: c.signal })
      .then(r => r.json())
      .then(d => {
        clearTimeout(t);
        const nodes: Node[] = (d.dualisms || []).filter((n: any) =>
          n && n.dualism_map && typeof n.dualism_map === "object");
        const links: Link[] = [];
        const keys = ["sacred","descent","shadow","persona","anima"];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            if (keys.some(k => (nodes[i].dualism_map?.[k] || 0) > 0.1 &&
                               (nodes[j].dualism_map?.[k] || 0) > 0.1)) {
              links.push({ source: nodes[i].id, target: nodes[j].id });
            }
          }
        }
        setData({ nodes, links });
      })
      .catch(e => {
        clearTimeout(t);
        setError(e.name === "AbortError" ? "Timed out" : `Error: ${e.message}`);
      });
    return () => { clearTimeout(t); c.abort(); };
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !wrapRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const w = wrapRef.current.clientWidth || 400;
    const h = wrapRef.current.clientHeight || 320;
    svg.attr("viewBox", `0 0 ${w} ${h}`);
    const dom = (m: any) => {
      const keys = ["sacred","descent","shadow","persona","anima"];
      let max = 0, x = "self";
      for (const k of keys) if ((m?.[k] || 0) > max) { max = m[k]; x = k; }
      return x;
    };
    const color = (k: string) => ({
      sacred: "#e8d4a0", descent: "#6b2c2c", shadow: "#2a2a2a",
      persona: "#8a857c", anima: "#c9a96e", self: "#c9a96e",
    } as any)[k] || "#c9a96e";
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.5, 4])
      .on("zoom", (e) => g.attr("transform", e.transform.toString()));
    svg.call(zoom as any);
    const sim = d3.forceSimulation(data.nodes as any)
      .force("charge", d3.forceManyBody().strength(-40))
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(50).strength(0.4))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide().radius((d: any) =>
        Math.max(4, Math.sqrt((d.content?.length || 50) / 6)) + 2));
    const link = g.append("g").selectAll("line").data(data.links).join("line")
      .attr("stroke", "#c9a96e").attr("stroke-opacity", 0.25).attr("stroke-width", 0.5);
    const node = g.append("g").selectAll("circle").data(data.nodes).join("circle")
      .attr("r", (d: any) => Math.max(3, Math.sqrt((d.content?.length || 50) / 6)))
      .attr("fill", (d: any) => color(dom(d.dualism_map)))
      .attr("stroke", (d: any) => dom(d.dualism_map) === "shadow" ? "#8a857c" : "none")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", (_e, d: any) => {
        bus.emit("navigate:paragraph", { id: d.id });
        bus.emit("panel:close");
      });
    sim.on("tick", () => {
      link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
          .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    });
    return () => { sim.stop(); };
  }, [data]);

  const muted = "#8a857c";
  if (error) return <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: muted, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{error}</div>;
  if (!data) return <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: muted, fontFamily: "Georgia, serif", fontStyle: "italic" }}>Loading constellation…</div>;
  if (data.nodes.length === 0) return <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: muted, fontFamily: "Georgia, serif", fontStyle: "italic" }}>No dualism data yet</div>;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: "#c9a96e", margin: "0 0 0.25rem", textAlign: "center" }}>Parallelisms &amp; Dualisms</h2>
      <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: muted, textAlign: "center", margin: "0 0 0.75rem" }}>{data.nodes.length} paragraphs · {data.links.length} thematic links</p>
      <div ref={wrapRef} style={{ flex: 1, minHeight: 280, position: "relative" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.875rem", padding: "0.875rem 0 0", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted }}>
        {[["#e8d4a0","Sacred"],["#6b2c2c","Descent"],["#2a2a2a","Shadow"],["#8a857c","Persona"],["#c9a96e","Anima"]].map(([c,n]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: c, border: n === "Shadow" ? "1px solid #8a857c" : "none" }} />
            <span>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
