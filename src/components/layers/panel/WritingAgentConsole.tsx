"use client";
import { useState, useRef } from "react";
import { bus } from "@/core/runtimeEngine";

const PIN = process.env.NEXT_PUBLIC_AUTHOR_PIN || "9187";
const gold = "#c9a96e";
const muted = "#8a857c";
const body = "#e8e4dc";
const red = "#6b2c2c";

type Tab = "agent" | "analyzer" | "buffer" | "drive" | "semantic" | "versions";
type Provider = "claude" | "gemini" | "groq";

function Btn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem",
        color: disabled ? "rgba(201,169,110,0.4)" : "#c9a96e",
        background: "rgba(201,169,110,0.06)",
        border: `1px solid ${disabled ? "rgba(201,169,110,0.2)" : "rgba(201,169,110,0.45)"}`,
        padding: "0.4rem 1.25rem", cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        boxShadow: disabled ? "none" : "0 0 10px rgba(201,169,110,0.1)",
        transition: "all 250ms cubic-bezier(0.22,1,0.36,1)",
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(201,169,110,0.28)"; }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 10px rgba(201,169,110,0.1)"; }}
    >{children}</button>
  );
}

function SemanticRow({ row, table, onToggle }: { row: any; table: string; onToggle: (row: any, table: string) => void }) {
  const isVisible = row.visible_to_reader !== false;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "0.75rem",
      padding: "0.5rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)",
    }}>
      <div style={{
        fontFamily: "Georgia, serif", fontSize: "0.875rem", flex: 1, lineHeight: 1.5,
        color: isVisible ? body : red, opacity: isVisible ? 1 : 0.7,
      }}>
        {row.span_text || row.claim_type || row.anchor_text || "—"}
        {row.claim_family && (
          <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: muted, fontStyle: "italic" }}>
            {row.claim_family}
          </span>
        )}
      </div>
      <button onClick={() => onToggle(row, table)} style={{
        fontFamily: "Georgia, serif", fontSize: "0.75rem", padding: "0.2rem 0.6rem",
        cursor: "pointer", background: "transparent", whiteSpace: "nowrap",
        border: `1px solid ${isVisible ? gold : red}`,
        color: isVisible ? gold : red,
      }}>
        {isVisible ? "Visible" : "Hidden"}
      </button>
    </div>
  );
}

function CollapsibleSection({
  title, count, open, onToggle, loading, children,
}: {
  title: string; count: number; open: boolean; onToggle: () => void;
  loading?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <button onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        width: "100%", background: "transparent", border: "none",
        cursor: "pointer", padding: "0.5rem 0",
        borderBottom: `1px solid rgba(201,169,110,${open ? "0.25" : "0.1"})`,
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.9rem", color: open ? gold : muted }}>
          {title}
        </span>
        {count > 0 && (
          <span style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", color: muted, marginLeft: "0.25rem" }}>
            ({count})
          </span>
        )}
        <span style={{ marginLeft: "auto", color: muted, fontSize: "0.75rem" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ paddingTop: "0.25rem" }}>
          {loading ? (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>Loading…</p>
          ) : children}
        </div>
      )}
    </div>
  );
}

