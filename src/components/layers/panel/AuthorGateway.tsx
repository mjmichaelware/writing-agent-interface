"use client";
import { useEffect, useState } from "react";
import WritingAgentConsole from "./WritingAgentConsole";

const PIN = process.env.NEXT_PUBLIC_AUTHOR_PIN || "9187";
const KEY = "nos-author-unlocked";
const gold = "#c9a96e";
const muted = "#8a857c";

export default function AuthorGateway() {
  const [unlocked, setUnlocked] = useState(false);
  const [entry, setEntry] = useState("");
  const [err, setErr] = useState("");

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

  const lock = () => {
    setUnlocked(false); setEntry("");
    try { localStorage.removeItem(KEY); } catch {}
  };

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
      <WritingAgentConsole />
      <button onClick={lock} style={{ display: "block", margin: "2rem auto 0", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted, background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem 1rem" }}>
        Lock gateway
      </button>
    </div>
  );
}
