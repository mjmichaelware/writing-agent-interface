"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Eye, Ear, Search, Layers, Database, Type } from "lucide-react";
import { getRuntime } from "@/runtime/runtimeContext";
import { initAudioListener } from "@/features/audioListener";
import { initDistortionListener } from "@/features/distortionListener";
import { initThematicListener } from "@/features/thematicListener";

type EventLogEntry = { ts: number; event: string; payload: any };
type RuntimeState = { chapter: number; blockIndex: number; mode: "safe" | "cinematic" };

const SAMPLE = "The last rays of the sun, the color of old blood and bruised fruit, were staining the sky behind him as Dan approached the gates of Megiddo.";

const TAG_RULES = {
  descent: ["blood","pit","dark","fallen","descent","death","shadow","cold","old","bruised","staining"],
  sacred: ["lord","sky","sun","light","rays","gates"],
  proper: ["Dan","Megiddo","Hebron","Sak","Aviel","Bethlehem","Dagon","Izabel"],
};

function classifyWord(word: string) {
  const clean = word.replace(/[^a-zA-Z]/g, "");
  const lower = clean.toLowerCase();
  if (TAG_RULES.proper.includes(clean)) return { color: "#f59e0b", theme: "proper", intensity: 0.9, weight: "600" };
  if (TAG_RULES.descent.includes(lower)) return { color: "#b91c1c", theme: "descent", intensity: 1.0, weight: "500" };
  if (TAG_RULES.sacred.includes(lower)) return { color: "#34d399", theme: "sacred", intensity: 0.7, weight: "500" };
  return { color: "#e4e4e7", theme: "baseline", intensity: 0.3, weight: "400" };
}

