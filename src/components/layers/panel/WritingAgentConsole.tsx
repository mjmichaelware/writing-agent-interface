"use client";
import { useState, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

const gold   = "#c9a96e";
const muted  = "#8a857c";
const body   = "#e8e4dc";
const danger = "#7a3535";
const green  = "#4a7a5a";

type Tab      = "agent" | "analyzer" | "buffer" | "drive" | "semantic" | "versions";
type Provider = "claude" | "gemini" | "groq";

// ─── Shared micro-components ───────────────────────────────────────────────

function GoldBtn({
  onClick, disabled, children, variant = "primary",
}: {
  onClick: () => void; disabled?: boolean; children: React.ReactNode; variant?: "primary" | "ghost";
}) {
  const base: React.CSSProperties = {
    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem",
    padding: "0.4rem 1.25rem", cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap", transition: "all 250ms cubic-bezier(0.22,1,0.36,1)",
    border: `1px solid ${disabled ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.45)"}`,
    color: disabled ? "rgba(201,169,110,0.35)" : gold,
    background: variant === "primary" ? "rgba(201,169,110,0.06)" : "transparent",
    boxShadow: disabled ? "none" : "0 0 10px rgba(201,169,110,0.08)",
  };
  return (
    <button style={base} disabled={disabled} onClick={onClick}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(201,169,110,0.25)"; }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 10px rgba(201,169,110,0.08)"; }}
    >
      {children}
    </button>
  );
}

function StatusLine({ text, ok }: { text: string; ok?: boolean | null }) {
  if (!text) return null;
  const color = ok === null || ok === undefined ? muted : ok ? green : danger;
  return (
    <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color, margin: "0.5rem 0 0" }}>
      {text}
    </p>
  );
}

function CollapsibleSection({
  title, count, open, onToggle, loading, children,
}: {
  title: string; count: number; open: boolean; onToggle: () => void; loading?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <button onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        width: "100%", background: "transparent", border: "none",
        cursor: "pointer", padding: "0.5rem 0",
        borderBottom: `1px solid rgba(201,169,110,${open ? "0.22" : "0.1"})`,
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem", color: open ? gold : muted }}>
          {title}
        </span>
        {count > 0 && (
          <span style={{ fontFamily: "Georgia, serif", fontSize: "0.68rem", color: muted }}>({count})</span>
        )}
        <span style={{ marginLeft: "auto", color: muted, fontSize: "0.75rem" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ paddingTop: "0.25rem" }}>
          {loading
            ? <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>Loading…</p>
            : children}
        </div>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)", color: muted,
  border: "1px solid rgba(201,169,110,0.28)",
  padding: "0.25rem 0.5rem", fontFamily: "Georgia, serif",
  fontSize: "0.8125rem",
};

const CHAPTERS = [1,2,3,4,5,6,7,8,9,10,11,13];

// ─── Main component ─────────────────────────────────────────────────────────

