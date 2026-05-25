"use client";
import { useEffect, useState } from "react";

const PIN = "1003";
const KEY = "nos-author-unlocked";

export default function AuthorGateway() {
  const [unlocked, setUnlocked] = useState(false);
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");
  const [agentInput, setAgentInput] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [agentLoading, setAgentLoading] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "true") setUnlocked(true);
    } catch {}
  }, []);

  const tryUnlock = (val: string) => {
    if (val === PIN) {
      setUnlocked(true); setError("");
      try { localStorage.setItem(KEY, "true"); } catch {}
    } else if (val.length === 4) {
      setError("Incorrect"); setEntry("");
      setTimeout(() => setError(""), 1500);
    }
  };

  const lock = () => {
    setUnlocked(false); setEntry("");
    try { localStorage.removeItem(KEY); } catch {}
  };

  const askAgent = async () => {
    if (!agentInput.trim()) return;
    setAgentLoading(true); setAgentResponse("");
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: agentInput }),
      });
      const data = await res.json();
      setAgentResponse(data.response || data.text || JSON.stringify(data));
    } catch (e: any) {
      setAgentResponse(`Error: ${e.message}`);
    } finally { setAgentLoading(false); }
  };

  if (!unlocked) {
    return (
      <div>
        <h2 className="panel-heading">Author Gateway</h2>
        <p className="gateway-prose">Enter operator PIN to proceed.</p>
        <div className="gateway-pin-wrap">
          <input
            type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={4}
            value={entry}
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
              setEntry(v); tryUnlock(v);
            }}
            autoFocus className="gateway-pin-input"
            placeholder="• • • •"
          />
          {error && <p className="gateway-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="panel-heading">Author Gateway</h2>
      <p className="gateway-status">Operator Active · Telemetry Online</p>
      
      <section style={{ marginTop: "1.5rem" }}>
        <h3 className="panel-section-heading">Writing Agent</h3>
        <textarea
          value={agentInput}
          onChange={e => setAgentInput(e.target.value)}
          placeholder="Ask the swarm about the manuscript…"
          className="gateway-textarea" rows={3}
        />
        <button onClick={askAgent} disabled={agentLoading}
          className="gateway-button">
          {agentLoading ? "Thinking…" : "Send"}
        </button>
        {agentResponse && <div className="gateway-response">{agentResponse}</div>}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3 className="panel-section-heading">Document Analyzer</h3>
        <p className="gateway-prose">
          Upload affordance — POSTs to /api/analyze-document
        </p>
        <input type="file" 
          accept=".txt,.pdf,.png,.jpg,.jpeg,.webp"
          className="gateway-fileinput"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fd = new FormData();
            fd.append("file", file);
            try {
              const res = await fetch("/api/analyze-document", { 
                method: "POST", body: fd 
              });
              const d = await res.json();
              setAgentResponse(d.summary || JSON.stringify(d));
            } catch (err: any) {
              setAgentResponse(`Error: ${err.message}`);
            }
          }} />
      </section>

      <button onClick={lock} className="gateway-lock">Lock gateway</button>
    </div>
  );
}