"use client";
import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";

const ARCHETYPES = [
  { key: "sacred",  label: "Sacred",  color: "#e8d4a0", glow: "#f5e060" },
  { key: "descent", label: "Descent", color: "#c23322", glow: "#e04433" },
  { key: "shadow",  label: "Shadow",  color: "#7a8aaa", glow: "#99aacc" },
  { key: "persona", label: "Persona", color: "#c8ccd8", glow: "#e0e4f0" },
  { key: "anima",   label: "Anima",   color: "#88bbdd", glow: "#aaddff" },
];

type BookNode = { id: string; book: string; count: number; weights: Record<string, number> };
type Chord = { book: string; arch: string; strength: number };

function prng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

export default function BiblicalArchetypeMatrix() {
  const svgRef  = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims]           = useState({ w: 600, h: 520 });
  const [bookNodes, setBookNodes] = useState<BookNode[]>([]);
  const [chords, setChords]       = useState<Chord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // ── Data ─────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/api/biblical-references").then(r => r.json()),
      fetch("/api/graph").then(r => r.json()),
    ]).then(([biblData, graphData]) => {
      const refs       = biblData.references || [];
      const paragraphs = graphData.paragraphs || [];

      const paraArch: Record<string, Record<string, number>> = {};
      for (const p of paragraphs) {
        if (p.id) paraArch[p.id] = p.dualism_map || p.archetypal_weights || {};
      }

      const bookMap: Record<string, { count: number; weights: Record<string, number> }> = {};
      for (const ref of refs) {
        const book = ref.book || "Other";
        if (!bookMap[book]) bookMap[book] = { count: 0, weights: {} };
        bookMap[book].count++;
        const pw = paraArch[ref.paragraph_id] || {};
        for (const a of ARCHETYPES) {
          bookMap[book].weights[a.key] = (bookMap[book].weights[a.key] || 0) + (pw[a.key] || 0);
        }
      }

      const books = Object.entries(bookMap)
        .map(([book, { count, weights }]) => ({
          id: `book__${book.replace(/[^a-zA-Z0-9]/g, "_")}`,
          book, count, weights,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 14);

      const allChords: Chord[] = [];
      for (const bn of books)
        for (const a of ARCHETYPES) {
          const s = bn.weights[a.key] || 0;
          if (s > 0.05) allChords.push({ book: bn.id, arch: a.key, strength: s });
        }

      setBookNodes(books);
      setChords(allChords);
      setLoading(false);
    }).catch(e => { setError(String(e?.message || e)); setLoading(false); });
  }, []);

  // ── Resize ───────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width || 600, h: height || 520 });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth || 600, h: el.clientHeight || 520 });
    return () => ro.disconnect();
  }, []);

  // ── D3 render ────────────────────────────────────────────────
  useEffect(() => {
    if (!bookNodes.length || !svgRef.current) return;
    const { w, h } = dims;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Backgrounds
    const bgG = defs.append("radialGradient").attr("id", "bam-bg").attr("cx", "45%").attr("cy", "40%").attr("r", "75%");
    bgG.append("stop").attr("offset",   "0%").attr("stop-color", "#080614");
    bgG.append("stop").attr("offset",  "55%").attr("stop-color", "#040310");
    bgG.append("stop").attr("offset", "100%").attr("stop-color", "#020209");

    const neb = defs.append("radialGradient").attr("id", "bam-neb").attr("cx", "50%").attr("cy", "50%").attr("r", "38%");
    neb.append("stop").attr("offset",   "0%").attr("stop-color", "rgba(110,60,200,0.09)");
    neb.append("stop").attr("offset", "100%").attr("stop-color", "rgba(0,0,0,0)");

    // Glow filters
    const makeGlow = (id: string, std: number) => {
      const f = defs.append("filter").attr("id", id)
        .attr("x", "-300%").attr("y", "-300%").attr("width", "700%").attr("height", "700%");
      f.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", std).attr("result", "blur");
      const m = f.append("feMerge");
      m.append("feMergeNode").attr("in", "blur");
      m.append("feMergeNode").attr("in", "SourceGraphic");
    };
    makeGlow("bam-xs", 1.5);
    makeGlow("bam-sm", 3);
    makeGlow("bam-md", 7);
    makeGlow("bam-lg", 15);

    // Render bg
    svg.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#bam-bg)");
    svg.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#bam-neb)");

    // Micro-stars
    const rand = prng(77);
    const starG = svg.append("g");
    for (let i = 0; i < 90; i++) {
      starG.append("circle")
        .attr("cx", rand() * w).attr("cy", rand() * h)
        .attr("r", rand() * 0.65 + 0.15)
        .attr("fill", "white").attr("opacity", rand() * 0.18 + 0.04);
    }

    // Sub-title
    svg.append("text").attr("x", w / 2).attr("y", 18)
      .attr("text-anchor", "middle")
      .attr("font-family", "Georgia, serif").attr("font-style", "italic")
      .attr("font-size", "0.7rem").attr("fill", "rgba(201,169,110,0.3)")
      .text("Biblical Text  ×  Jungian Resonance");

    // Layout
    const PAD_V = 40, PAD_H = 14;
    const innerH = h - PAD_V * 2;
    const bookX = PAD_H + w * 0.015;
    const archX = w - PAD_H - w * 0.015;

    const bookY = (i: number) => PAD_V + (i + 0.5) * (innerH / bookNodes.length);
    const archY = (i: number) => PAD_V + (i + 0.5) * (innerH / ARCHETYPES.length);
    const maxStr = Math.max(...chords.map(c => c.strength), 1);

    // Chords (drawn with dash-draw animation)
    const chordG = svg.append("g").attr("class", "chords");
    chords.forEach((chord, ci) => {
      const bi = bookNodes.findIndex(b => b.id === chord.book);
      const ai = ARCHETYPES.findIndex(a => a.key === chord.arch);
      if (bi < 0 || ai < 0) return;
      const bx = bookX, by = bookY(bi);
      const ax = archX, ay = archY(ai);
      const t  = Math.min(1, chord.strength / (maxStr * 0.72));
      const arch = ARCHETYPES[ai];

      const gradId = `chord-grad-${ci}`;
      const grad = defs.append("linearGradient").attr("id", gradId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", bx).attr("y1", by).attr("x2", ax).attr("y2", ay);
      grad.append("stop").attr("offset",   "0%").attr("stop-color", "#c9a96e").attr("stop-opacity", 0.22 + t * 0.38);
      grad.append("stop").attr("offset", "100%").attr("stop-color", arch.color).attr("stop-opacity", 0.22 + t * 0.5);

      const cpx = (bx + ax) / 2;
      const sw  = 0.4 + t * 3.0;
      const path = chordG.append("path")
        .attr("data-book", chord.book)
        .attr("data-arch", chord.arch)
        .attr("data-sw",   sw)
        .attr("d", `M${bx},${by} C${cpx},${by} ${cpx},${ay} ${ax},${ay}`)
        .attr("fill", "none")
        .attr("stroke", `url(#${gradId})`)
        .attr("stroke-width", sw)
        .attr("stroke-linecap", "round")
        .attr("opacity", 0.28 + t * 0.42);

      // Cinematic chord draw animation
      try {
        const totalLen = (path.node() as SVGPathElement).getTotalLength();
        path
          .attr("stroke-dasharray", `${totalLen} ${totalLen}`)
          .attr("stroke-dashoffset", totalLen)
          .transition()
          .delay(ci * 28 + 100)
          .duration(1000)
          .ease(d3.easeCubicOut)
          .attr("stroke-dashoffset", 0)
          .on("end", function() {
            d3.select(this).attr("stroke-dasharray", null).attr("stroke-dashoffset", null);
          });
      } catch {}
    });

    // Book nodes (left column)
    const bookG = svg.append("g").attr("class", "book-nodes");
    bookNodes.forEach((bn, i) => {
      const x  = bookX, y = bookY(i);
      const r  = 3.5 + Math.min(9, bn.count * 1.1);
      const g  = bookG.append("g")
        .attr("data-book-id", bn.id)
        .attr("transform", `translate(${x},${y})`)
        .style("cursor", "pointer");

      g.append("circle").attr("r", r * 3.2).attr("fill", "#c9a96e").attr("opacity", 0.025).attr("filter", "url(#bam-lg)");
      g.append("circle").attr("r", r * 1.5).attr("fill", "#c9a96e").attr("opacity", 0.07).attr("filter", "url(#bam-md)");
      g.append("circle").attr("r", r).attr("fill", "#c9a96e").attr("opacity", 0.82).attr("filter", "url(#bam-sm)");
      g.append("circle").attr("r", r * 0.3).attr("fill", "white").attr("opacity", 0.75);

      // Label
      g.append("text").attr("x", r + 8).attr("dy", "0.35em")
        .attr("font-family", "Georgia, serif").attr("font-style", "italic")
        .attr("font-size", bookNodes.length > 10 ? "0.62rem" : "0.7rem")
        .attr("fill", "#c9a96e").attr("opacity", 0.9)
        .text(bn.book);
      g.append("text").attr("x", r + 8).attr("dy", "1.6em")
        .attr("font-family", "Georgia, serif").attr("font-size", "0.55rem")
        .attr("fill", "#8a857c")
        .text(`${bn.count}×`);
    });

    // Archetype nodes (right column)
    const archGroup = svg.append("g").attr("class", "arch-nodes");
    ARCHETYPES.forEach((a, i) => {
      const x = archX, y = archY(i);
      const r = 13;
      const g = archGroup.append("g")
        .attr("data-arch", a.key)
        .attr("transform", `translate(${x},${y})`);

      g.append("circle").attr("r", r * 4).attr("fill", a.color).attr("opacity", 0.02).attr("filter", "url(#bam-lg)");
      g.append("circle").attr("r", r * 2).attr("fill", a.color).attr("opacity", 0.06).attr("filter", "url(#bam-md)");
      g.append("circle").attr("r", r).attr("fill", a.color).attr("opacity", 0.78).attr("filter", "url(#bam-sm)");
      g.append("circle").attr("r", r * 0.28).attr("fill", "white").attr("opacity", 0.65);

      // Label (right side)
      g.append("text").attr("x", -(r + 9)).attr("dy", "0.35em").attr("text-anchor", "end")
        .attr("font-family", "Georgia, serif").attr("font-style", "italic")
        .attr("font-size", "0.82rem").attr("fill", a.color).attr("filter", "url(#bam-xs)")
        .text(a.label);
    });

    // ── Hover highlighting (pure D3, no React state) ──────────
    const highlight = (bookId: string | null, archKey: string | null) => {
      const none = !bookId && !archKey;
      chordG.selectAll<SVGPathElement, unknown>("path").each(function() {
        const el  = d3.select(this);
        const b   = el.attr("data-book");
        const a   = el.attr("data-arch");
        const sw  = parseFloat(el.attr("data-sw") || "1");
        const hit = none || (bookId && b === bookId) || (archKey && a === archKey);
        el.transition().duration(180)
          .attr("opacity", none ? (0.28 + sw * 0.12) : hit ? 0.88 : 0.025)
          .attr("stroke-width", none ? sw : hit ? sw * 2.0 : sw * 0.4);
      });
      bookG.selectAll<SVGGElement, unknown>("g[data-book-id]").each(function() {
        const el  = d3.select(this);
        const id  = el.attr("data-book-id");
        const con = !archKey || chords.some(c => c.book === id && c.arch === archKey);
        el.transition().duration(180)
          .attr("opacity", none ? 1 : (bookId === id || con) ? 1 : 0.12);
      });
      archGroup.selectAll<SVGGElement, unknown>("g[data-arch]").each(function() {
        const el  = d3.select(this);
        const k   = el.attr("data-arch");
        const con = !bookId || chords.some(c => c.book === bookId && c.arch === k);
        el.transition().duration(180)
          .attr("opacity", none ? 1 : (archKey === k || con) ? 1 : 0.12);
      });
    };

    // Book hit targets
    bookNodes.forEach((bn, i) => {
      const r = 3.5 + Math.min(9, bn.count * 1.1);
      svg.append("circle").attr("cx", bookX).attr("cy", bookY(i)).attr("r", r + 18)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseenter", () => highlight(bn.id, null))
        .on("mouseleave", () => highlight(null, null));
    });

    // Arch hit targets
    ARCHETYPES.forEach((a, i) => {
      svg.append("circle").attr("cx", archX).attr("cy", archY(i)).attr("r", 30)
        .attr("fill", "transparent")
        .on("mouseenter", () => highlight(null, a.key))
        .on("mouseleave", () => highlight(null, null));
    });

  }, [bookNodes, chords, dims]);

  const gold  = "#c9a96e";
  const muted = "#8a857c";

  if (loading) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: muted }}>
      Tracing the sacred resonances…
    </div>
  );
  if (error) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: muted }}>
      {error}
    </div>
  );
  if (!bookNodes.length) return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: muted }}>
      No data yet — run the semantic pipeline to generate biblical reference data.
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.125rem", color: "#e8e4dc", margin: 0 }}>
          Sacred Resonance Map
        </h2>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted }}>
          {bookNodes.length} books · {chords.length} resonances
        </span>
      </div>
      <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.72rem", color: muted, marginBottom: "0.875rem", lineHeight: 1.55 }}>
        Where the ancient texts resonate with the Jungian archetypes of the soul. Hover a book or archetype to illuminate its constellation.
      </p>

      <div ref={wrapRef} style={{ flex: 1, minHeight: 380, position: "relative", overflow: "hidden", borderRadius: 2, border: "1px solid rgba(201,169,110,0.07)" }}>
        <svg ref={svgRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.9rem", marginTop: "0.75rem", justifyContent: "center" }}>
        {ARCHETYPES.map(a => (
          <div key={a.key} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, boxShadow: `0 0 5px ${a.glow}` }} />
            <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.7rem", color: muted }}>{a.label}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: gold, boxShadow: "0 0 5px #e8c880" }} />
          <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.7rem", color: muted }}>Biblical text</span>
        </div>
      </div>
    </div>
  );
}
