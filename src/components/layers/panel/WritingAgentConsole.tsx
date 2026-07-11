"use client";
import { Component, useState, useRef, useEffect } from "react";
import { bus } from "@/core/runtimeEngine";

// ─── Error boundary ─────────────────────────────────────────────────────────

class SectionBoundary extends Component<
  { label: string; children: React.ReactNode },
  { err: string | null }
> {
  constructor(p: any) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(e: any) { return { err: String(e?.message || e) }; }
  componentDidUpdate(prev: any) {
    if (prev.label !== this.props.label) this.setState({ err: null });
  }
  render() {
    if (this.state.err) return (
      <div style={{ padding: "1.25rem", borderLeft: "2px solid #7a3535" }}>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem", color: "#c07070", margin: "0 0 0.75rem" }}>
          {this.props.label} error — {this.state.err}
        </p>
        <button
          onClick={() => this.setState({ err: null })}
          style={ghostBtn}
        >
          Retry
        </button>
      </div>
    );
    return this.props.children;
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GOLD   = "#c9a96e";
const MUTED  = "#8a857c";
const BODY   = "#e8e4dc";
const RED    = "#7a3535";
const GREEN  = "#4a7a5a";

const CHAPTERS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

// ─── Inline styles ───────────────────────────────────────────────────────────

const serif: React.CSSProperties = { fontFamily: "Georgia, serif" };

const ghostBtn: React.CSSProperties = {
  ...serif, fontStyle: "italic", fontSize: "0.8125rem",
  color: GOLD, background: "transparent",
  border: "1px solid rgba(201,169,110,0.3)", cursor: "pointer",
  padding: "0.3rem 0.85rem", transition: "all 220ms",
};

const primaryBtn: React.CSSProperties = {
  ...ghostBtn,
  background: "rgba(201,169,110,0.07)",
  border: "1px solid rgba(201,169,110,0.45)",
  boxShadow: "0 0 10px rgba(201,169,110,0.08)",
};

const disabledBtn: React.CSSProperties = {
  ...ghostBtn,
  color: "rgba(201,169,110,0.3)",
  border: "1px solid rgba(201,169,110,0.12)",
  cursor: "not-allowed",
};

const inputStyle: React.CSSProperties = {
  ...serif, fontSize: "0.875rem", color: BODY,
  background: "rgba(201,169,110,0.02)",
  border: "1px solid rgba(201,169,110,0.18)",
  padding: "0.55rem 0.75rem", outline: "none",
  width: "100%", boxSizing: "border-box",
  boxShadow: "inset 0 0 14px rgba(0,0,0,0.35)",
};

const selectStyle: React.CSSProperties = {
  ...serif, fontSize: "0.8125rem", color: MUTED,
  background: "rgba(0,0,0,0.5)",
  border: "1px solid rgba(201,169,110,0.25)",
  padding: "0.3rem 0.6rem", outline: "none", cursor: "pointer",
};

const goldRule: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid rgba(201,169,110,0.1)",
  margin: "1.25rem 0",
};

const responseBox: React.CSSProperties = {
  marginTop: "1rem", padding: "1rem 1.1rem",
  background: "linear-gradient(135deg, rgba(10,8,4,0.7), rgba(6,4,2,0.9))",
  borderLeft: `2px solid ${GOLD}`,
  boxShadow: "0 0 24px rgba(0,0,0,0.5), -2px 0 16px rgba(201,169,110,0.05)",
  ...serif, fontSize: "0.9375rem", color: BODY,
  lineHeight: 1.72, whiteSpace: "pre-wrap",
};

const sectionLabel: React.CSSProperties = {
  ...serif, fontSize: "0.6rem", letterSpacing: "0.16em",
  textTransform: "uppercase", color: MUTED, margin: "0 0 0.5rem",
};

const rowDivider: React.CSSProperties = {
  borderBottom: "1px solid rgba(201,169,110,0.07)",
};

// ─── Micro-components ────────────────────────────────────────────────────────

function Btn({
  onClick, disabled, children, variant = "primary",
}: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: "primary"|"ghost";
}) {
  const s = disabled ? disabledBtn : variant === "ghost" ? ghostBtn : primaryBtn;
  return (
    <button style={s} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

function Status({ text, ok }: { text: string; ok?: boolean | null }) {
  if (!text) return null;
  const color = ok === true ? GREEN : ok === false ? "#c07070" : MUTED;
  return (
    <p style={{ ...serif, fontStyle: "italic", fontSize: "0.8rem", color, margin: "0.5rem 0 0", lineHeight: 1.5 }}>
      {text}
    </p>
  );
}

function ErrBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div style={{ marginTop: "0.75rem", padding: "0.75rem 0.9rem", background: "rgba(80,20,20,0.22)", borderLeft: `2px solid ${RED}` }}>
      <p style={{ ...serif, fontSize: "0.875rem", color: "#c07070", margin: 0, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

function Collapsible({
  title, badge, open, onToggle, loading, children,
}: {
  title: string; badge?: number; open: boolean; onToggle: () => void; loading?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.25rem" }}>
      <button onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        width: "100%", background: "transparent", border: "none", cursor: "pointer",
        padding: "0.55rem 0",
        borderBottom: `1px solid rgba(201,169,110,${open ? "0.2" : "0.08"})`,
      }}>
        <span style={{ ...serif, fontStyle: "italic", fontSize: "0.875rem", color: open ? GOLD : MUTED }}>
          {title}
        </span>
        {badge !== undefined && badge > 0 && (
          <span style={{ ...serif, fontSize: "0.65rem", color: MUTED, opacity: 0.8 }}>({badge})</span>
        )}
        <span style={{ marginLeft: "auto", color: MUTED, fontSize: "0.6rem" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
          {loading
            ? <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem", margin: "0.5rem 0" }}>Loading…</p>
            : children}
        </div>
      )}
    </div>
  );
}

// ─── TAB: WRITE ──────────────────────────────────────────────────────────────

type Provider = "claude" | "gemini" | "groq";

function WriteTab() {
  const [provider, setProvider] = useState<Provider>("claude");
  const [prompt, setPrompt]     = useState("");
  const [response, setResponse] = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [usage, setUsage]       = useState<{ input?: number; output?: number } | null>(null);
  const imgRef = useRef<File | null>(null);
  const [imgName, setImgName]   = useState("");

  // Analyzer sub-section
  const [docResult, setDocResult] = useState<{ the_bad?: string; from_your_book?: string; your_response?: string } | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [docErr, setDocErr]       = useState("");
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const send = async () => {
    if (!prompt.trim() && !imgRef.current) return;
    setLoading(true); setResponse(""); setErr(""); setUsage(null);
    try {
      const body: any = { prompt, preferredProvider: provider };
      if (imgRef.current) {
        const b64 = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.readAsDataURL(imgRef.current!);
          reader.onload  = () => res((reader.result as string).split(",")[1]);
          reader.onerror = rej;
        });
        body.imageData = b64;
        body.mimeType  = imgRef.current.type;
        body.preferredProvider = "gemini";
      }
      const r = await fetch("/api/agent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
      if (!r.ok) { setErr(d?.error || `Error ${r.status}`); return; }
      setResponse(d?.response || d?.result || JSON.stringify(d));
      if (d?.usage) setUsage(d.usage);
    } catch (e: any) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  };

  const analyzeDoc = async (file: File) => {
    setDocLoading(true); setDocResult(null); setDocErr("");
    try {
      const b64 = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload  = () => res((reader.result as string).split(",")[1]);
        reader.onerror = rej;
      });
      const r = await fetch("/api/analyze-document", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: b64, mimeType: file.type }),
      });
      const d = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
      if (!r.ok) { setDocErr(d?.error || `Error ${r.status}`); return; }
      const a = d?.analysis;
      if (a?.the_bad || a?.from_your_book || a?.your_response) {
        setDocResult(a);
      } else {
        setDocErr("Analysis returned no structured result.");
      }
    } catch (e: any) { setDocErr(e?.message || String(e)); }
    finally { setDocLoading(false); }
  };

  return (
    <div>
      {/* Provider pills */}
      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.875rem" }}>
        {(["claude","gemini","groq"] as Provider[]).map(p => (
          <button
            key={p}
            onClick={() => setProvider(p)}
            style={{
              ...serif, fontStyle: "italic", fontSize: "0.8125rem",
              padding: "0.25rem 0.85rem",
              background: provider === p ? "rgba(201,169,110,0.1)" : "transparent",
              border: `1px solid ${provider === p ? "rgba(201,169,110,0.6)" : "rgba(201,169,110,0.2)"}`,
              color: provider === p ? GOLD : MUTED, cursor: "pointer",
              boxShadow: provider === p ? "0 0 12px rgba(201,169,110,0.12)" : "none",
              transition: "all 220ms",
            }}
          >
            {p === "claude" ? "Claude" : p === "gemini" ? "Gemini" : "Groq"}
          </button>
        ))}
        <span style={{ ...serif, fontStyle: "italic", fontSize: "0.72rem", color: MUTED, marginLeft: "auto", opacity: 0.8 }}>
          D-4.0 — sensation, not emotion
        </span>
      </div>

      {/* Image attach */}
      <label style={{ display: "block", ...serif, fontStyle: "italic", fontSize: "0.78rem", color: MUTED, marginBottom: imgName ? "0.25rem" : "0.6rem", cursor: "pointer" }}>
        + Attach image (auto-routes Gemini)
        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
          const f = e.target.files?.[0] ?? null;
          imgRef.current = f; setImgName(f?.name ?? "");
        }} />
      </label>
      {imgName && (
        <p style={{ ...serif, fontSize: "0.8rem", color: GOLD, margin: "0 0 0.5rem" }}>✓ {imgName}</p>
      )}

      {/* Prompt */}
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
        placeholder="Ask the swarm about the manuscript… (⌘↵ to send)"
        rows={4}
        style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65, marginBottom: "0.6rem" }}
      />
      <Btn onClick={send} disabled={loading || (!prompt.trim() && !imgRef.current)}>
        {loading ? "Thinking…" : "Send"}
      </Btn>

      <ErrBox text={err} />

      {response && (
        <>
          <div style={responseBox}>{response}</div>
          {usage && (
            <p style={{ ...serif, fontStyle: "italic", fontSize: "0.72rem", color: MUTED, marginTop: "0.35rem" }}>
              {usage.input ?? "—"} in · {usage.output ?? "—"} out tokens
            </p>
          )}
        </>
      )}

      {/* ── Document Analyzer sub-section ─────────────────────────────────── */}
      <hr style={goldRule} />
      <button
        onClick={() => setShowAnalyzer(v => !v)}
        style={{ ...serif, fontStyle: "italic", fontSize: "0.8125rem", color: showAnalyzer ? GOLD : MUTED, background: "transparent", border: "none", cursor: "pointer", padding: "0", marginBottom: showAnalyzer ? "0.75rem" : "0" }}
      >
        {showAnalyzer ? "▲" : "▼"} Analyze a document
      </button>

      {showAnalyzer && (
        <div style={{ marginTop: "0.65rem" }}>
          <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.8125rem", margin: "0 0 0.6rem", lineHeight: 1.55 }}>
            Upload any .txt, .pdf, or image to compare against the manuscript.
          </p>
          <input
            type="file" accept=".txt,.pdf,.png,.jpg,.jpeg,.webp"
            disabled={docLoading}
            style={{ display: "block", ...serif, fontSize: "0.8125rem", color: MUTED, marginBottom: "0.5rem" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) analyzeDoc(f); }}
          />
          {docLoading && (
            <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem" }}>Analyzing…</p>
          )}
          <ErrBox text={docErr} />
          {docResult && (
            <div style={{ marginTop: "0.75rem" }}>
              {(["the_bad", "from_your_book", "your_response"] as const)
                .filter(k => !!docResult[k])
                .map((key, ki) => (
                  <div key={key} style={{
                    marginBottom: "1rem", padding: "0.875rem 1rem",
                    background: "rgba(10,8,4,0.5)", borderLeft: `2px solid ${GOLD}`,
                    animation: `fadeIn 0.35s ease ${ki * 0.1}s both`,
                  }}>
                    <p style={{ ...sectionLabel, marginBottom: "0.35rem" }}>
                      {key === "the_bad" ? "The Bad" : key === "from_your_book" ? "From Your Book" : "Your Response"}
                    </p>
                    <p style={{ ...serif, fontSize: "0.9375rem", color: BODY, margin: 0, lineHeight: 1.65 }}>
                      {docResult[key]}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB: MANUSCRIPT ─────────────────────────────────────────────────────────

function ManuscriptTab() {
  const [bufferFiles, setBufferFiles]       = useState<any[]>([]);
  const [bufferLoading, setBufLoading]      = useState(false);
  const [bufferSearch, setBufSearch]        = useState("");
  const [selected, setSelected]             = useState<Set<string>>(new Set());
  const [targetChapter, setTargetChapter]   = useState(1);
  const [stageLoading, setStageLoading]     = useState(false);
  const [stageStatus, setStageStatus]       = useState("");
  const [stageOk, setStageOk]               = useState<boolean | null>(null);

  const [versChapter, setVersChapter]       = useState(1);
  const [versionGroups, setVersionGroups]   = useState<any[]>([]);
  const [versLoading, setVersLoading]       = useState(false);
  const [versStatus, setVersStatus]         = useState("");
  const [versOk, setVersOk]                 = useState<boolean | null>(null);

  const [section, setSection]               = useState<"buffer"|"versions">("buffer");

  const loadBuffer = async () => {
    setBufLoading(true);
    try {
      const r = await fetch("/api/ingestion-buffer");
      const d = await r.json().catch(() => ({ files: [] }));
      setBufferFiles(Array.isArray(d?.files) ? d.files : []);
    } catch { setBufferFiles([]); }
    finally { setBufLoading(false); }
  };

  useEffect(() => { loadBuffer(); }, []);

  const toggle = (id: string) => setSelected(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const stage = async () => {
    if (selected.size === 0) return;
    setStageLoading(true); setStageStatus(""); setStageOk(null);
    const results: string[] = [];
    for (const id of selected) {
      const file = bufferFiles.find(f => f.id === id);
      if (!file) continue;
      const filename = file.filename || file.name || file.id;
      try {
        const r = await fetch("/api/manuscript/stage", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename, chapterNumber: targetChapter }),
        });
        const d = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
        if (!r.ok) { results.push(`${file.name}: ${d?.error || "failed"}`); }
        else if (d?.mode === "preview_only") { results.push(`${file.name}: parsed ${d.staged} ¶ (Supabase not configured — not saved)`); }
        else { results.push(`${file.name}: ${d?.staged ?? "?"} ¶ staged → Ch ${targetChapter} ✓`); }
      } catch (e: any) { results.push(`${file.name}: ${e?.message || String(e)}`); }
    }
    const anyOk = results.some(r => r.includes("✓"));
    setStageStatus(results.join(" · "));
    setStageOk(anyOk ? (results.every(r => r.includes("✓")) ? true : null) : false);
    if (anyOk) {
      bus.emit("chapter:set", { chapterNumber: targetChapter, source: "db" });
      if (results.every(r => r.includes("✓"))) setSelected(new Set());
    }
    setStageLoading(false);
  };

  const loadVersions = async () => {
    setVersLoading(true); setVersionGroups([]); setVersStatus(""); setVersOk(null);
    try {
      const r = await fetch(`/api/manuscript?chapterNumber=${versChapter}`);
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setVersStatus(d?.error || `Error ${r.status}`); setVersOk(false); return; }
      const paras: any[] = Array.isArray(d) ? d : (d?.paragraphs ?? []);
      if (paras.length === 0) {
        setVersStatus(`No paragraphs for chapter ${versChapter}.`); setVersOk(null); return;
      }
      const grouped: Record<string, any[]> = {};
      for (const p of paras) {
        const key = p.chapter_version || p.source_doc || "active";
        (grouped[key] = grouped[key] || []).push(p);
      }
      setVersionGroups(Object.entries(grouped).map(([v, items]) => ({
        version: v, count: items.length,
        preview: (items[0]?.content || items[0]?.text || "").slice(0, 130),
      })));
      setVersStatus(`${paras.length} ¶ · ${Object.keys(grouped).length} version(s)`);
      setVersOk(true);
    } catch (e: any) { setVersStatus(e?.message || String(e)); setVersOk(false); }
    finally { setVersLoading(false); }
  };

  const promote = async (version_tag: string) => {
    try {
      const r = await fetch(`/api/chapters/${versChapter}/promote`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_number: versChapter, version_tag }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setVersStatus(d?.error || "Promote failed"); setVersOk(false); }
      else {
        setVersStatus(`Promoted ${d?.promoted_count ?? "?"} paragraphs.`);
        setVersOk(true);
        bus.emit("chapter:set", { chapterNumber: versChapter, source: "db" });
      }
    } catch (e: any) { setVersStatus(e?.message || String(e)); setVersOk(false); }
  };

  const filtered = bufferFiles.filter(f =>
    !bufferSearch || (f.name ?? f.id ?? "").toLowerCase().includes(bufferSearch.toLowerCase())
  );

  return (
    <div>
      {/* Sub-nav */}
      <div style={{ display: "flex", gap: "0", marginBottom: "1rem", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        {(["buffer","versions"] as const).map(s => (
          <button key={s} onClick={() => setSection(s)} style={{
            ...serif, fontStyle: "italic", fontSize: "0.8rem",
            padding: "0.4rem 0.85rem", background: "transparent", border: "none",
            color: section === s ? GOLD : MUTED, cursor: "pointer",
            borderBottom: `2px solid ${section === s ? GOLD : "transparent"}`,
            transition: "color 180ms, border-color 180ms",
          }}>
            {s === "buffer" ? `Buffer${bufferFiles.length ? ` (${bufferFiles.length})` : ""}` : "Versions"}
          </button>
        ))}
      </div>

      {/* BUFFER */}
      {section === "buffer" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.75rem" }}>
            <Btn onClick={loadBuffer} disabled={bufferLoading} variant="ghost">
              {bufferLoading ? "Loading…" : "Refresh"}
            </Btn>
            {selected.size > 0 && (
              <span style={{ ...serif, fontStyle: "italic", fontSize: "0.8rem", color: MUTED }}>
                {selected.size} selected
              </span>
            )}
          </div>

          {bufferFiles.length > 0 && (
            <>
              <input
                type="text" placeholder="Filter…" value={bufferSearch}
                onChange={e => setBufSearch(e.target.value)}
                style={{ ...inputStyle, marginBottom: "0.5rem", fontSize: "0.8125rem" }}
              />
              <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: "0.75rem" }}>
                {filtered.map((f, i) => (
                  <label key={f.id || i} style={{
                    display: "flex", alignItems: "center", gap: "0.6rem",
                    padding: "0.3rem 0.5rem", cursor: "pointer",
                    background: selected.has(f.id) ? "rgba(201,169,110,0.05)" : "transparent",
                    borderLeft: `2px solid ${selected.has(f.id) ? "rgba(201,169,110,0.45)" : "transparent"}`,
                    transition: "all 100ms",
                  }}>
                    <input
                      type="checkbox"
                      checked={selected.has(f.id)}
                      onChange={() => toggle(f.id)}
                      style={{ accentColor: GOLD, flexShrink: 0 }}
                    />
                    <span style={{ ...serif, fontSize: "0.8125rem", color: selected.has(f.id) ? GOLD : BODY, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.name ?? f.id}
                    </span>
                    <span style={{ ...serif, fontSize: "0.65rem", color: MUTED, flexShrink: 0 }}>{f.status}</span>
                  </label>
                ))}
                {filtered.length === 0 && bufferSearch && (
                  <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem", padding: "0.5rem" }}>No matches.</p>
                )}
              </div>

              {selected.size > 0 && (
                <div style={{ padding: "0.65rem 0.8rem", background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.12)", marginBottom: "0.65rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                    <span style={{ ...serif, fontStyle: "italic", fontSize: "0.8rem", color: MUTED }}>
                      Stage as Chapter
                    </span>
                    <select value={targetChapter} onChange={e => setTargetChapter(Number(e.target.value))} style={selectStyle}>
                      {CHAPTERS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <Btn onClick={stage} disabled={stageLoading}>
                      {stageLoading ? "Staging…" : "Stage prose"}
                    </Btn>
                    <button onClick={() => setSelected(new Set())} style={{ ...serif, fontSize: "0.75rem", color: MUTED, background: "transparent", border: "none", cursor: "pointer" }}>
                      Clear
                    </button>
                  </div>
                </div>
              )}
              <Status text={stageStatus} ok={stageOk} />
            </>
          )}
          {bufferFiles.length === 0 && !bufferLoading && (
            <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem" }}>
              Buffer is empty or Drive hasn't synced yet.
            </p>
          )}
        </div>
      )}

      {/* VERSIONS */}
      {section === "versions" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
            <span style={{ ...serif, fontSize: "0.75rem", color: MUTED }}>Chapter</span>
            <select value={versChapter} onChange={e => setVersChapter(Number(e.target.value))} style={selectStyle}>
              {CHAPTERS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <Btn onClick={loadVersions} disabled={versLoading} variant="ghost">
              {versLoading ? "Loading…" : "Load Versions"}
            </Btn>
          </div>
          <Status text={versStatus} ok={versOk} />

          {versionGroups.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              {versionGroups.map((v, i) => (
                <div key={i} style={{ padding: "0.65rem 0", ...rowDivider }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ ...serif, fontSize: "0.8125rem", color: GOLD, flex: 1 }}>
                      {v.version}
                      <span style={{ color: MUTED, fontStyle: "italic", fontSize: "0.7rem", marginLeft: "0.35rem" }}>({v.count} ¶)</span>
                    </span>
                    <Btn variant="ghost" onClick={() => {
                      bus.emit("chapter:set", { chapterNumber: versChapter, source: "db" });
                      setVersStatus(`Loading chapter ${versChapter} in reader…`);
                      setVersOk(null);
                    }}>Load</Btn>
                    <Btn onClick={() => promote(v.version)}>Promote</Btn>
                  </div>
                  {v.preview && (
                    <p style={{ ...serif, fontSize: "0.78rem", color: MUTED, fontStyle: "italic", margin: "0.35rem 0 0", padding: "0.35rem 0.6rem", borderLeft: "2px solid rgba(201,169,110,0.2)", lineHeight: 1.5 }}>
                      {v.preview}{v.preview.length >= 130 ? "…" : ""}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {versionGroups.length === 0 && !versLoading && !versStatus && (
            <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Select a chapter and click Load Versions.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB: SEMANTIC ───────────────────────────────────────────────────────────

function SemanticTab() {
  const [chapter, setChapter]             = useState(7);
  const [bibRows, setBibRows]             = useState<any[]>([]);
  const [archRows, setArchRows]           = useState<any[]>([]);
  const [crossRows, setCrossRows]         = useState<any[]>([]);
  const [loading, setLoading]             = useState(false);
  const [status, setStatus]               = useState("");
  const [ok, setOk]                       = useState<boolean | null>(null);
  const [reannLoading, setReannLoading]   = useState(false);
  const [open, setOpen]                   = useState<"bib"|"arch"|"cross"|null>("bib");

  const load = async () => {
    setLoading(true); setStatus(""); setOk(null);
    setBibRows([]); setArchRows([]); setCrossRows([]);
    try {
      const [bibR, graphR] = await Promise.all([
        fetch("/api/biblical-references"),
        fetch("/api/graph"),
      ]);
      const bib   = await bibR.json().catch(() => ({}));
      const graph = graphR.ok ? await graphR.json().catch(() => ({})) : {};

      if (bib?.error?.includes("not configured") || graph?.error?.includes("not configured")) {
        setStatus("Supabase not configured — add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Vercel env vars");
        setOk(false); return;
      }
      const refs  = Array.isArray(bib) ? bib : (bib?.references ?? []);
      const archs = graph?.archetypes ?? [];
      const cross = graph?.crosslinks ?? [];
      setBibRows(refs); setArchRows(archs); setCrossRows(cross);

      const total = refs.length + archs.length + cross.length;
      if (total === 0) {
        setStatus("No semantic data found. Run the semantic pipeline to populate.");
        setOk(null);
      } else {
        setStatus(`${refs.length} biblical · ${archs.length} archetypes · ${cross.length} crosslinks`);
        setOk(true);
      }
    } catch (e: any) { setStatus(e?.message || String(e)); setOk(false); }
    finally { setLoading(false); }
  };

  const reannotate = async () => {
    setReannLoading(true); setStatus(""); setOk(null);
    try {
      const r = await fetch("/api/reannotate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_number: chapter }),
      });
      const d = await r.json().catch(() => ({}));
      setStatus(r.ok ? (d?.message || `Dispatched annotation for chapter ${chapter}.`) : (d?.error || `Error ${r.status}`));
      setOk(r.ok);
    } catch (e: any) { setStatus(e?.message || String(e)); setOk(false); }
    finally { setReannLoading(false); }
  };

  const toggleVis = async (row: any, table: string) => {
    const newVis = row.visible_to_reader === false;
    try {
      await fetch("/api/semantic/visibility", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id: row.id, visible_to_reader: newVis }),
      });
      const upd = (rows: any[]) => rows.map(r => r.id === row.id ? { ...r, visible_to_reader: newVis } : r);
      setBibRows(upd); setArchRows(upd); setCrossRows(upd);
    } catch (e: any) { setStatus(`Toggle failed: ${e?.message || String(e)}`); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
        <span style={{ ...serif, fontSize: "0.75rem", color: MUTED }}>Chapter</span>
        <select value={chapter} onChange={e => setChapter(Number(e.target.value))} style={selectStyle}>
          {CHAPTERS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <Btn onClick={load} disabled={loading}>{loading ? "Loading…" : "Load"}</Btn>
        <Btn onClick={reannotate} disabled={reannLoading} variant="ghost">
          {reannLoading ? "Dispatching…" : "Re-annotate"}
        </Btn>
      </div>
      <Status text={status} ok={ok} />

      <div style={{ marginTop: "0.875rem" }}>
        <Collapsible
          title="Biblical References" badge={bibRows.length}
          open={open === "bib"} onToggle={() => setOpen(s => s === "bib" ? null : "bib")}
          loading={loading}
        >
          {bibRows.length === 0
            ? <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem", margin: "0.5rem 0" }}>None — click Load.</p>
            : bibRows.map((row, i) => (
              <div key={row.id ?? i} style={{ padding: "0.45rem 0", ...rowDivider }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ ...serif, fontSize: "0.8125rem", color: GOLD }}>
                    {row.book} {row.chapter}:{row.verse}{row.verse_end && row.verse_end !== row.verse ? `–${row.verse_end}` : ""}
                  </span>
                  <span style={{ ...serif, fontSize: "0.65rem", color: MUTED, fontStyle: "italic" }}>{row.motif_family}</span>
                </div>
                {row.reference_text && (
                  <p style={{ ...serif, fontSize: "0.875rem", color: BODY, margin: "0.12rem 0 0", lineHeight: 1.5, opacity: 0.88 }}>
                    {row.reference_text}
                  </p>
                )}
              </div>
            ))}
        </Collapsible>

        <Collapsible
          title="Archetypes" badge={archRows.length}
          open={open === "arch"} onToggle={() => setOpen(s => s === "arch" ? null : "arch")}
          loading={loading}
        >
          {archRows.length === 0
            ? <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem", margin: "0.5rem 0" }}>None — click Load.</p>
            : archRows.map((row, i) => (
              <div key={row.id ?? i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem 0", ...rowDivider }}>
                <span style={{ ...serif, fontSize: "0.875rem", color: GOLD, flex: 1 }}>
                  {row.label || row.canonical_label}
                </span>
                <span style={{ ...serif, fontSize: "0.7rem", color: MUTED, fontStyle: "italic" }}>
                  {row.family || row.ontology_family}
                </span>
                <button
                  onClick={() => toggleVis(row, "semantic_archetype_anchors")}
                  style={{
                    ...serif, fontSize: "0.7rem", padding: "0.12rem 0.5rem",
                    cursor: "pointer", background: "transparent",
                    border: `1px solid ${row.visible_to_reader === false ? RED : "rgba(201,169,110,0.25)"}`,
                    color: row.visible_to_reader === false ? "#c07070" : MUTED,
                    transition: "all 180ms",
                  }}
                >
                  {row.visible_to_reader === false ? "Hidden" : "Visible"}
                </button>
              </div>
            ))}
        </Collapsible>

        <Collapsible
          title="Crosslinks & Dualisms" badge={crossRows.length}
          open={open === "cross"} onToggle={() => setOpen(s => s === "cross" ? null : "cross")}
          loading={loading}
        >
          {crossRows.length === 0
            ? <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.875rem", margin: "0.5rem 0" }}>None — click Load.</p>
            : crossRows.map((row, i) => (
              <div key={row.id ?? i} style={{ padding: "0.4rem 0", ...rowDivider }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ ...serif, fontSize: "0.7rem", color: MUTED }}>
                    {row.link_type === "parallelism" ? "↔" : "↕"}
                  </span>
                  <span style={{ ...serif, fontSize: "0.8125rem", color: GOLD }}>
                    {row.relation_type || row.relation_family}
                  </span>
                  <span style={{ ...serif, fontSize: "0.65rem", color: MUTED }}>
                    {row.left_family} → {row.right_family}
                  </span>
                </div>
                {row.evidence_text && (
                  <p style={{ ...serif, fontSize: "0.78rem", color: BODY, fontStyle: "italic", margin: "0.12rem 0 0", opacity: 0.72, lineHeight: 1.5 }}>
                    {row.evidence_text.slice(0, 110)}{row.evidence_text.length > 110 ? "…" : ""}
                  </p>
                )}
              </div>
            ))}
        </Collapsible>
      </div>
    </div>
  );
}

// ─── TAB: CINEMA ─────────────────────────────────────────────────────────────

function CinemaTab() {
  const [url, setUrl]                       = useState("");
  const [chapter, setChapter]               = useState(1);
  const [status, setStatus]                 = useState("");
  const [ok, setOk]                         = useState<boolean | null>(null);
  const [assignments, setAssignments]       = useState<Record<number, string>>({});
  const [localAssets, setLocalAssets]       = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/assets/chapter-bg").then(r => r.json()).catch(() => ({})),
      fetch("/api/assets/list").then(r => r.json()).catch(() => ({})),
    ]).then(([ad, ld]) => {
      setAssignments(ad?.assignments ?? {});
      setLocalAssets(ld?.assets ?? []);
    });
  }, []);

  const assign = async () => {
    const u = url.trim();
    if (!u) return;
    setStatus(""); setOk(null);
    try {
      const r = await fetch("/api/assets/chapter-bg", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterNumber: chapter, url: u }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setStatus(d?.error || "Failed"); setOk(false); return; }
      setStatus(`Chapter ${chapter} background set.`);
      setOk(true);
      setAssignments(prev => ({ ...prev, [chapter]: u }));
      bus.emit("cinema:set-bg", { chapterNumber: chapter, url: u });
    } catch (e: any) { setStatus(e?.message || String(e)); setOk(false); }
  };

  const clear = async (ch: number) => {
    try {
      await fetch("/api/assets/chapter-bg", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterNumber: ch, url: "" }),
      });
      setAssignments(prev => { const n = { ...prev }; delete n[ch]; return n; });
      bus.emit("cinema:set-bg", { chapterNumber: ch, url: "" });
    } catch {}
  };

  return (
    <div>
      <p style={{ ...sectionLabel, marginBottom: "0.875rem" }}>Layer 2 Background Images</p>

      {/* Local asset gallery */}
      {localAssets.length > 0 && (
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ ...sectionLabel, marginBottom: "0.5rem" }}>Your Assets — click to select</p>
          <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
            {localAssets.map(src => (
              <button
                key={src}
                onClick={() => setUrl(src)}
                title={src.split("/").pop()}
                style={{
                  width: 68, height: 68, padding: 0, cursor: "pointer", overflow: "hidden",
                  border: url === src ? `2px solid ${GOLD}` : "2px solid rgba(201,169,110,0.12)",
                  background: "transparent", flexShrink: 0,
                  transition: "border-color 160ms",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* URL input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.875rem" }}>
        <input
          type="url" value={url} onChange={e => setUrl(e.target.value)}
          placeholder="URL or select asset above…"
          style={inputStyle}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span style={{ ...serif, fontSize: "0.75rem", color: MUTED }}>Chapter</span>
          <select value={chapter} onChange={e => setChapter(Number(e.target.value))} style={selectStyle}>
            {CHAPTERS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <Btn onClick={assign} disabled={!url.trim()}>Set Background</Btn>
        </div>
      </div>
      <Status text={status} ok={ok} />

      {/* Current assignments */}
      {Object.keys(assignments).length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ ...sectionLabel, marginBottom: "0.5rem" }}>Current Assignments</p>
          {Object.entries(assignments)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([ch, u]) => (
              <div key={ch} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem 0", ...rowDivider, flexWrap: "wrap" }}>
                <span style={{ ...serif, fontSize: "0.8125rem", color: GOLD, minWidth: "4rem" }}>Ch {ch}</span>
                <span style={{ ...serif, fontSize: "0.75rem", color: MUTED, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {u.startsWith("/api/") ? "[Drive proxy]" : u.length > 44 ? u.slice(0, 44) + "…" : u}
                </span>
                <button
                  onClick={() => clear(Number(ch))}
                  style={{ ...serif, fontSize: "0.72rem", color: MUTED, background: "transparent", border: "1px solid rgba(138,133,124,0.2)", cursor: "pointer", padding: "0.12rem 0.5rem", transition: "all 160ms" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#c07070"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTED; }}
                >
                  Clear
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── TAB: SYSTEM ─────────────────────────────────────────────────────────────

function SystemTab() {
  const [syncLoading, setSyncLoading]     = useState(false);
  const [syncStatus, setSyncStatus]       = useState("");
  const [syncOk, setSyncOk]               = useState<boolean | null>(null);
  const [envData, setEnvData]             = useState<any>(null);
  const [envLoading, setEnvLoading]       = useState(false);

  const syncDrive = async () => {
    setSyncLoading(true); setSyncStatus(""); setSyncOk(null);
    try {
      const r = await fetch("/api/sync/drive", { method: "POST" });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setSyncStatus(d?.error || `Error ${r.status}`); setSyncOk(false); return; }
      setSyncStatus(`Synced ${d?.synced?.length ?? 0} files. Errors: ${d?.errors?.length ?? 0}.`);
      setSyncOk(true);
    } catch (e: any) { setSyncStatus(e?.message || String(e)); setSyncOk(false); }
    finally { setSyncLoading(false); }
  };

  const checkEnv = async () => {
    setEnvLoading(true);
    try {
      const r = await fetch("/api/debug/env");
      const d = await r.json().catch(() => null);
      setEnvData(d ?? { error: `HTTP ${r.status}` });
    } catch (e: any) { setEnvData({ error: e?.message || String(e) }); }
    finally { setEnvLoading(false); }
  };

  return (
    <div>
      <p style={{ ...sectionLabel, marginBottom: "1rem" }}>Google Drive Sync</p>
      <p style={{ ...serif, fontStyle: "italic", color: MUTED, fontSize: "0.8125rem", margin: "0 0 0.875rem", lineHeight: 1.6 }}>
        Requires <code style={{ color: GOLD }}>GOOGLE_CLIENT_ID</code>, <code style={{ color: GOLD }}>GOOGLE_CLIENT_SECRET</code>, and{" "}
        <code style={{ color: GOLD }}>GOOGLE_REFRESH_TOKEN</code> in Vercel → Project Settings → Environment Variables.
      </p>
      <Btn onClick={syncDrive} disabled={syncLoading}>{syncLoading ? "Syncing…" : "Sync Drive"}</Btn>
      <Status text={syncStatus} ok={syncOk} />

      <hr style={goldRule} />

      <p style={{ ...sectionLabel, marginBottom: "0.75rem" }}>Environment Diagnostics</p>
      <Btn onClick={checkEnv} disabled={envLoading} variant="ghost">
        {envLoading ? "Checking…" : "Check env vars"}
      </Btn>

      {envData && (
        <div style={{ marginTop: "0.875rem", ...serif, fontSize: "0.8125rem", lineHeight: 1.7 }}>
          {envData.error ? (
            <p style={{ color: "#c07070", fontStyle: "italic" }}>{envData.error}</p>
          ) : (
            Object.entries(envData).map(([group, vars]: [string, any]) => (
              <div key={group} style={{ marginBottom: "0.875rem" }}>
                <p style={{ ...sectionLabel, marginBottom: "0.35rem" }}>{group}</p>
                {Object.entries(vars).map(([name, info]: [string, any]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "0.2rem 0", ...rowDivider }}>
                    <span style={{ color: MUTED }}>{name}</span>
                    <span style={{ color: info?.set ? GREEN : RED, fontStyle: "italic" }}>
                      {info?.set ? `set (${info.length} chars)` : "missing"}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

type Tab = "write" | "manuscript" | "semantic" | "cinema" | "system";

const TAB_LABELS: Record<Tab, string> = {
  write:      "Write",
  manuscript: "Manuscript",
  semantic:   "Semantic",
  cinema:     "Cinema",
  system:     "System",
};

export default function WritingAgentConsole() {
  const [activeTab, setActiveTab] = useState<Tab>("write");

  return (
    <div style={{ fontSize: "0.875rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ ...serif, fontStyle: "italic", color: GOLD, fontSize: "0.875rem", margin: 0, opacity: 0.9 }}>
          Operator Active
        </p>
        <button
          onClick={() => bus.emit("panel:open", { tabId: "HYPERLINKS" })}
          style={{ ...serif, fontStyle: "italic", fontSize: "0.72rem", color: "rgba(201,169,110,0.55)", background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.15)", padding: "0.18rem 0.6rem", cursor: "pointer", transition: "all 200ms" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = GOLD; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(201,169,110,0.55)"; }}
        >
          ⬡ Graph
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.1)", marginBottom: "1.25rem" }}>
        {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              ...serif, fontStyle: "italic", fontSize: "0.8rem",
              padding: "0.45rem 0.8rem", background: "transparent", border: "none",
              color: activeTab === t ? GOLD : MUTED, cursor: "pointer",
              borderBottom: `2px solid ${activeTab === t ? GOLD : "transparent"}`,
              transition: "color 180ms, border-color 180ms",
            }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Tab content — each section isolated in its own error boundary */}
      <SectionBoundary label={TAB_LABELS[activeTab]}>
        {activeTab === "write"      && <WriteTab />}
        {activeTab === "manuscript" && <ManuscriptTab />}
        {activeTab === "semantic"   && <SemanticTab />}
        {activeTab === "cinema"     && <CinemaTab />}
        {activeTab === "system"     && <SystemTab />}
      </SectionBoundary>

    </div>
  );
}
