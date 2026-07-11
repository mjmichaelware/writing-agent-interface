"use client";
import { useEffect, useState } from "react";
import WritingAgentConsole from "./WritingAgentConsole";

const KEY = "nos-author-unlocked";
const gold = "#c9a96e";
const muted = "#8a857c";

export default function AuthorGateway() {
  const [unlocked, setUnlocked] = useState(false);
  const [entry, setEntry] = useState("");
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(false);
  const [restoring, setRestoring] = useState(true);

  // On mount: validate existing session cookie rather than trusting localStorage blindly.
  // If the cookie is gone (expired / new deploy), clear localStorage and show PIN form.
  useEffect(() => {
    const wasUnlocked = (() => { try { return localStorage.getItem(KEY) === "true"; } catch { return false; } })();
    if (!wasUnlocked) { setRestoring(false); return; }
    fetch("/api/auth/session")
      .then(res => {
        if (res.ok) { setUnlocked(true); }
        else { try { localStorage.removeItem(KEY); } catch {} }
      })
      .catch(() => { try { localStorage.removeItem(KEY); } catch {} })
      .finally(() => setRestoring(false));
  }, []);

  const tryUnlock = async (pin: string) => {
    if (pin.length !== 4 || checking) return;
    setChecking(true);
    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setUnlocked(true);
        setErr("");
        try { localStorage.setItem(KEY, "true"); } catch {}
      } else {
        setErr("Incorrect PIN");
        setEntry("");
        setTimeout(() => setErr(""), 1800);
      }
    } catch {
      setErr("Connection error");
      setTimeout(() => setErr(""), 2000);
    } finally {
      setChecking(false);
    }
  };

  const lock = async () => {
    setUnlocked(false);
    setEntry("");
    try { localStorage.removeItem(KEY); } catch {}
    fetch("/api/auth/pin", { method: "DELETE" }).catch(() => {});
  };

  if (restoring) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.875rem" }}>
        Restoring session…
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 0.5rem", textAlign: "center" }}>
          Author Gateway
        </h2>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, textAlign: "center", fontSize: "0.9375rem", margin: "0.5rem 0 1.5rem" }}>
          Enter operator PIN.
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={entry}
            disabled={checking}
            autoFocus
            placeholder="• • • •"
            onChange={e => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4);
              setEntry(v);
              if (v.length === 4) tryUnlock(v);
            }}
            onKeyDown={e => { if (e.key === "Enter" && entry.length === 4) tryUnlock(entry); }}
            style={{
              fontSize: "1.75rem", letterSpacing: "0.5em", textAlign: "center",
              color: checking ? muted : gold, background: "transparent",
              border: "none", borderBottom: `1px solid ${err ? "#6b2c2c" : "rgba(201,169,110,0.4)"}`,
              padding: "0.5rem 0", width: "8rem", outline: "none",
              opacity: checking ? 0.5 : 1, transition: "opacity 200ms",
            }}
          />
          {checking && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: muted, fontSize: "0.8125rem", margin: 0 }}>
              Verifying…
            </p>
          )}
          {err && (
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: "#6b2c2c", fontSize: "0.8125rem", margin: 0 }}>
              {err}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <WritingAgentConsole />
      <div style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "1rem" }}>
        <button
          onClick={lock}
          style={{
            fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem",
            color: muted, background: "transparent", border: `1px solid rgba(138,133,124,0.2)`,
            cursor: "pointer", padding: "0.4rem 1.25rem",
            transition: "all 200ms",
          }}
        >
          Lock gateway
        </button>
      </div>
    </div>
  );
}
