"use client";
import { useEffect, useRef, useState } from "react";

type S = { typeSize: number; lineHeight: number; sensitivity: number; color: number; distortion: number; blur: number; contrast: number; warmth: number; motion: boolean; bionic: boolean; audio: boolean };
const D: S = { typeSize: 1, lineHeight: 1.7, sensitivity: 0.5, color: 0.25, distortion: 0.15, blur: 0.15, contrast: 1, warmth: 0.25, motion: true, bionic: false, audio: false };
const KEY = "nos-reader-physics-v1";

function apply(s: S) {
  const r = document.documentElement.style;
  r.setProperty("--reader-font-scale", String(s.typeSize));
  r.setProperty("--reader-line-height", String(s.lineHeight));
  r.setProperty("--reader-sensitivity", String(s.sensitivity));
  r.setProperty("--reader-color-shift", String(s.color));
  r.setProperty("--reader-distortion", String(s.distortion));
  r.setProperty("--reader-blur", String(s.blur));
  r.setProperty("--reader-contrast", String(s.contrast));
  r.setProperty("--reader-warmth", String(s.warmth));
}

const muted = "#8a857c";
const gold = "#c9a96e";

export default function ChapterSettings() {
  const [s, setS] = useState<S>(D);
  const loaded = useRef(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); const init = raw ? { ...D, ...JSON.parse(raw) } : D; setS(init); apply(init); }
    catch { apply(D); }
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    apply(s);
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }, [s]);
  const set = <K extends keyof S>(k: K, v: S[K]) => setS(p => ({ ...p, [k]: v }));
  const slider = (label: string, k: keyof S, min: number, max: number, step: number) => (
    <label key={k as string} style={{ display: "flex", flexDirection: "column", gap: "0.375rem", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted }}>
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={s[k] as number}
        onChange={e => set(k, parseFloat(e.target.value) as any)}
        style={{ width: "100%", accentColor: gold }} />
    </label>
  );

  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "1.5rem", color: gold, margin: "0 0 1rem", textAlign: "center" }}>Chapter Settings</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem 1.25rem", marginBottom: "1.5rem" }}>
        {slider("Type Size","typeSize",0.85,1.45,0.01)}
        {slider("Line Height","lineHeight",1.35,2.2,0.01)}
        {slider("Sensitivity","sensitivity",0,1,0.01)}
        {slider("Color","color",0,1,0.01)}
        {slider("Distortion","distortion",0,1,0.01)}
        {slider("Blur","blur",0,1,0.01)}
        {slider("Contrast","contrast",0.75,1.5,0.01)}
        {slider("Warmth","warmth",0,0.75,0.01)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {(["motion","bionic","audio"] as const).map(t => (
          <button key={t} onClick={() => set(t, !s[t])} style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.8125rem", color: s[t] ? gold : muted, background: "transparent", border: `1px solid ${s[t] ? gold : "rgba(201,169,110,0.2)"}`, padding: "0.5rem 1.25rem", cursor: "pointer", textTransform: "capitalize" }}>
            {t} {s[t] ? "on" : "off"}
          </button>
        ))}
      </div>
      <button onClick={() => setS(D)} style={{ display: "block", margin: "0 auto", fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.75rem", color: muted, background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem 1rem" }}>Reset</button>
    </div>
  );
}