export default function WritingAgentConsole() {
  const [activeTab, setActiveTab] = useState<Tab>("agent");
  const [provider, setProvider] = useState<Provider>("claude");

  const [agentIn, setAgentIn] = useState("");
  const [agentOut, setAgentOut] = useState("");
  const [tokenUsage, setTokenUsage] = useState<{ input?: number; output?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const imageFileRef = useRef<File | null>(null);
  const [imageName, setImageName] = useState("");

  const [analysisResult, setAnalysisResult] = useState<{ the_bad?: string; from_your_book?: string; your_response?: string } | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  const [syncStatus, setSyncStatus] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);

  const chapterOptions = [1,2,3,4,5,6,7,8,9,10,11,13];

  const [semanticChapter, setSemanticChapter] = useState(7);
  const [biblicalRows, setBiblicalRows] = useState<any[]>([]);
  const [archetypeRows, setArchetypeRows] = useState<any[]>([]);
  const [crosslinkRows, setCrosslinkRows] = useState<any[]>([]);
  const [semanticLoading, setSemanticLoading] = useState(false);
  const [reannotateLoading, setReannotateLoading] = useState(false);
  const [reannotateResult, setReannotateResult] = useState("");
  const [openSection, setOpenSection] = useState<"biblical" | "archetypes" | "crosslinks" | null>("biblical");

  const [versionsChapter, setVersionsChapter] = useState(7);
  const [versionGroups, setVersionGroups] = useState<any[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [promoteResult, setPromoteResult] = useState("");

  // Drive buffer state
  const [bufferFiles, setBufferFiles] = useState<any[]>([]);
  const [bufferLoading, setBufferLoading] = useState(false);
  const [bufferSearch, setBufferSearch] = useState("");
  const [bufferSelected, setBufferSelected] = useState<Set<string>>(new Set());
  const [bufferTargetChapter, setBufferTargetChapter] = useState(1);
  const [bufferCopyResult, setBufferCopyResult] = useState("");

  const fetchBuffer = async () => {
    setBufferLoading(true);
    try {
      const res = await fetch("/api/ingestion-buffer");
      const d = await res.json();
      setBufferFiles(Array.isArray(d.files) ? d.files : []);
    } catch (e: any) { setBufferFiles([]); }
    finally { setBufferLoading(false); }
  };

  const toggleBufferFile = (id: string) => {
    setBufferSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyToVersion = async () => {
    if (bufferSelected.size === 0) return;
    setBufferCopyResult("Copying…");
    try {
      const selected = bufferFiles.filter(f => bufferSelected.has(f.id));
      const res = await fetch("/api/sync/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-author-pin": PIN },
        body: JSON.stringify({ files: selected, chapter: bufferTargetChapter, action: "copy_to_version" }),
      });
      const d = await res.json();
      setBufferCopyResult(`Done: ${d.synced?.length ?? bufferSelected.size} file(s) staged for chapter ${bufferTargetChapter}.`);
      setBufferSelected(new Set());
    } catch (e: any) { setBufferCopyResult(`Error: ${e.message}`); }
  };

  const tabStyle = (t: Tab): React.CSSProperties => ({
    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem",
    padding: "0.5rem 0.875rem", background: "transparent", border: "none",
    color: activeTab === t ? gold : muted, cursor: "pointer",
    borderBottom: activeTab === t ? `2px solid ${gold}` : "2px solid transparent",
    transition: "color 200ms",
  });

  const providerStyle = (p: Provider): React.CSSProperties => ({
    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem",
    padding: "0.25rem 0.875rem",
    background: provider === p ? "rgba(201,169,110,0.08)" : "transparent",
    border: `1px solid ${provider === p ? gold : "rgba(201,169,110,0.22)"}`,
    color: provider === p ? gold : muted,
    cursor: "pointer", transition: "all 250ms cubic-bezier(0.22,1,0.36,1)",
    boxShadow: provider === p ? "0 0 14px rgba(201,169,110,0.18), inset 0 0 6px rgba(201,169,110,0.06)" : "none",
    textShadow: provider === p ? "0 0 10px rgba(201,169,110,0.4)" : "none",
  });

  const askAgent = async () => {
    if (!agentIn.trim() && !imageFileRef.current) return;
    setLoading(true); setAgentOut(""); setTokenUsage(null);
    try {
      let body: any = { prompt: agentIn, provider };
      if (imageFileRef.current) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFileRef.current!);
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
        });
        body.imageData = base64;
        body.mimeType = imageFileRef.current.type;
        body.provider = "gemini";
      }
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      setAgentOut(d.response || d.text || d.result || JSON.stringify(d));
      if (d.usage) setTokenUsage(d.usage);
    } catch (e: any) { setAgentOut(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  const handleFileUpload = async (file: File) => {
    setAnalyzeLoading(true); setAnalysisResult(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
      });
      const res = await fetch("/api/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-author-pin": PIN },
        body: JSON.stringify({ fileBase64: base64, mimeType: file.type }),
      });
      const d = await res.json();
      const a = d.analysis;
      if (a?.the_bad || a?.from_your_book || a?.your_response) {
        setAnalysisResult(a);
      } else {
        setAgentOut(JSON.stringify(d, null, 2));
        setActiveTab("agent");
      }
    } catch (e: any) { setAgentOut(`Error: ${e.message}`); setActiveTab("agent"); }
    finally { setAnalyzeLoading(false); }
  };

  const syncDrive = async () => {
    setSyncLoading(true); setSyncStatus("");
    try {
      const res = await fetch("/api/sync/drive", {
        method: "POST", headers: { "x-author-pin": PIN },
      });
      const d = await res.json();
      setSyncStatus(`Synced: ${d.synced?.length ?? 0}. Errors: ${d.errors?.length ?? 0}`);
    } catch (e: any) { setSyncStatus(`Error: ${e.message}`); }
    finally { setSyncLoading(false); }
  };

  const fetchSemanticRows = async () => {
    setSemanticLoading(true);
    setBiblicalRows([]); setArchetypeRows([]); setCrosslinkRows([]);
    try {
      const [bibRes, graphRes] = await Promise.all([
        fetch(`/api/biblical-references`),
        fetch(`/api/graph`),
      ]);
      const bibData = await bibRes.json();
      // Normalize: new API returns { references: [...] } with book/chapter/verse/reference_text
      setBiblicalRows(Array.isArray(bibData) ? bibData : bibData?.references || []);

      if (graphRes.ok) {
        const graphData = await graphRes.json();
        // Archetypes: use the canonical archetype definitions
        setArchetypeRows(graphData?.archetypes || []);
        // Crosslinks: all parallelisms + dualisms (no chapter filter since render_paragraphs has no chapter_number yet)
        setCrosslinkRows(graphData?.crosslinks || []);
      }
    } catch { /* silent */ }
    finally { setSemanticLoading(false); }
  };

  const toggleVisibility = async (row: any, table: string) => {
    const newVisible = row.visible_to_reader === false ? true : false;
    try {
      await fetch("/api/semantic/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-author-pin": PIN },
        body: JSON.stringify({ table, id: row.id, visible_to_reader: newVisible }),
      });
      const updater = (rows: any[]) => rows.map(r => r.id === row.id ? { ...r, visible_to_reader: newVisible } : r);
      setBiblicalRows(updater);
      setArchetypeRows(updater);
      setCrosslinkRows(updater);
    } catch (e: any) { setReannotateResult(`Toggle error: ${e.message}`); }
  };

  const reannotateChapter = async () => {
    setReannotateLoading(true); setReannotateResult("");
    try {
      const res = await fetch("/api/reannotate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-author-pin": PIN },
        body: JSON.stringify({ chapter_number: semanticChapter }),
      });
      const d = await res.json();
      setReannotateResult(d.message || `Annotated ${d.written ?? 0} spans.`);
    } catch (e: any) { setReannotateResult(`Error: ${e.message}`); }
    finally { setReannotateLoading(false); }
  };

  const fetchVersions = async () => {
    setVersionsLoading(true);
    try {
      const res = await fetch(`/api/manuscript?chapterId=${versionsChapter}`);
      const rows: any[] = await res.json();
      const grouped: Record<string, any[]> = {};
      for (const r of (Array.isArray(rows) ? rows : [])) {
        const v = r.chapter_version || "default";
        if (!grouped[v]) grouped[v] = [];
        grouped[v].push(r);
      }
      setVersionGroups(Object.entries(grouped).map(([chapter_version, items]) => ({
        chapter_version, count: items.length, first_paragraph: items[0]?.content,
      })));
    } catch { setVersionGroups([]); }
    finally { setVersionsLoading(false); }
  };

  const promoteVersion = async (version_tag: string) => {
    try {
      const res = await fetch(`/api/chapters/${versionsChapter}/promote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-author-pin": PIN },
        body: JSON.stringify({ chapter_number: versionsChapter, version_tag }),
      });
      const d = await res.json();
      setPromoteResult(`Promoted ${d.promoted_count ?? 0} paragraphs. ${d.invalidated_hashes?.length ?? 0} images invalidated.`);
    } catch (e: any) { setPromoteResult(`Error: ${e.message}`); }
  };

  const selectStyle: React.CSSProperties = {
    background: "transparent", color: muted,
    border: "1px solid rgba(201,169,110,0.3)",
    padding: "0.25rem 0.5rem", fontFamily: "Georgia, serif",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: gold, fontSize: "0.9375rem", margin: 0, textShadow: "0 0 16px rgba(201,169,110,0.35)" }}>
          Operator Active · Telemetry Online
        </p>
        <button
          onClick={() => bus.emit("panel:open", { tabId: "HYPERLINKS" })}
          style={{
            fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem",
            color: "rgba(201,169,110,0.7)", background: "rgba(201,169,110,0.06)",
            border: "1px solid rgba(201,169,110,0.2)", padding: "0.25rem 0.75rem",
            cursor: "pointer", borderRadius: "2px",
            transition: "all 250ms cubic-bezier(0.22,1,0.36,1)",
            boxShadow: "0 0 8px rgba(201,169,110,0.06)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(201,169,110,0.22)"; (e.currentTarget as HTMLButtonElement).style.color = gold; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 8px rgba(201,169,110,0.06)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(201,169,110,0.7)"; }}
        >
          ⬡ Dualisms Graph
        </button>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.15)", marginBottom: "1rem", flexWrap: "wrap" }}>
        {(["agent","analyzer","buffer","drive","semantic","versions"] as const).map(t => (
          <button key={t} onClick={() => { setActiveTab(t); if (t === "buffer" && bufferFiles.length === 0) fetchBuffer(); }} style={{
            ...tabStyle(t),
            textShadow: activeTab === t ? "0 0 12px rgba(201,169,110,0.5)" : "none",
          }}>
            {t === "agent" ? "Agent" : t === "analyzer" ? "Docs" : t === "buffer" ? `Buffer${bufferFiles.length ? ` (${bufferFiles.length})` : ""}` : t === "drive" ? "Drive" : t === "semantic" ? "Semantic" : "Versions"}
          </button>
        ))}
      </div>

      {activeTab === "agent" && (
        <div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            {(["claude","gemini","groq"] as const).map(p => (
              <button key={p} onClick={() => setProvider(p)} style={providerStyle(p)}>
                {p === "claude" ? "Claude" : p === "gemini" ? "Gemini" : "Groq"}
              </button>
            ))}
            <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted, marginLeft: "auto" }}>
              D-4.0 — describe sensation, not emotion
            </span>
          </div>

          <label style={{ display: "block", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: muted, marginBottom: "0.5rem", cursor: "pointer" }}>
            Attach image (auto-routes Gemini)
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
              const f = e.target.files?.[0] || null;
              imageFileRef.current = f;
              setImageName(f?.name || "");
            }} />
          </label>
          {imageName && (
            <p style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: gold, margin: "0 0 0.5rem" }}>
              {imageName} ✓
            </p>
          )}

          <textarea value={agentIn} onChange={e => setAgentIn(e.target.value)}
            placeholder="Ask the swarm about the manuscript…" rows={3}
            style={{
              width: "100%", margin: "0.5rem 0", fontFamily: "Georgia, serif",
              fontSize: "0.9375rem", color: body,
              background: "rgba(201,169,110,0.02)",
              border: "1px solid rgba(201,169,110,0.18)",
              padding: "0.75rem", resize: "vertical", outline: "none",
              boxSizing: "border-box",
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.4)",
              transition: "border-color 250ms, box-shadow 250ms",
            }} />
          <Btn onClick={askAgent} disabled={loading}>{loading ? "Thinking…" : "Send"}</Btn>

          {agentOut && (
            <div style={{
              marginTop: "1rem", padding: "1rem",
              background: "linear-gradient(135deg, rgba(12,9,5,0.6) 0%, rgba(8,6,3,0.8) 100%)",
              borderLeft: `2px solid ${gold}`,
              boxShadow: `0 0 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(0,0,0,0.3), -2px 0 20px rgba(201,169,110,0.06)`,
              fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body,
              lineHeight: 1.6, whiteSpace: "pre-wrap",
            }}>
              {agentOut}
            </div>
          )}
          {tokenUsage && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted, marginTop: "0.5rem" }}>
              Tokens: {tokenUsage.input ?? "—"} in / {tokenUsage.output ?? "—"} out
            </p>
          )}
        </div>
      )}

      {activeTab === "analyzer" && (
        <div>
          <input type="file" accept=".txt,.pdf,.png,.jpg,.jpeg,.webp"
            disabled={analyzeLoading}
            style={{ display: "block", margin: "0.5rem 0", fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: muted }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
          {analyzeLoading && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>Analyzing…</p>}
          {analysisResult && (
            <div style={{ marginTop: "1rem" }}>
              {(["the_bad","from_your_book","your_response"] as const).map((key, ki) => analysisResult[key] && (
                <div key={key} style={{
                  marginBottom: "1.5rem", padding: "1rem",
                  background: "linear-gradient(135deg, rgba(12,9,5,0.5), rgba(8,6,3,0.7))",
                  borderLeft: `2px solid ${gold}`,
                  boxShadow: "0 0 24px rgba(0,0,0,0.35), inset 0 0 16px rgba(0,0,0,0.25)",
                  animation: `fadeIn 0.5s ease ${ki * 0.15}s both`,
                }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "0.6875rem", letterSpacing: "0.15em", color: gold, textTransform: "uppercase", marginBottom: "0.5rem", textShadow: "0 0 10px rgba(201,169,110,0.3)" }}>
                    {key === "the_bad" ? "The Bad" : key === "from_your_book" ? "From Your Book" : "Your Response"}
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body, lineHeight: 1.6 }}>{analysisResult[key]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "buffer" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontFamily: "Georgia, serif", fontStyle: "italic", color: gold, fontSize: "0.9375rem" }}>
              Drive Ingestion Buffer {bufferFiles.length > 0 ? `· ${bufferFiles.length} files` : ""}
            </p>
            <Btn onClick={fetchBuffer} disabled={bufferLoading}>{bufferLoading ? "Loading…" : "Refresh"}</Btn>
          </div>

          {bufferFiles.length > 0 && (
            <>
              <input
                type="text"
                placeholder="Search files…"
                value={bufferSearch}
                onChange={e => setBufferSearch(e.target.value)}
                style={{ width: "100%", marginBottom: "0.75rem", fontFamily: "Georgia, serif", fontSize: "0.875rem", color: body, background: "rgba(201,169,110,0.02)", border: "1px solid rgba(201,169,110,0.2)", padding: "0.4rem 0.75rem", outline: "none", boxSizing: "border-box" }}
              />
              <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: "0.75rem" }}>
                {bufferFiles
                  .filter(f => !bufferSearch || f.name?.toLowerCase().includes(bufferSearch.toLowerCase()))
                  .map((f, i) => (
                    <label key={f.id || i} style={{
                      display: "flex", alignItems: "center", gap: "0.6rem",
                      padding: "0.35rem 0.5rem", cursor: "pointer",
                      background: bufferSelected.has(f.id) ? "rgba(201,169,110,0.06)" : "transparent",
                      borderLeft: `2px solid ${bufferSelected.has(f.id) ? "rgba(201,169,110,0.5)" : "transparent"}`,
                      transition: "all 150ms",
                    }}>
                      <input type="checkbox" checked={bufferSelected.has(f.id)} onChange={() => toggleBufferFile(f.id)}
                        style={{ accentColor: gold, flexShrink: 0 }} />
                      <span style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: bufferSelected.has(f.id) ? gold : body, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {f.name}
                      </span>
                      {f.status && (
                        <span style={{ fontFamily: "Georgia, serif", fontSize: "0.68rem", color: muted, flexShrink: 0 }}>{f.status}</span>
                      )}
                    </label>
                  ))
                }
              </div>

              {bufferSelected.size > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", padding: "0.75rem", background: "rgba(201,169,110,0.04)", border: "1px solid rgba(201,169,110,0.15)" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: muted }}>
                    {bufferSelected.size} selected → Chapter
                  </span>
                  <select value={bufferTargetChapter} onChange={e => setBufferTargetChapter(Number(e.target.value))} style={selectStyle}>
                    {chapterOptions.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <Btn onClick={copyToVersion}>Stage for Version</Btn>
                  <button onClick={() => setBufferSelected(new Set())} style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted, background: "transparent", border: "none", cursor: "pointer" }}>
                    Clear
                  </button>
                </div>
              )}
              {bufferCopyResult && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem", marginTop: "0.5rem" }}>{bufferCopyResult}</p>}
            </>
          )}
          {bufferFiles.length === 0 && !bufferLoading && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>Click Refresh to load your 182-file ingestion buffer.</p>
          )}
        </div>
      )}

      {activeTab === "drive" && (
        <div>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: gold, margin: "0 0 0.75rem" }}>Drive Sync</h3>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.8125rem", margin: "0 0 0.75rem" }}>
            Sync manuscript files from Google Drive into the ingestion buffer.
          </p>
          <Btn onClick={syncDrive} disabled={syncLoading}>{syncLoading ? "Syncing…" : "Sync Drive"}</Btn>
          {syncStatus && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem", marginTop: "0.75rem" }}>{syncStatus}</p>}
        </div>
      )}

      {activeTab === "semantic" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted, letterSpacing: "0.1em" }}>Chapter</span>
            <select value={semanticChapter} onChange={e => setSemanticChapter(Number(e.target.value))} style={selectStyle}>
              {chapterOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <Btn onClick={fetchSemanticRows} disabled={semanticLoading}>{semanticLoading ? "Loading…" : "Load"}</Btn>
            <Btn onClick={reannotateChapter} disabled={reannotateLoading}>{reannotateLoading ? "Annotating…" : "Re-annotate"}</Btn>
          </div>
          {reannotateResult && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem", marginBottom: "0.75rem" }}>{reannotateResult}</p>}

          <CollapsibleSection
            title="Biblical References" count={biblicalRows.length}
            open={openSection === "biblical"} onToggle={() => setOpenSection(openSection === "biblical" ? null : "biblical")}
            loading={semanticLoading && openSection === "biblical"}
          >
            {biblicalRows.length === 0
              ? <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>None loaded — click Load above.</p>
              : biblicalRows.map((row, i) => (
                <div key={row.id || i} style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)", fontFamily: "Georgia, serif" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8125rem", color: gold }}>{row.book} {row.chapter}:{row.verse}{row.verse_end && row.verse_end !== row.verse ? `–${row.verse_end}` : ""}</span>
                    <span style={{ fontSize: "0.68rem", color: muted, fontStyle: "italic" }}>{row.motif_family}</span>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: body, marginTop: "0.2rem", lineHeight: 1.5 }}>{row.reference_text}</div>
                </div>
              ))
            }
          </CollapsibleSection>

          <CollapsibleSection
            title="Archetypes" count={archetypeRows.length}
            open={openSection === "archetypes"} onToggle={() => setOpenSection(openSection === "archetypes" ? null : "archetypes")}
            loading={semanticLoading && openSection === "archetypes"}
          >
            {archetypeRows.length === 0
              ? <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>None loaded — click Load above.</p>
              : archetypeRows.map((row, i) => (
                <div key={row.id || i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.45rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "0.875rem", color: gold, flex: 1 }}>{row.label || row.canonical_label}</span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem", color: muted, fontStyle: "italic" }}>{row.family || row.ontology_family}</span>
                </div>
              ))
            }
          </CollapsibleSection>

          <CollapsibleSection
            title="Crosslinks / Dualisms" count={crosslinkRows.length}
            open={openSection === "crosslinks"} onToggle={() => setOpenSection(openSection === "crosslinks" ? null : "crosslinks")}
            loading={semanticLoading && openSection === "crosslinks"}
          >
            {crosslinkRows.length === 0
              ? <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>None loaded — click Load above.</p>
              : crosslinkRows.map((row, i) => (
                <div key={row.id || i} style={{ padding: "0.45rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)", fontFamily: "Georgia, serif" }}>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.68rem", color: muted, fontStyle: "italic" }}>{row.link_type === "parallelism" ? "↔" : "↕"}</span>
                    <span style={{ fontSize: "0.8125rem", color: gold }}>{row.relation_type || row.relation_family}</span>
                    <span style={{ fontSize: "0.68rem", color: muted }}>{row.left_family} → {row.right_family}</span>
                  </div>
                  {row.evidence_text && (
                    <div style={{ fontSize: "0.8rem", color: body, fontStyle: "italic", marginTop: "0.2rem", opacity: 0.8 }}>
                      {row.evidence_text.slice(0, 100)}{row.evidence_text.length > 100 ? "…" : ""}
                    </div>
                  )}
                </div>
              ))
            }
          </CollapsibleSection>
        </div>
      )}

      {activeTab === "versions" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted, letterSpacing: "0.1em" }}>Chapter</span>
            <select value={versionsChapter} onChange={e => setVersionsChapter(Number(e.target.value))} style={selectStyle}>
              {chapterOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <Btn onClick={fetchVersions} disabled={versionsLoading}>{versionsLoading ? "Loading…" : "Load Versions"}</Btn>
          </div>

          {versionGroups.map((v, i) => (
            <div key={i} style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: muted, flex: 1 }}>
                  {v.chapter_version} ({v.count} ¶)
                </span>
                <button onClick={() => promoteVersion(v.chapter_version)} style={{
                  fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem",
                  color: gold, background: "transparent", border: `1px solid ${gold}`,
                  padding: "0.35rem 1rem", cursor: "pointer",
                }}>Promote</button>
              </div>
              {v.first_paragraph && (
                <div style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: muted, fontStyle: "italic", background: "rgba(255,255,255,0.02)", padding: "0.5rem", borderLeft: "2px solid rgba(201,169,110,0.3)", margin: "0.5rem 0" }}>
                  {v.first_paragraph.slice(0, 120)}…
                </div>
              )}
            </div>
          ))}
          {promoteResult && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem", marginTop: "0.75rem" }}>{promoteResult}</p>}
          {versionGroups.length === 0 && !versionsLoading && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>Select a chapter and click Load Versions.</p>
          )}
        </div>
      )}
    </div>
  );
}
