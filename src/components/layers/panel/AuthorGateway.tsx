"use client";
import { useEffect, useState } from "react";

// PIN and local storage key are removed as per directives (no client-side secrets, no telemetry)

const muted = "#8a857c";
const gold = "#c9a96e";
const body = "#e8e4dc";

export default function AuthorGateway() {
  const [unlocked, setUnlocked] = useState(true); // Always unlocked
  const [entry, setEntry] = useState(""); // No longer used for PIN entry
  const [err, setErr] = useState(""); // No longer used for PIN error
  const [agentIn, setAgentIn] = useState("");
  const [agentOut, setAgentOut] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect for local storage removed
  // tryUnlock function removed

  const askAgent = async () => {
    if (!agentIn.trim()) return;
    setLoading(true); setAgentOut("");
    try {
      const res = await fetch("/api/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: agentIn }) });
      const d = await res.json();
      setAgentOut(d.response || d.text || d.result || JSON.stringify(d));
    } catch (e: any) { setAgentOut(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.5rem", textAlign: "center" }}>Author Gateway</h2>
      {/* Telemetry Online paragraph removed */}
      <section style={{ marginTop: "1.5rem" }}>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.0625rem", color: gold, margin: "1.5rem 0 0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>Writing Agent</h3>
        <textarea value={agentIn} onChange={e => setAgentIn(e.target.value)} placeholder="Ask the swarm about the manuscript…" rows={3} style={{ width: "100%", margin: "0.5rem 0", fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.15)", padding: "0.75rem", resize: "vertical", outline: "none" }} />
        <button onClick={askAgent} disabled={loading} style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.875rem", color: gold, background: "transparent", border: `1px solid ${gold}`, padding: "0.5rem 1.5rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1 }}>
          {loading ? "Thinking…" : "Send"}
        </button>
        {agentOut && <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderLeft: `2px solid ${gold}`, fontFamily: "Georgia, serif", fontSize: "0.9375rem", color: body, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{agentOut}</div>}
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.0625rem", color: gold, margin: "1.5rem 0 0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>Document Analyzer</h3>
        <input type="file" accept=".txt,.pdf,.png,.jpg,.jpeg,.webp" style={{ display: "block", margin: "0.5rem 0", fontFamily: "Georgia, serif", fontSize: "0.8125rem", color: muted }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fd = new FormData(); fd.append("file", file);
            try {
              const res = await fetch("/api/analyze-document", { method: "POST", body: fd });
              const d = await res.json();
              setAgentOut(d.summary || JSON.stringify(d));
            } catch (err: any) { setAgentOut(`Error: ${err.message}`); }
          }} />
      </section>
      {/* Lock gateway button removed */}
    </div>
  );
}