"use client";
import { useEffect, useState } from "react";

const PIN = process.env.NEXT_PUBLIC_AUTHOR_PIN || "9187";
const KEY = "nos-author-unlocked";
const muted = "#8a857c";
const gold = "#c9a96e";
const body = "#e8e4dc";

type Tab = "agent" | "analyzer" | "drive" | "semantic" | "versions";
type AnalysisResult = { the_bad?: string; from_your_book?: string; your_response?: string };

export default function AuthorGateway() {
  const [unlocked, setUnlocked] = useState(false);
  const [entry, setEntry] = useState("");
  const [err, setErr] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("agent");

  const [agentIn, setAgentIn] = useState("");
  const [agentOut, setAgentOut] = useState("");
  const [loading, setLoading] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  const [syncStatus, setSyncStatus] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);

  const [semanticChapter, setSemanticChapter] = useState<number>(7);
  const [semanticRows, setSemanticRows] = useState<any[]>([]);
  const [semanticLoading, setSemanticLoading] = useState(false);

  const [versionsChapter, setVersionsChapter] = useState<number>(7);
  const [versionGroups, setVersionGroups] = useState<any[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [promoteResult, setPromoteResult] = useState("");

  useEffect(() => {
    try { if (localStorage.getItem(KEY) === "true") setUnlocked(true); } catch {}
  }, []);

  const tryUnlock = (v: string) => {
    if (v === PIN) {
      setUnlocked(true); setErr("");
      try { localStorage.setItem(KEY, "true"); } catch {}
    } else if (v.length === 4) {
      setErr("Incorrect"); setEntry("");
      setTimeout(() => setErr(""), 1500);
    }
  };

  const askAgent = async () => {
    if (!agentIn.trim()) return;
    setLoading(true); setAgentOut("");
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: agentIn }),
      });
      const d = await res.json();
      setAgentOut(d.response || d.text || d.result || JSON.stringify(d));
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
        method: "POST",
        headers: { "x-author-pin": PIN },
      });
      const d = await res.json();
      setSyncStatus(`Synced: ${d.synced?.length ?? 0}. Errors: ${d.errors?.length ?? 0}`);
    } catch (e: any) { setSyncStatus(`Error: ${e.message}`); }
    finally { setSyncLoading(false); }
  };

  const fetchSemanticRows = async () => {
    setSemanticLoading(true);
    try {
      const res = await fetch(`/api/biblical-references?chapterId=${semanticChapter}`);
      const d = await res.json();
      setSemanticRows(Array.isArray(d) ? d : []);
    } catch { setSemanticRows([]); }
    finally { setSemanticLoading(false); }
  };

  const toggleVisibility = async (row: any) => {
    const newVisible = !row.visible_to_reader;
    try {
      await fetch("/api/semantic/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-author-pin": PIN },
        body: JSON.stringify({ table: "semantic_meaning_spans", id: row.id, visible_to_reader: newVisible }),
      });
      setSemanticRows(prev => prev.map(r => r.id === row.id ? { ...r, visible_to_reader: newVisible } : r));
    } catch (e: any) { setAgentOut(`Toggle error: ${e.message}`); }
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
        chapter_version,
        count: items.length,
        first_paragraph: items[0]?.content,
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

  const btn = (onClick: () => void, disabled: boolean, label: string) => (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem",
      color: gold, background: "transparent", border: `1px solid ${gold}`,
      padding: "0.4rem 1.25rem", cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    }}>{label}</button>
  );

  const tabStyle = (t: Tab): React.CSSProperties => ({
    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem",
    padding: "0.5rem 0.875rem", background: "transparent", border: "none",
    color: activeTab === t ? gold : muted, cursor: "pointer",
    borderBottom: activeTab === t ? `2px solid ${gold}` : "2px solid transparent",
    transition: "color 200ms",
  });

  const chapterOptions = [1,2,3,4,5,6,7,8,9,10,11,13];

  if (!unlocked) {
    return (
      <div>
        <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.5rem", textAlign: "center" }}>Author Gateway</h2>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, textAlign: "center", fontSize: "0.9375rem", margin: "0.5rem 0" }}>Enter operator PIN.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
          <input type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={4}
            value={entry}
            onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setEntry(v); tryUnlock(v); }}
            autoFocus placeholder="• • • •"
            style={{ fontSize: "1.75rem", letterSpacing: "0.5em", textAlign: "center", color: gold, background: "transparent", border: "none", borderBottom: "1px solid rgba(201,169,110,0.4)", padding: "0.5rem 0", width: "8rem", outline: "none" }} />
          {err && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#6b2c2c", fontSize: "0.8125rem", margin: 0 }}>{err}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.25rem", textAlign: "center" }}>Author Gateway</h2>
      <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: gold, textAlign: "center", fontSize: "0.9375rem", margin: "0.25rem 0 0.75rem" }}>Operator Active · Telemetry Online</p>

      <div style={{ display: "flex", borderBottom: "1px solid rgba(201,169,110,0.2)", marginBottom: "1rem", flexWrap: "wrap" }}>
        {(["agent","analyzer","drive","semantic","versions"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(t)}>
            {t === "agent" ? "Agent" : t === "analyzer" ? "Docs" : t === "drive" ? "Drive" : t === "semantic" ? "Semantic" : "Versions"}
          </button>
        ))}
      </div>

      {activeTab === "agent" && (
        <div>
          <textarea value={agentIn} onChange={e => setAgentIn(e.target.value)}
            placeholder="Ask the swarm about the manuscript…" rows={3}
            style={{ width: "100%", margin: "0.5rem 0", fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.15)", padding: "0.75rem", resize: "vertical", outline: "none" }} />
          {btn(askAgent, loading, loading ? "Thinking…" : "Send")}
          {agentOut && (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderLeft: `2px solid ${gold}`, fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {agentOut}
            </div>
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
              {(["the_bad", "from_your_book", "your_response"] as const).map(key => analysisResult[key] && (
                <div key={key} style={{ marginBottom: "1.5rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${gold}` }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "0.6875rem", letterSpacing: "0.15em", color: gold, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    {key === "the_bad" ? "The Bad" : key === "from_your_book" ? "From Your Book" : "Your Response"}
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body, lineHeight: 1.6 }}>{analysisResult[key]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "drive" && (
        <div>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: gold, margin: "0 0 0.75rem" }}>Drive Sync</h3>
          {btn(syncDrive, syncLoading, syncLoading ? "Syncing…" : "Sync Drive")}
          {syncStatus && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem", marginTop: "0.75rem" }}>{syncStatus}</p>}
        </div>
      )}

      {activeTab === "semantic" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted, letterSpacing: "0.1em" }}>Chapter</span>
            <select value={semanticChapter} onChange={e => setSemanticChapter(Number(e.target.value))}
              style={{ background: "transparent", color: muted, border: "1px solid rgba(201,169,110,0.3)", padding: "0.25rem 0.5rem", fontFamily: "Georgia, serif" }}>
              {chapterOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {btn(fetchSemanticRows, semanticLoading, semanticLoading ? "Loading…" : "Load")}
          </div>
          {semanticRows.map((row, i) => (
            <div key={row.id || i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "0.875rem", flex: 1, lineHeight: 1.5, color: row.visible_to_reader ? body : "#6b2c2c", opacity: row.visible_to_reader ? 1 : 0.7 }}>
                {row.span_text || row.claim_type || "—"}
              </div>
              <button onClick={() => toggleVisibility(row)} style={{
                fontFamily: "Georgia, serif", fontSize: "0.75rem", padding: "0.2rem 0.6rem",
                cursor: "pointer", background: "transparent", whiteSpace: "nowrap",
                border: `1px solid ${row.visible_to_reader ? gold : "#6b2c2c"}`,
                color: row.visible_to_reader ? gold : "#6b2c2c",
              }}>
                {row.visible_to_reader ? "Visible" : "Hidden"}
              </button>
            </div>
          ))}
          {semanticRows.length === 0 && !semanticLoading && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>Select a chapter and click Load.</p>
          )}
        </div>
      )}

      {activeTab === "versions" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "0.75rem", color: muted, letterSpacing: "0.1em" }}>Chapter</span>
            <select value={versionsChapter} onChange={e => setVersionsChapter(Number(e.target.value))}
              style={{ background: "transparent", color: muted, border: "1px solid rgba(201,169,110,0.3)", padding: "0.25rem 0.5rem", fontFamily: "Georgia, serif" }}>
              {chapterOptions.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {btn(fetchVersions, versionsLoading, versionsLoading ? "Loading…" : "Load Versions")}
          </div>
          {versionGroups.map((v, i) => (
            <div key={i} style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(201,169,110,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: muted, flex: 1 }}>{v.chapter_version} ({v.count} ¶)</span>
                <button onClick={() => promoteVersion(v.chapter_version)} style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem", color: gold, background: "transparent", border: `1px solid ${gold}`, padding: "0.35rem 1rem", cursor: "pointer" }}>
                  Promote
                </button>
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

      <button onClick={() => { setUnlocked(false); setEntry(""); try { localStorage.removeItem(KEY); } catch {} }}
        style={{ display: "block", margin: "2rem auto 0", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted, background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem 1rem" }}>
        Lock gateway
      </button>
    </div>
  );
}