function Panel({ title, icon: Icon, status, children }: { title: string; icon: any; status?: "live"|"partial"|"simulated"; children: React.ReactNode }) {
  const colors = {
    live: "text-emerald-400 border-emerald-800/40 bg-emerald-950/30",
    partial: "text-amber-400 border-amber-800/40 bg-amber-950/30",
    simulated: "text-cyan-400 border-cyan-800/40 bg-cyan-950/30",
  };
  return (
    <section className="border border-zinc-900 bg-zinc-950/60">
      <header className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-300">
          <Icon size={14} />
          <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold font-sans">{title}</h2>
        </div>
        {status && <span className={`text-[8px] uppercase tracking-widest px-2 py-1 border font-sans ${colors[status]}`}>{status}</span>}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function RuntimePage() {
  const { bus, engine } = getRuntime();
  const [state, setState] = useState<RuntimeState>(engine.getState());
  const [log, setLog] = useState<EventLogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const [audio, setAudio] = useState({ tone: "—", intensity: 0, volume: 0.3, depth: 0 });
  const [dist, setDist] = useState({ intensity: 0.3, warp: 0, depth: 0 });
  const [theme, setTheme] = useState({ chapter: 7, overlay: "BASELINE_NARRATIVE" });
  const [gray, setGray] = useState(0.4);
  const [contrast, setContrast] = useState(1.2);
  const [bright, setBright] = useState(0.7);
  const [blur, setBlur] = useState(0);
  const [showTags, setShowTags] = useState(true);
  const [showIndent, setShowIndent] = useState(true);
  const [showDescent, setShowDescent] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [sMeta, setSMeta] = useState({ normalized: "", count: 0 });

  useEffect(() => {
    initAudioListener(bus);
    initDistortionListener(bus);
    initThematicListener(bus);
  }, [bus]);

  useEffect(() => {
    const onScroll = (d: any) => {
      const depth = d?.depth ?? 0;
      setAudio(a => ({ ...a, volume: Math.min(1, 0.3 + depth * 0.15), depth }));
      setDist(x => ({ ...x, warp: depth * 0.1, depth }));
      setLog(l => [...l.slice(-49), { ts: Date.now(), event: "scroll:update", payload: d }]);
    };
    const onBlock = (d: any) => {
      const tone = d?.tone || "baseline";
      const ai = tone === "sacred" ? 0.8 : tone === "intense" ? 1.0 : 0.4;
      const di = tone === "intense" ? 1 : tone === "sacred" ? 0.7 : 0.3;
      setAudio(a => ({ ...a, tone, intensity: ai }));
      setDist(x => ({ ...x, intensity: di }));
      setLog(l => [...l.slice(-49), { ts: Date.now(), event: "block:render", payload: d }]);
    };
    const onChapter = (d: any) => {
      setTheme(t => ({ ...t, chapter: d?.id ?? t.chapter }));
      setLog(l => [...l.slice(-49), { ts: Date.now(), event: "chapter:load", payload: d }]);
    };
    const onStateChange = (d: any) => {
      setState({ chapter: d.chapter, blockIndex: d.blockIndex, mode: d.mode });
      setTheme(t => ({ ...t, overlay: d.mode === "cinematic" ? "MYTHIC_OVERLAY" : "BASELINE_NARRATIVE" }));
      setLog(l => [...l.slice(-49), { ts: Date.now(), event: "state:change", payload: d }]);
    };
    bus.on("scroll:update", onScroll);
    bus.on("block:render", onBlock);
    bus.on("chapter:load", onChapter);
    bus.on("state:change", onStateChange);
    return () => {
      bus.off("scroll:update", onScroll);
      bus.off("block:render", onBlock);
      bus.off("chapter:load", onChapter);
      bus.off("state:change", onStateChange);
    };
  }, [bus]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const depth = max > 0 ? doc.scrollTop / max : 0;
      bus.emit("scroll:update", { depth });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [bus]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const runSearch = useCallback(async () => {
    if (!term.trim()) return;
    const normalized = term.normalize("NFC").toLocaleLowerCase();
    setSMeta({ normalized, count: 0 });
    try {
      const r = await fetch(`/api/search?term=${encodeURIComponent(term)}`);
      const d = await r.json();
      const rs = d.results || [];
      setResults(rs);
      setSMeta({ normalized, count: rs.length });
    } catch { setResults([]); }
  }, [term]);

  const words = SAMPLE.split(/(\s+)/);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-cyan-500 flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to OS
          </Link>
          <h1 className="text-white uppercase tracking-[0.4em] text-[11px] font-bold">Runtime Audit</h1>
          <div className="text-[9px] text-zinc-600 tabular-nums">{log.length} events</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4 pb-24">

        <Panel title="Nervous System · EventBus + RuntimeEngine" icon={Activity} status="live">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-black/40 border border-zinc-800 p-3">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Chapter</p>
              <p className="text-2xl text-cyan-400 font-light tabular-nums">{state.chapter}</p>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-3">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Block</p>
              <p className="text-2xl text-cyan-400 font-light tabular-nums">{state.blockIndex}</p>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-3">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Mode</p>
              <p className="text-sm text-cyan-400 font-light uppercase">{state.mode}</p>
            </div>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2">Dispatch commands</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => engine.dispatch({ type: "SET_CHAPTER", payload: state.chapter + 1 })} className="bg-zinc-900 hover:bg-cyan-900 border border-zinc-800 p-2 text-[10px] uppercase tracking-widest transition-all">SET_CHAPTER +1</button>
            <button onClick={() => engine.dispatch({ type: "SET_CHAPTER", payload: Math.max(1, state.chapter - 1) })} className="bg-zinc-900 hover:bg-cyan-900 border border-zinc-800 p-2 text-[10px] uppercase tracking-widest transition-all">SET_CHAPTER -1</button>
            <button onClick={() => engine.dispatch({ type: "SET_MODE", payload: state.mode === "cinematic" ? "safe" : "cinematic" })} className="bg-zinc-900 hover:bg-cyan-900 border border-zinc-800 p-2 text-[10px] uppercase tracking-widest transition-all">TOGGLE MODE</button>
            <button onClick={() => engine.dispatch({ type: "ADVANCE_BLOCK", payload: 1 })} className="bg-zinc-900 hover:bg-cyan-900 border border-zinc-800 p-2 text-[10px] uppercase tracking-widest transition-all">ADVANCE_BLOCK</button>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-2">Event stream</p>
          <div ref={logRef} className="bg-black border border-zinc-900 h-48 overflow-y-auto p-2 font-mono text-[10px] leading-tight scrollbar-hide">
            {log.length === 0 ? (
              <p className="text-zinc-700 italic">Listening for neural activity...</p>
            ) : log.map((e, i) => {
              const time = new Date(e.ts).toLocaleTimeString();
              const color = { "scroll:update": "text-cyan-500", "block:render": "text-amber-400", "chapter:load": "text-emerald-400", "state:change": "text-fuchsia-400" }[e.event] || "text-zinc-400";
              return (
                <div key={i} className="flex gap-2 mb-0.5">
                  <span className="text-zinc-700 shrink-0">{time}</span>
                  <span className={`${color} shrink-0`}>{e.event}</span>
                  <span className="text-zinc-500 truncate">{JSON.stringify(e.payload)}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Sensory Listeners · Audio / Distortion / Thematic" icon={Ear} status="live">
          <div className="space-y-3">
            <div className="bg-black/40 border border-zinc-800 p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Audio Listener</p>
                <p className="text-[9px] text-zinc-500">tone: <span className="text-amber-400">{audio.tone}</span></p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                {[
                  { label: "Intensity", v: audio.intensity },
                  { label: "Volume", v: audio.volume },
                  { label: "Depth", v: audio.depth },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-zinc-500 mb-1">{m.label}</p>
                    <div className="h-1 bg-zinc-900"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${m.v * 100}%` }} /></div>
                    <p className="text-zinc-300 tabular-nums mt-1">{m.v.toFixed(3)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-3">
              <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2">Distortion Listener</p>
              <p className="text-[9px] text-zinc-500 mb-2">Live warp on sample text:</p>
              <p className="text-base text-zinc-200 transition-all" style={{
                filter: `blur(${dist.intensity * dist.warp * 8}px)`,
                letterSpacing: `${dist.warp * 2}px`,
              }}>old blood bruised fruit</p>
            </div>
            <div className="bg-black/40 border border-zinc-800 p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase tracking-widest text-fuchsia-400 font-bold">Thematic Listener</p>
                <p className="text-[9px] text-zinc-500">chapter: <span className="text-emerald-400 tabular-nums">{theme.chapter}</span></p>
              </div>
              <div className="inline-block px-3 py-2 border" style={{
                borderColor: theme.overlay === "MYTHIC_OVERLAY" ? "#f59e0b" : "#3f3f46",
                color: theme.overlay === "MYTHIC_OVERLAY" ? "#f59e0b" : "#a1a1aa",
                background: theme.overlay === "MYTHIC_OVERLAY" ? "rgba(245,158,11,0.1)" : "rgba(0,0,0,0.4)",
              }}>
                <p className="text-[10px] uppercase tracking-widest font-bold tracking-[0.2em]">{theme.overlay}</p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Brain · Hybrid Search across 181 Nodes" icon={Search} status="live">
          <div className="flex gap-2 mb-3">
            <input type="text" value={term} onChange={(e) => setTerm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} placeholder="Megiddo, Dagon, Sak, blood…" className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-cyan-700 focus:outline-none" />
            <button onClick={runSearch} className="bg-cyan-900 hover:bg-cyan-800 px-4 text-[10px] uppercase tracking-widest font-bold transition-all">Search</button>
          </div>
          {sMeta.normalized && (
            <div className="mb-3 text-[10px] grid grid-cols-2 gap-2">
              <div className="bg-black/40 border border-zinc-800 p-2">
                <p className="text-zinc-500 mb-1">NFC normalized</p>
                <p className="text-cyan-400 font-mono break-all">"{sMeta.normalized}"</p>
              </div>
              <div className="bg-black/40 border border-zinc-800 p-2">
                <p className="text-zinc-500 mb-1">Top-5 throttle</p>
                <p className="text-cyan-400 tabular-nums">{sMeta.count} / 5 max</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {results.map((r: any, i) => (
              <div key={i} className="bg-black/40 border border-zinc-800 p-3">
                <p className="text-[9px] text-cyan-500 uppercase tracking-widest mb-1 font-mono break-all">{r.file}</p>
                <p className="text-[11px] text-zinc-300 leading-relaxed">{r.snippet}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="EMA / DNA · Word-Level Tagging" icon={Type} status="simulated">
          <div className="flex gap-2 mb-3 text-[10px] flex-wrap">
            <button onClick={() => setShowTags(!showTags)} className={`px-3 py-1.5 border transition-all ${showTags ? "bg-cyan-900 border-cyan-700" : "bg-zinc-900 border-zinc-800"}`}>Tags {showTags ? "ON" : "OFF"}</button>
            <button onClick={() => setShowIndent(!showIndent)} className={`px-3 py-1.5 border transition-all ${showIndent ? "bg-cyan-900 border-cyan-700" : "bg-zinc-900 border-zinc-800"}`}>Indent {showIndent ? "ON" : "OFF"}</button>
            <button onClick={() => setShowDescent(!showDescent)} className={`px-3 py-1.5 border transition-all ${showDescent ? "bg-red-900 border-red-700" : "bg-zinc-900 border-zinc-800"}`}>Descent {showDescent ? "ON" : "OFF"}</button>
          </div>
          <div className="bg-black/40 border border-zinc-800 p-4 overflow-hidden">
            <p className={`text-lg leading-relaxed ${showDescent ? "text-red-700" : "text-zinc-200"}`} style={{ textIndent: showIndent ? "4rem" : "0" }}>
              {words.map((w, i) => {
                if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
                if (!showTags) return <span key={i}>{w}</span>;
                const tag = classifyWord(w);
                return <span key={i} title={`${tag.theme}`} style={{ color: tag.color, fontWeight: tag.weight }}>{w}</span>;
              })}
            </p>
          </div>
        </Panel>

        <Panel title="Cinema Layer · Live Filter Controls" icon={Eye} status="live">
          <div className="aspect-video bg-black border border-zinc-800 overflow-hidden mb-4 relative">
             <img src="/assets/bg.png" alt="" className="w-full h-full object-cover" style={{
              filter: `grayscale(${gray}) contrast(${contrast}) brightness(${bright}) blur(${blur}px)`,
            }} />
          </div>
          <div className="space-y-3 text-[10px]">
            {[
              { label: "Grayscale", v: gray, set: setGray, min: 0, max: 1, step: 0.05 },
              { label: "Contrast", v: contrast, set: setContrast, min: 0.5, max: 2, step: 0.05 },
              { label: "Brightness", v: bright, set: setBright, min: 0, max: 1.5, step: 0.05 },
              { label: "Blur (px)", v: blur, set: setBlur, min: 0, max: 20, step: 0.5 },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-500 uppercase">{s.label}</span>
                  <span className="text-cyan-400 tabular-nums">{s.v.toFixed(2)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.v} onChange={(e) => s.set(parseFloat(e.target.value))} className="w-full accent-cyan-600" />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Z-Hierarchy · Four-Layer Architecture" icon={Layers} status="live">
          <div className="relative h-64 border border-zinc-800 bg-black overflow-hidden">
            <div className="absolute inset-0 bg-black flex items-end p-2">
              <p className="text-[9px] text-zinc-700 font-mono uppercase tracking-widest">Z-0 · Void</p>
            </div>
            <div className="absolute inset-4 bg-gradient-to-b from-zinc-900/80 to-red-950/30 border border-cyan-900/40 flex items-end p-2">
              <p className="text-[9px] text-cyan-700 font-mono uppercase tracking-widest">Z-10 · Cinema</p>
            </div>
            <div className="absolute inset-12 bg-zinc-950/70 border border-amber-900/40 flex items-end p-2 backdrop-blur-[1px]">
              <p className="text-[9px] text-amber-600 font-mono uppercase tracking-widest">Z-20 · Manuscript</p>
            </div>
            <div className="absolute top-10 right-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-700 px-3 py-2">
              <p className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">Z-40 · HUD</p>
            </div>
            <div className="absolute top-24 right-3 bg-cyan-950 border border-cyan-700 px-3 py-2 shadow-2xl">
              <p className="text-[9px] text-cyan-300 font-mono font-bold uppercase tracking-widest">Z-50 · Control</p>
            </div>
          </div>
        </Panel>

        <div className="text-center py-8 text-[9px] text-zinc-700 uppercase tracking-widest border-t border-zinc-900 mt-10">
          Singularity Runtime Audit · Michael Alonza P. Ware
        </div>
      </main>
    </div>
  );
}