export default function WritingAgentConsole() {
  const [activeTab, setActiveTab] = useState<Tab>("agent");

  // Agent
  const [provider, setProvider]   = useState<Provider>("claude");
  const [agentIn, setAgentIn]     = useState("");
  const [agentOut, setAgentOut]   = useState("");
  const [agentErr, setAgentErr]   = useState("");
  const [tokenUsage, setTokenUsage] = useState<{ input?: number; output?: number } | null>(null);
  const [loading, setLoading]     = useState(false);
  const imageFileRef = useRef<File | null>(null);
  const [imageName, setImageName] = useState("");

  // Analyzer
  const [analysisResult, setAnalysisResult] = useState<{ the_bad?: string; from_your_book?: string; your_response?: string } | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState("");

  // Drive sync
  const [syncStatus, setSyncStatus] = useState("");
  const [syncOk, setSyncOk]         = useState<boolean | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  // Buffer
  const [bufferFiles, setBufferFiles]     = useState<any[]>([]);
  const [bufferLoading, setBufferLoading] = useState(false);
  const [bufferSearch, setBufferSearch]   = useState("");
  const [bufferSelected, setBufferSelected] = useState<Set<string>>(new Set());
  const [bufferTargetChapter, setBufferTargetChapter] = useState(1);
  const [stageStatus, setStageStatus] = useState("");
  const [stageOk, setStageOk]         = useState<boolean | null>(null);
  const [stageLoading, setStageLoading] = useState(false);

  // Semantic
  const [semanticChapter, setSemanticChapter] = useState(7);
  const [biblicalRows, setBiblicalRows]       = useState<any[]>([]);
  const [archetypeRows, setArchetypeRows]     = useState<any[]>([]);
  const [crosslinkRows, setCrosslinkRows]     = useState<any[]>([]);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [semStatus, setSemStatus] = useState("");
  const [semOk, setSemOk]         = useState<boolean | null>(null);
  const [reannotateLoading, setReannotateLoading] = useState(false);
  const [openSection, setOpenSection] = useState<"biblical" | "archetypes" | "crosslinks" | null>("biblical");

  // Versions
  const [versionsChapter, setVersionsChapter] = useState(1);
  const [versionGroups, setVersionGroups]     = useState<any[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [versionsStatus, setVersionsStatus]   = useState("");
  const [versionsOk, setVersionsOk]           = useState<boolean | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const askAgent = async () => {
    if (!agentIn.trim() && !imageFileRef.current) return;
    setLoading(true); setAgentOut(""); setAgentErr(""); setTokenUsage(null);
    try {
      const reqBody: any = { prompt: agentIn, preferredProvider: provider };
      if (imageFileRef.current) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFileRef.current!);
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
        });
        reqBody.imageData = base64;
        reqBody.mimeType  = imageFileRef.current.type;
        reqBody.preferredProvider = "gemini";
      }
      const res = await fetch("/api/agent", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      const d = await res.json();
      if (!res.ok) { setAgentErr(d.error || `Error ${res.status}`); return; }
      setAgentOut(d.response || d.result || JSON.stringify(d));
      if (d.usage) setTokenUsage(d.usage);
    } catch (e: any) { setAgentErr(e.message); }
    finally { setLoading(false); }
  };

  const handleDocUpload = async (file: File) => {
    setAnalyzeLoading(true); setAnalysisResult(null); setAnalyzeErr("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
      });
      const res = await fetch("/api/analyze-document", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileBase64: base64, mimeType: file.type }),
      });
      const d = await res.json();
      if (!res.ok) { setAnalyzeErr(d.error || `Error ${res.status}`); return; }
      const a = d.analysis;
      if (a?.the_bad || a?.from_your_book || a?.your_response) {
        setAnalysisResult(a);
      } else {
        setAnalyzeErr("Analysis returned no structured result. Check Anthropic API key.");
      }
    } catch (e: any) { setAnalyzeErr(e.message); }
    finally { setAnalyzeLoading(false); }
  };

  const syncDrive = async () => {
    setSyncLoading(true); setSyncStatus(""); setSyncOk(null);
    try {
      const res = await fetch("/api/sync/drive", { method: "POST" });
      const d = await res.json();
      if (!res.ok) {
        setSyncStatus(d.error || `Error ${res.status}`); setSyncOk(false); return;
      }
      setSyncStatus(`Synced ${d.synced?.length ?? 0} files. Errors: ${d.errors?.length ?? 0}.`);
      setSyncOk(true);
    } catch (e: any) { setSyncStatus(e.message); setSyncOk(false); }
    finally { setSyncLoading(false); }
  };

  const fetchBuffer = async () => {
    setBufferLoading(true);
    try {
      const res = await fetch("/api/ingestion-buffer");
      const d = await res.json();
      setBufferFiles(Array.isArray(d.files) ? d.files : []);
    } catch { setBufferFiles([]); }
    finally { setBufferLoading(false); }
  };

  const toggleBufferFile = (id: string) => {
    setBufferSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const stageForChapter = async () => {
    if (bufferSelected.size === 0) return;
    setStageLoading(true); setStageStatus(""); setStageOk(null);
    const results: string[] = [];
    for (const id of bufferSelected) {
      const file = bufferFiles.find(f => f.id === id);
      if (!file) continue;
      const filename = file.filename || file.id;
      try {
        const res = await fetch("/api/manuscript/stage", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename, chapterNumber: bufferTargetChapter }),
        });
        const d = await res.json();
        if (!res.ok) { results.push(`${filename}: ${d.error}`); }
        else { results.push(`${filename}: ${d.staged} paragraphs staged`); }
      } catch (e: any) { results.push(`${filename}: ${e.message}`); }
    }
    const allOk = results.every(r => r.includes("paragraphs staged"));
    setStageStatus(results.join(" | "));
    setStageOk(allOk);
    if (allOk) {
      // Reload the reader with the newly staged chapter
      bus.emit("chapter:set", { chapterNumber: bufferTargetChapter, source: "db" });
      setBufferSelected(new Set());
    }
    setStageLoading(false);
  };

  const fetchSemanticRows = async () => {
    setSemanticLoading(true); setSemStatus(""); setSemOk(null);
    setBiblicalRows([]); setArchetypeRows([]); setCrosslinkRows([]);
    try {
      const [bibRes, graphRes] = await Promise.all([
        fetch(`/api/biblical-references`),
        fetch(`/api/graph`),
      ]);
      const bibData = await bibRes.json();
      if (!bibRes.ok) { setSemStatus(bibData.error || "Failed to load biblical refs"); setSemOk(false); }
      else {
        const refs = Array.isArray(bibData) ? bibData : bibData?.references || [];
        setBiblicalRows(refs);
      }
      if (graphRes.ok) {
        const g = await graphRes.json();
        setArchetypeRows(g?.archetypes || []);
        setCrosslinkRows(g?.crosslinks || []);
        setSemStatus(`${biblicalRows.length || "—"} biblical · ${g?.archetypes?.length ?? 0} archetypes · ${g?.crosslinks?.length ?? 0} crosslinks`);
        setSemOk(true);
      }
    } catch (e: any) { setSemStatus(e.message); setSemOk(false); }
    finally { setSemanticLoading(false); }
  };

  const toggleVisibility = async (row: any, table: string) => {
    const newVisible = row.visible_to_reader === false;
    try {
      await fetch("/api/semantic/visibility", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id: row.id, visible_to_reader: newVisible }),
      });
      const upd = (rows: any[]) => rows.map(r => r.id === row.id ? { ...r, visible_to_reader: newVisible } : r);
      setBiblicalRows(upd); setArchetypeRows(upd); setCrosslinkRows(upd);
    } catch (e: any) { setSemStatus(`Toggle failed: ${(e as any).message}`); setSemOk(false); }
  };

  const reannotateChapter = async () => {
    setReannotateLoading(true); setSemStatus(""); setSemOk(null);
    try {
      const res = await fetch("/api/reannotate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_number: semanticChapter }),
      });
      const d = await res.json();
      if (!res.ok) { setSemStatus(d.error || "Re-annotate failed"); setSemOk(false); }
      else { setSemStatus(d.message || `Dispatched annotation for chapter ${semanticChapter}.`); setSemOk(true); }
    } catch (e: any) { setSemStatus(e.message); setSemOk(false); }
    finally { setReannotateLoading(false); }
  };

  // Versions: load from render_paragraphs grouped by source_doc_folder
  const fetchVersions = async () => {
    setVersionsLoading(true); setVersionGroups([]); setVersionsStatus(""); setVersionsOk(null);
    try {
      const res = await fetch(`/api/manuscript?chapterNumber=${versionsChapter}`);
      const json = await res.json();
      if (!res.ok) {
        setVersionsStatus(json.error || `Error ${res.status}`); setVersionsOk(false); return;
      }
      const paragraphs: any[] = Array.isArray(json) ? json : (json.paragraphs || []);
      if (paragraphs.length === 0) {
        setVersionsStatus(`No paragraphs found for chapter ${versionsChapter}. Try staging a buffer file.`);
        setVersionsOk(null); return;
      }
      // Group by source_doc_folder (or chapter_version as fallback)
      const grouped: Record<string, any[]> = {};
      for (const r of paragraphs) {
        const key = r.chapter_version || r.source_doc || r.source_doc_folder || "active";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
      }
      setVersionGroups(Object.entries(grouped).map(([version, items]) => ({
        version,
        count: items.length,
        preview: (items[0]?.content || items[0]?.text || "").slice(0, 140),
        prose_source: json.prose_source,
      })));
      setVersionsStatus(`${paragraphs.length} paragraphs · ${Object.keys(grouped).length} version(s)`);
      setVersionsOk(true);
    } catch (e: any) { setVersionsStatus(e.message); setVersionsOk(false); }
    finally { setVersionsLoading(false); }
  };

  const promoteVersion = async (version_tag: string) => {
    try {
      const res = await fetch(`/api/chapters/${versionsChapter}/promote`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter_number: versionsChapter, version_tag }),
      });
      const d = await res.json();
      if (!res.ok) { setVersionsStatus(d.error || "Promote failed"); setVersionsOk(false); }
      else {
        setVersionsStatus(`Promoted ${d.promoted_count ?? 0} paragraphs.`);
        setVersionsOk(true);
        bus.emit("chapter:set", { chapterNumber: versionsChapter, source: "db" });
      }
    } catch (e: any) { setVersionsStatus(e.message); setVersionsOk(false); }
  };

  // ── Styles ────────────────────────────────────────────────────────────────

  const tabStyle = (t: Tab): React.CSSProperties => ({
    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8rem",
    padding: "0.45rem 0.75rem", background: "transparent", border: "none",
    color: activeTab === t ? gold : muted, cursor: "pointer",
    borderBottom: activeTab === t ? `2px solid ${gold}` : "2px solid transparent",
    transition: "color 180ms",
    textShadow: activeTab === t ? "0 0 10px rgba(201,169,110,0.45)" : "none",
  });

  const providerStyle = (p: Provider): React.CSSProperties => ({
    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem",
    padding: "0.25rem 0.75rem",
    background: provider === p ? "rgba(201,169,110,0.1)" : "transparent",
    border: `1px solid ${provider === p ? "rgba(201,169,110,0.6)" : "rgba(201,169,110,0.2)"}`,
    color: provider === p ? gold : muted, cursor: "pointer",
    transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
    boxShadow: provider === p ? "0 0 12px rgba(201,169,110,0.15), inset 0 0 6px rgba(201,169,110,0.06)" : "none",
    textShadow: provider === p ? "0 0 8px rgba(201,169,110,0.4)" : "none",
  });

  const textarea: React.CSSProperties = {
    width: "100%", fontFamily: "Georgia, serif", fontSize: "0.9375rem",
    color: body, background: "rgba(201,169,110,0.02)",
    border: "1px solid rgba(201,169,110,0.18)", padding: "0.75rem",
    resize: "vertical", outline: "none", boxSizing: "border-box",
    boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)", lineHeight: 1.6,
    transition: "border-color 250ms, box-shadow 250ms",
  };

  const responseBox: React.CSSProperties = {
    marginTop: "1rem", padding: "1rem",
    background: "linear-gradient(135deg, rgba(12,9,5,0.6), rgba(8,6,3,0.8))",
    borderLeft: `2px solid ${gold}`,
    boxShadow: "0 0 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.3), -2px 0 20px rgba(201,169,110,0.06)",
    fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body,
    lineHeight: 1.7, whiteSpace: "pre-wrap",
  };

  const sectionHead: React.CSSProperties = {
    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.9375rem",
    color: gold, margin: "0 0 0.75rem",
  };

  const rowStyle: React.CSSProperties = {
    padding: "0.45rem 0", borderBottom: "1px solid rgba(201,169,110,0.07)",
    fontFamily: "Georgia, serif",
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontSize: "0.875rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: gold, fontSize: "0.9rem", margin: 0, textShadow: "0 0 14px rgba(201,169,110,0.3)" }}>
          Operator Active · Telemetry Online
        </p>
        <button
          onClick={() => bus.emit("panel:open", { tabId: "HYPERLINKS" })}
          style={{
            fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem",
            color: "rgba(201,169,110,0.65)", background: "rgba(201,169,110,0.05)",
            border: "1px solid rgba(201,169,110,0.18)", padding: "0.22rem 0.65rem",
            cursor: "pointer", transition: "all 200ms",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = gold; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(201,169,110,0.65)"; }}
        >
          ⬡ Graph
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.12)", marginBottom: "1rem", flexWrap: "wrap", gap: "0" }}>
        {(["agent","analyzer","buffer","drive","semantic","versions"] as const).map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => {
            setActiveTab(t);
            if (t === "buffer" && bufferFiles.length === 0) fetchBuffer();
          }}>
            {t === "agent"    ? "Agent"
            : t === "analyzer" ? "Docs"
            : t === "buffer"   ? `Buffer${bufferFiles.length ? ` (${bufferFiles.length})` : ""}`
            : t === "drive"    ? "Drive"
            : t === "semantic" ? "Semantic"
            : "Versions"}
          </button>
        ))}
      </div>

      {/* ── AGENT TAB ───────────────────────────────────────────────────── */}
      {activeTab === "agent" && (
        <div>
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            {(["claude","gemini","groq"] as const).map(p => (
              <button key={p} onClick={() => setProvider(p)} style={providerStyle(p)}>
                {p === "claude" ? "Claude" : p === "gemini" ? "Gemini" : "Groq"}
              </button>
            ))}
            <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.72rem", color: muted, marginLeft: "auto" }}>
              D-4.0 — sensation, not emotion
            </span>
          </div>

          <label style={{ display: "block", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: muted, marginBottom: "0.35rem", cursor: "pointer" }}>
            + Attach image (auto-routes Gemini)
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
              const f = e.target.files?.[0] || null;
              imageFileRef.current = f; setImageName(f?.name || "");
            }} />
          </label>
          {imageName && (
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: gold, margin: "0 0 0.4rem" }}>
              ✓ {imageName}
            </p>
          )}

          <textarea
            value={agentIn}
            onChange={e => setAgentIn(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) askAgent(); }}
            placeholder="Ask the swarm about the manuscript… (⌘↵ to send)"
            rows={3}
            style={{ ...textarea, margin: "0.5rem 0" }}
          />
          <GoldBtn onClick={askAgent} disabled={loading}>
            {loading ? "Thinking…" : "Send"}
          </GoldBtn>

          {agentErr && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(90,30,30,0.2)", borderLeft: `2px solid ${danger}`, fontFamily: "Georgia, serif", fontSize: "0.875rem", color: "#c07070" }}>
              {agentErr}
              {agentErr.includes("not configured") && (
                <p style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: muted }}>
                  Add <code style={{ color: gold }}>ANTHROPIC_API_KEY</code> (Claude), <code style={{ color: gold }}>GROQ_API_KEY</code> (Groq), or <code style={{ color: gold }}>GOOGLE_CLOUD_PROJECT</code> (Gemini) to Vercel environment variables.
                </p>
              )}
            </div>
          )}

          {agentOut && <div style={responseBox}>{agentOut}</div>}
          {tokenUsage && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.72rem", color: muted, marginTop: "0.4rem" }}>
              {tokenUsage.input ?? "—"} in / {tokenUsage.output ?? "—"} out tokens
            </p>
          )}
        </div>
      )}

      {/* ── ANALYZER TAB ─────────────────────────────────────────────────── */}
      {activeTab === "analyzer" && (
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.8125rem", margin: "0 0 0.75rem" }}>
            Upload a document to analyze it against the manuscript.
          </p>
          <input type="file" accept=".txt,.pdf,.png,.jpg,.jpeg,.webp"
            disabled={analyzeLoading}
            style={{ display: "block", margin: "0 0 0.5rem", fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: muted }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleDocUpload(f); }}
          />
          {analyzeLoading && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted }}>Analyzing…</p>}
          {analyzeErr && (
            <div style={{ padding: "0.75rem", background: "rgba(90,30,30,0.2)", borderLeft: `2px solid ${danger}`, fontFamily: "Georgia, serif", fontSize: "0.875rem", color: "#c07070", marginTop: "0.5rem" }}>
              {analyzeErr}
            </div>
          )}
          {analysisResult && (
            <div style={{ marginTop: "0.75rem" }}>
              {(["the_bad","from_your_book","your_response"] as const).filter(k => analysisResult[k]).map((key, ki) => (
                <div key={key} style={{
                  marginBottom: "1.25rem", padding: "0.875rem",
                  background: "linear-gradient(135deg, rgba(12,9,5,0.5), rgba(8,6,3,0.7))",
                  borderLeft: `2px solid ${gold}`,
                  animation: `fadeIn 0.4s ease ${ki * 0.12}s both`,
                }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "0.65rem", letterSpacing: "0.14em", color: gold, textTransform: "uppercase", marginBottom: "0.4rem" }}>
                    {key === "the_bad" ? "The Bad" : key === "from_your_book" ? "From Your Book" : "Your Response"}
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body, lineHeight: 1.65 }}>{analysisResult[key]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BUFFER TAB ───────────────────────────────────────────────────── */}
      {activeTab === "buffer" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", color: gold, fontSize: "0.9375rem" }}>
              {bufferFiles.length > 0 ? `${bufferFiles.length} files in ingestion buffer` : "Drive Ingestion Buffer"}
            </p>
            <GoldBtn onClick={fetchBuffer} disabled={bufferLoading}>
              {bufferLoading ? "Loading…" : "Refresh"}
            </GoldBtn>
          </div>

          {bufferFiles.length > 0 && (
            <>
              <input
                type="text" placeholder="Filter files…" value={bufferSearch}
                onChange={e => setBufferSearch(e.target.value)}
                style={{ width: "100%", marginBottom: "0.5rem", fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: body, background: "rgba(201,169,110,0.02)", border: "1px solid rgba(201,169,110,0.2)", padding: "0.35rem 0.65rem", outline: "none", boxSizing: "border-box" }}
              />
              <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: "0.75rem" }}>
                {bufferFiles
                  .filter(f => !bufferSearch || f.name?.toLowerCase().includes(bufferSearch.toLowerCase()))
                  .map((f, i) => (
                    <label key={f.id || i} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.3rem 0.5rem", cursor: "pointer",
                      background: bufferSelected.has(f.id) ? "rgba(201,169,110,0.06)" : "transparent",
                      borderLeft: `2px solid ${bufferSelected.has(f.id) ? "rgba(201,169,110,0.5)" : "transparent"}`,
                      transition: "all 120ms",
                    }}>
                      <input type="checkbox" checked={bufferSelected.has(f.id)} onChange={() => toggleBufferFile(f.id)} style={{ accentColor: gold, flexShrink: 0 }} />
                      <span style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: bufferSelected.has(f.id) ? gold : body, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.name}
                      </span>
                      <span style={{ fontFamily: "Georgia, serif", fontSize: "0.65rem", color: muted, flexShrink: 0 }}>{f.status}</span>
                    </label>
                  ))}
              </div>

              {bufferSelected.size > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", padding: "0.65rem 0.75rem", background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.14)", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: muted }}>
                    {bufferSelected.size} selected → Chapter
                  </span>
                  <select value={bufferTargetChapter} onChange={e => setBufferTargetChapter(Number(e.target.value))} style={selectStyle}>
                    {CHAPTERS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <GoldBtn onClick={stageForChapter} disabled={stageLoading}>
                    {stageLoading ? "Staging…" : `Stage as Ch ${bufferTargetChapter} Prose`}
                  </GoldBtn>
                  <button onClick={() => setBufferSelected(new Set())} style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted, background: "transparent", border: "none", cursor: "pointer" }}>
                    Clear
                  </button>
                </div>
              )}
              <StatusLine text={stageStatus} ok={stageOk} />
            </>
          )}
          {bufferFiles.length === 0 && !bufferLoading && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>
              Click Refresh to load your ingestion buffer.
            </p>
          )}
        </div>
      )}

      {/* ── DRIVE TAB ────────────────────────────────────────────────────── */}
      {activeTab === "drive" && (
        <div>
          <p style={{ ...sectionHead }}>Google Drive Sync</p>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.8125rem", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
            Requires <code style={{ color: gold }}>GOOGLE_CLIENT_ID</code>, <code style={{ color: gold }}>GOOGLE_CLIENT_SECRET</code>, and <code style={{ color: gold }}>GOOGLE_REFRESH_TOKEN</code> in Vercel environment variables.
          </p>
          <GoldBtn onClick={syncDrive} disabled={syncLoading}>
            {syncLoading ? "Syncing…" : "Sync Drive"}
          </GoldBtn>
          <StatusLine text={syncStatus} ok={syncOk} />
        </div>
      )}

      {/* ── SEMANTIC TAB ─────────────────────────────────────────────────── */}
      {activeTab === "semantic" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted }}>Chapter</span>
            <select value={semanticChapter} onChange={e => setSemanticChapter(Number(e.target.value))} style={selectStyle}>
              {CHAPTERS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <GoldBtn onClick={fetchSemanticRows} disabled={semanticLoading}>{semanticLoading ? "Loading…" : "Load"}</GoldBtn>
            <GoldBtn onClick={reannotateChapter} disabled={reannotateLoading} variant="ghost">
              {reannotateLoading ? "Dispatching…" : "Re-annotate"}
            </GoldBtn>
          </div>
          <StatusLine text={semStatus} ok={semOk} />

          <div style={{ marginTop: "0.75rem" }}>
            <CollapsibleSection
              title="Biblical References" count={biblicalRows.length}
              open={openSection === "biblical"} onToggle={() => setOpenSection(s => s === "biblical" ? null : "biblical")}
              loading={semanticLoading}
            >
              {biblicalRows.length === 0
                ? <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>None — click Load.</p>
                : biblicalRows.map((row, i) => (
                  <div key={row.id || i} style={rowStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.8125rem", color: gold }}>{row.book} {row.chapter}:{row.verse}{row.verse_end && row.verse_end !== row.verse ? `–${row.verse_end}` : ""}</span>
                      <span style={{ fontSize: "0.65rem", color: muted, fontStyle: "italic" }}>{row.motif_family}</span>
                    </div>
                    {row.reference_text && <div style={{ fontSize: "0.875rem", color: body, marginTop: "0.15rem", lineHeight: 1.5, opacity: 0.9 }}>{row.reference_text}</div>}
                  </div>
                ))}
            </CollapsibleSection>

            <CollapsibleSection
              title="Archetypes" count={archetypeRows.length}
              open={openSection === "archetypes"} onToggle={() => setOpenSection(s => s === "archetypes" ? null : "archetypes")}
              loading={semanticLoading}
            >
              {archetypeRows.length === 0
                ? <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>None — click Load.</p>
                : archetypeRows.map((row, i) => (
                  <div key={row.id || i} style={{ ...rowStyle, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.875rem", color: gold, flex: 1 }}>{row.label || row.canonical_label}</span>
                    <span style={{ fontSize: "0.7rem", color: muted, fontStyle: "italic" }}>{row.family || row.ontology_family}</span>
                    <button onClick={() => toggleVisibility(row, "semantic_archetype_anchors")} style={{
                      fontFamily: "Georgia, serif", fontSize: "0.72rem", padding: "0.15rem 0.5rem",
                      cursor: "pointer", background: "transparent",
                      border: `1px solid ${row.visible_to_reader === false ? danger : "rgba(201,169,110,0.35)"}`,
                      color: row.visible_to_reader === false ? "#c07070" : muted,
                    }}>
                      {row.visible_to_reader === false ? "Hidden" : "Visible"}
                    </button>
                  </div>
                ))}
            </CollapsibleSection>

            <CollapsibleSection
              title="Crosslinks / Dualisms" count={crosslinkRows.length}
              open={openSection === "crosslinks"} onToggle={() => setOpenSection(s => s === "crosslinks" ? null : "crosslinks")}
              loading={semanticLoading}
            >
              {crosslinkRows.length === 0
                ? <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>None — click Load.</p>
                : crosslinkRows.map((row, i) => (
                  <div key={row.id || i} style={rowStyle}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                      <span style={{ fontSize: "0.7rem", color: muted }}>{row.link_type === "parallelism" ? "↔" : "↕"}</span>
                      <span style={{ fontSize: "0.8125rem", color: gold }}>{row.relation_type || row.relation_family}</span>
                      <span style={{ fontSize: "0.65rem", color: muted }}>{row.left_family} → {row.right_family}</span>
                    </div>
                    {row.evidence_text && (
                      <div style={{ fontSize: "0.8rem", color: body, fontStyle: "italic", marginTop: "0.15rem", opacity: 0.75 }}>
                        {row.evidence_text.slice(0, 100)}{row.evidence_text.length > 100 ? "…" : ""}
                      </div>
                    )}
                  </div>
                ))}
            </CollapsibleSection>
          </div>
        </div>
      )}

      {/* ── VERSIONS TAB ─────────────────────────────────────────────────── */}
      {activeTab === "versions" && (
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.8125rem", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
            Select a chapter, load versions, then promote or load one in the reader. To swap prose: go to Buffer tab → select a file → Stage as Ch N Prose.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.875rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted }}>Chapter</span>
            <select value={versionsChapter} onChange={e => setVersionsChapter(Number(e.target.value))} style={selectStyle}>
              {CHAPTERS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <GoldBtn onClick={fetchVersions} disabled={versionsLoading}>{versionsLoading ? "Loading…" : "Load Versions"}</GoldBtn>
          </div>
          <StatusLine text={versionsStatus} ok={versionsOk} />

          {versionGroups.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              {versionGroups.map((v, i) => (
                <div key={i} style={{ padding: "0.65rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: gold, flex: 1 }}>
                      {v.version}
                      <span style={{ color: muted, fontStyle: "italic", fontSize: "0.72rem", marginLeft: "0.4rem" }}>({v.count} ¶)</span>
                    </span>
                    <GoldBtn variant="ghost" onClick={() => {
                      bus.emit("chapter:set", { chapterNumber: versionsChapter, source: "db" });
                      setVersionsStatus(`Loading chapter ${versionsChapter} in reader…`);
                      setVersionsOk(null);
                    }}>
                      Load in Reader
                    </GoldBtn>
                    <GoldBtn onClick={() => promoteVersion(v.version)}>Promote</GoldBtn>
                  </div>
                  {v.preview && (
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "0.8rem", color: muted, fontStyle: "italic", background: "rgba(255,255,255,0.02)", padding: "0.4rem 0.6rem", borderLeft: "2px solid rgba(201,169,110,0.25)", margin: "0.4rem 0 0" }}>
                      {v.preview}{v.preview.length >= 140 ? "…" : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {versionGroups.length === 0 && !versionsLoading && !versionsStatus && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Select a chapter and click Load Versions.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
