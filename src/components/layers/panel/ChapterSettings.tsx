"use client";
import { useEffect, useRef, useState } from "react";

type Settings = {
  typeSize: number; lineHeight: number; sensitivity: number;
  color: number; distortion: number; blur: number;
  contrast: number; warmth: number;
  fontFamily: "serif" | "sans" | "mono";
  motion: boolean; bionic: boolean; audio: boolean;
};

const DEFAULTS: Settings = {
  typeSize: 1, lineHeight: 1.7, sensitivity: 0.5,
  color: 0.25, distortion: 0.15, blur: 0.15,
  contrast: 1, warmth: 0.25,
  fontFamily: "serif", motion: true, bionic: false, audio: false,
};
const KEY = "nos-reader-physics-v1";

function applyToRoot(s: Settings) {
  const r = document.documentElement.style;
  r.setProperty("--reader-font-scale", String(s.typeSize));
  r.setProperty("--reader-line-height", String(s.lineHeight));
  r.setProperty("--reader-sensitivity", String(s.sensitivity));
  r.setProperty("--reader-color-shift", String(s.color));
  r.setProperty("--reader-distortion", String(s.distortion));
  r.setProperty("--reader-blur", String(s.blur));
  r.setProperty("--reader-contrast", String(s.contrast));
  r.setProperty("--reader-warmth", String(s.warmth));
  r.setProperty("--reader-font-family", 
    s.fontFamily === "serif" ? "var(--font-prose)" :
    s.fontFamily === "sans"  ? "system-ui, sans-serif" :
                                "ui-monospace, monospace");
  document.body.dataset.motion = s.motion ? "on" : "off";
  document.body.dataset.bionic = s.bionic ? "on" : "off";
  document.body.dataset.audio = s.audio ? "on" : "off";
  r.setProperty("--audio-enabled", s.audio ? "1" : "0");
}

export default function ChapterSettings() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const init = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
      setS(init); applyToRoot(init);
    } catch { applyToRoot(DEFAULTS); }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    applyToRoot(s);
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }, [s]);

  const setField = <K extends keyof Settings>(k: K, v: Settings[K]) => 
    setS(prev => ({ ...prev, [k]: v }));
  const reset = () => setS(DEFAULTS);

  const Slider = ({ label, k, min, max, step }: 
    { label: string; k: keyof Settings; min: number; max: number; step: number }) => (
    <label className="reader-control">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step}
        value={s[k] as number}
        onChange={e => setField(k, parseFloat(e.target.value) as any)} />
    </label>
  );

  return (
    <div>
      <h2 className="panel-heading">Chapter Settings</h2>
      <div className="reader-controls-grid">
        <Slider label="Type Size"    k="typeSize"    min={0.85} max={1.45} step={0.01} />
        <Slider label="Line Height"  k="lineHeight"  min={1.35} max={2.2}  step={0.01} />
        <Slider label="Sensitivity"  k="sensitivity" min={0}    max={1}    step={0.01} />
        <Slider label="Color"        k="color"       min={0}    max={1}    step={0.01} />
        <Slider label="Distortion"   k="distortion"  min={0}    max={1}    step={0.01} />
        <Slider label="Blur"         k="blur"        min={0}    max={1}    step={0.01} />
        <Slider label="Contrast"     k="contrast"    min={0.75} max={1.5}  step={0.01} />
        <Slider label="Warmth"       k="warmth"      min={0}    max={0.75} step={0.01} />
      </div>
      <div className="reader-pills">
        {(["serif", "sans", "mono"] as const).map(f => (
          <button key={f}
            onClick={() => setField("fontFamily", f)}
            className={`reader-pill ${s.fontFamily === f ? "active" : ""}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="reader-toggles">
        <button onClick={() => setField("motion", !s.motion)}
          className={`reader-toggle ${s.motion ? "on" : ""}`}>
          Motion {s.motion ? "on" : "off"}
        </button>
        <button onClick={() => setField("bionic", !s.bionic)}
          className={`reader-toggle ${s.bionic ? "on" : ""}`}>
          Bionic {s.bionic ? "on" : "off"}
        </button>
        <button onClick={() => setField("audio", !s.audio)}
          className={`reader-toggle ${s.audio ? "on" : ""}`}>
          Listen {s.audio ? "on" : "off"}
        </button>
      </div>
      <button onClick={reset} className="reader-reset">Reset</button>
    </div>
  );
}