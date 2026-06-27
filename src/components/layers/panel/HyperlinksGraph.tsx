"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/lib/supabase/useAuth";
import { createClient } from "@/lib/supabase/client";

type DualismSubject = { name: string; labels: string[]; count: number };
type Parallelism = { subject_name: string | null; label: string | null; interpretation: string | null; confidence: number };
type Data = { summary: any; dualism_subjects: DualismSubject[]; parallelism_sample: Parallelism[] };

const GOLD = "#c9a96e";
const DARK = "#1a0a0a";
const LIGHT = "#e8e4dc";

export default function HyperlinksGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const dataRef = useRef<Data | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const hoveredRef = useRef<DualismSubject | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<DualismSubject | null>(null);
  const [activeTab, setActiveTab] = useState<"dualisms" | "parallelisms">("dualisms");
  const { session, loading: authLoading } = useAuth();

  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  useEffect(() => {
    if (!session) return;
    const sb = createClient();
    sb.auth.getSession().then(({ data: { session: s } }) => {
      fetch("/api/semantic/crosslinks", {
        headers: s?.access_token ? { Authorization: `Bearer ${s.access_token}` } : {},
      })
        .then(r => r.json())
        .then(d => { if (!d.error) setData(d); else setError(d.error); })
        .catch(e => setError(e.message));
    });
  }, [session]);

  // Realtime
  useEffect(() => {
    if (!session) return;
    const sb = createClient();
    const ch = sb.channel("crosslink_updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "semantic_crosslinks" }, () => {
        sb.auth.getSession().then(({ data: { session: s } }) => {
          fetch("/api/semantic/crosslinks", {
            headers: s?.access_token ? { Authorization: `Bearer ${s.access_token}` } : {},
          })
            .then(r => r.json())
            .then(d => { if (!d.error) setData(d); });
        });
      })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [session]);

  // Canvas animation
  useEffect(() => {
    if (!data || !canvasRef.current || !wrapRef.current || activeTab !== "dualisms") return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const W = wrapRef.current.clientWidth;
    const H = wrapRef.current.clientHeight;
    canvas.width = W;
    canvas.height = H;

    const subjects = data.dualism_subjects.slice(0, 12);
    const maxCount = Math.max(...subjects.map(s => s.count), 1);

    // Place subjects in a circular arrangement
    const positions: { x: number; y: number; subject: DualismSubject }[] = subjects.map((s, i) => {
      const angle = (2 * Math.PI * i) / subjects.length - Math.PI / 2;
      const r = Math.min(W, H) * 0.3;
      return { x: W / 2 + r * Math.cos(angle), y: H / 2 + r * Math.sin(angle), subject: s };
    });

    // Build particles
    interface Particle { x: number; y: number; vx: number; vy: number; targetIdx: number; life: number; maxLife: number; sourceIdx: number; color: string; }
    const particles: Particle[] = [];
    particlesRef.current = particles;

    function spawnParticle() {
      if (positions.length < 2) return;
      const si = Math.floor(Math.random() * positions.length);
      let ti = Math.floor(Math.random() * positions.length);
      while (ti === si) ti = Math.floor(Math.random() * positions.length);
      const src = positions[si];
      const brightness = Math.random() * 0.4 + 0.3;
      particles.push({
        x: src.x + (Math.random() - 0.5) * 20,
        y: src.y + (Math.random() - 0.5) * 20,
        vx: 0, vy: 0,
        targetIdx: ti, sourceIdx: si,
        life: 0, maxLife: 80 + Math.random() * 60,
        color: `rgba(201,169,110,${brightness})`,
      });
    }

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "#0d0810");
      bg.addColorStop(1, "#030306");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Spawn particles
      if (frame % 3 === 0 && particles.length < 60) spawnParticle();
      frame++;

      // Connection arcs
      const hovSub = hoveredRef.current;
      if (hovSub) {
        const srcPos = positions.find(p => p.subject.name === hovSub.name);
        if (srcPos) {
          positions.forEach(tp => {
            if (tp.subject.name === hovSub.name) return;
            ctx.beginPath();
            const mx = (srcPos.x + tp.x) / 2;
            const my = (srcPos.y + tp.y) / 2 - 40;
            ctx.moveTo(srcPos.x, srcPos.y);
            ctx.quadraticCurveTo(mx, my, tp.x, tp.y);
            ctx.strokeStyle = "rgba(201,169,110,0.08)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        }
      }

      // Update + draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const target = positions[p.targetIdx];
        const dx = target.x - p.x, dy = target.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8 || p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        const speed = 1.5 + (dist / 100);
        p.vx += (dx / dist) * 0.4;
        p.vy += (dy / dist) * 0.4;
        p.vx *= 0.88; p.vy *= 0.88;
        p.x += p.vx; p.y += p.vy;
        p.life++;
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.8})`);
        ctx.fill();
      }

      // Subject nodes
      positions.forEach(({ x, y, subject }) => {
        const size = 6 + (subject.count / maxCount) * 18;
        const isHov = hoveredRef.current?.name === subject.name;

        // Glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, size * 2.5);
        grd.addColorStop(0, isHov ? "rgba(201,169,110,0.4)" : "rgba(201,169,110,0.15)");
        grd.addColorStop(1, "rgba(201,169,110,0)");
        ctx.beginPath();
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = isHov ? "rgba(201,169,110,0.4)" : "rgba(201,169,110,0.15)";
        ctx.fill();
        ctx.strokeStyle = isHov ? "rgba(201,169,110,0.9)" : "rgba(201,169,110,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = isHov ? LIGHT : "rgba(200,190,175,0.7)";
        ctx.font = `${isHov ? "italic " : "italic "}${isHov ? 11 : 9.5}px Georgia, serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // Wrap long names
        const name = subject.name.length > 16 ? subject.name.slice(0, 14) + "…" : subject.name;
        ctx.fillText(name, x, y + size + 12);
        if (isHov) {
          ctx.fillStyle = "rgba(201,169,110,0.6)";
          ctx.font = "9px Georgia, serif";
          ctx.fillText(`${subject.count} dualisms`, x, y + size + 24);
        }
      });

      // Center text
      ctx.fillStyle = "rgba(201,169,110,0.1)";
      ctx.font = "italic 11px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Tension Field", W / 2, H / 2);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    // Mouse interaction
    function onMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found: DualismSubject | null = null;
      for (const { x, y, subject } of positions) {
        const dx = mx - x, dy = my - y;
        const size = 6 + (subject.count / maxCount) * 18;
        if (Math.sqrt(dx * dx + dy * dy) < size + 12) { found = subject; break; }
      }
      setHovered(found);
    }
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [data, activeTab]);

  if (authLoading) return <div className="panel-loading">Summoning…</div>;
  if (!session) return (
    <div className="panel-empty" style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "1rem" }}>Author access required.</p>
      <a href="/login" style={{ color: "#c9a96e", fontStyle: "italic", fontSize: "0.875rem" }}>Enter the manuscript →</a>
    </div>
  );
  if (error) return <div className="panel-empty">{error}</div>;
  if (!data) return <div className="panel-loading">Mapping the tension field…</div>;

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <h2 className="panel-h2">Parallelisms & Dualisms</h2>
      <p className="panel-sub">
        {data.dualism_subjects.length} dualism subjects · {data.summary?.total || 0} crosslinks
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}>
        {(["dualisms", "parallelisms"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8rem",
            color: activeTab === tab ? GOLD : "#8a857c",
            background: "transparent", border: "none", cursor: "pointer",
            borderBottom: activeTab === tab ? `1px solid ${GOLD}` : "1px solid transparent",
            paddingBottom: "2px",
          }}>
            {tab === "dualisms" ? "Tension Field" : "Echo Threads"}
          </button>
        ))}
      </div>

      {activeTab === "dualisms" ? (
        <div ref={wrapRef} style={{ flex: 1, minHeight: "300px", position: "relative", borderRadius: "4px", overflow: "hidden" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", cursor: "crosshair" }} />
          {hovered && (
            <div style={{
              position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
              background: "rgba(10,10,10,0.9)", border: "1px solid rgba(201,169,110,0.25)",
              borderRadius: "3px", padding: "0.6rem 1rem", maxWidth: "300px", textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{ color: GOLD, fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: "0.3rem" }}>{hovered.name}</div>
              <div style={{ color: "#8a857c", fontSize: "0.75rem" }}>{hovered.labels.slice(0, 4).join(" · ")}</div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.parallelism_sample.slice(0, 20).map((p, i) => (
            <div key={i} style={{
              padding: "0.6rem 0.75rem",
              background: "rgba(201,169,110,0.03)",
              border: "1px solid rgba(201,169,110,0.1)",
              borderRadius: "2px",
            }}>
              {p.label && (
                <div style={{ color: GOLD, fontSize: "0.8rem", fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: "0.2rem" }}>
                  {p.label}
                </div>
              )}
              {p.interpretation && (
                <div style={{ color: "#8a857c", fontSize: "0.75rem", lineHeight: 1.5 }}>
                  {p.interpretation.slice(0, 180)}{p.interpretation.length > 180 ? "…" : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="legend" style={{ marginTop: "0.75rem" }}>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "rgba(201,169,110,0.4)", border: "1px solid rgba(201,169,110,0.6)" }} />
          <span>Dualism node</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: "#c9a96e", opacity: 0.6 }} />
          <span>Tension flow</span>
        </div>
      </div>
    </div>
  );
}
