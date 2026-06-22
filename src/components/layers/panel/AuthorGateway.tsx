"use client";
import { useEffect, useState } from "react";

const KEY = "nos-author-unlocked"; // Use KEY for local storage, not for storing the PIN
const muted = "#8a857c";
const gold = "#c9a96e";
const body = "#e8e4dc";

export default function AuthorGateway() {
  const [unlocked, setUnlocked] = useState(false); // Start locked
  const [entry, setEntry] = useState("");
  const [err, setErr] = useState("");
  const [agentIn, setAgentIn] = useState("");
  const [agentOut, setAgentOut] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem(KEY) === "true") setUnlocked(true); } catch {}
  }, []);

  const tryUnlock = async (v: string) => {
    if (v.length === 4) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth-pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: v }),
        });
        const data = await res.json();
        if (data.success) {
          setUnlocked(true);
          setErr("");
          try { localStorage.setItem(KEY, "true"); } catch {}
        } else {
          setErr("Incorrect");
          setEntry(""); // Clear entry on incorrect PIN
          setTimeout(() => setErr(""), 1500);
        }
      } catch (e: any) {
        setErr(`Error: ${e.message}`);
        setTimeout(() => setErr(""), 1500);
      } finally {
        setLoading(false);
      }
    }
  };

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

  if (!unlocked) {
    return (
      <div>
        <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.5rem", textAlign: "center" }}>Author Gateway</h2>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, textAlign: "center", fontSize: "0.9375rem", margin: "0.5rem 0" }}>Enter operator PIN.</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
          <input type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={4}
            value={entry}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
              setEntry(v); // Update entry first
              tryUnlock(v); // Then try to unlock
            }}
            autoFocus placeholder="• • • •"
            disabled={loading} // Disable input while loading
            style={{ fontSize: "1.75rem", letterSpacing: "0.5em", textAlign: "center", color: gold, background: "transparent", border: "none", borderBottom: "1px solid rgba(201,169,110,0.4)", padding: "0.5rem 0", width: "8rem", outline: "none" }} />
          {err && <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#6b2c2c", fontSize: "0.8125rem", margin: 0 }}>{err}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.5rem", textAlign: "center" }}>Author Gateway</h2>
      <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: gold, textAlign: "center", fontSize: "0.9375rem", margin: "0.5rem 0" }}>Operator Active</p> {/* Telemetry Online removed */}
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
      <button onClick={() => { setUnlocked(false); setEntry(""); try { localStorage.removeItem(KEY); } catch {} }} style={{ display: "block", margin: "2rem auto 0", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted, background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem 1rem" }}>Lock gateway</button>
    </div>
  );
}