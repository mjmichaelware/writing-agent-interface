/* ==================== FILE: src/components/layers/Layer4Panel.tsx ==================== */

"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Palette, Compass, Activity, X, Sliders, Layers, FileText, Database, ShieldAlert, Sparkles, Shield } from "lucide-react";
import SystemTab from "./panel/SystemTab";

interface Layer4PanelProps {
  open: boolean;
  onClose: () => void;
  cp: any;
  chapter: number;
  setChapter: (n: number) => void;
  manuscriptRef: React.RefObject<HTMLDivElement>;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  depth: number;
  setOpen: (b: boolean) => void;
}

type Tab = "telemetry" | "emahistory" | "compendium" | "config" | "system";

export default function Layer4Panel({
  open,
  onClose,
  cp,
  chapter,
  setChapter,
  manuscriptRef,
  TITLES,
  CHAPTER_NUMS,
  depth,
  setOpen,
}: Layer4PanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("telemetry");
  const [emaData, setEmaData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated direct ingestion stream from local version-archive/ema_history.json
  useEffect(() => {
    if (open) {
      setEmaData({
        schema_version: "1.0.0",
        node_uuid: "version-archive-kernel",
        policy: "read_only_data_source",
        sync_status: "synchronized",
        last_handshake: new Date().toISOString(),
        manifestation_nodes: 181,
        active_chapter_file: `(A)Chapter_${chapter}:_${TITLES[chapter]?.replace(/^[I|V|X]+\.\s/, "").replace(/\s/g, "_") || "Unknown"}.txt`,
        revisions: [
          { id: "rev_0B7JCm9M_v10", modifiedTime: "2026-05-14T18:44:56.000Z", total_edits: 142 },
          { id: "rev_1HrWv5Jn_v10", modifiedTime: "2026-05-16T12:04:00.000Z", total_edits: 160 }
        ]
      });
    }
  }, [open, chapter, TITLES]);

  return (
    <>
      {/* IMMERSIVE NATIVE SYSTEM HEAD BAR OVERLAY */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/40 backdrop-blur-xl border-b border-cyan-500/10 select-none">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)] animate-ping" />
            <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.25em] font-bold">SINGULARITY_NOS_v10.1</p>
          </div>
          <p className="text-zinc-200 text-[10px] uppercase tracking-[0.4em] font-serif text-center flex-1 mx-4 truncate font-bold drop-shadow-md">
            {depth < 0.03 ? "THE WEIGHT OF THE SKY" : TITLES[chapter]}
          </p>
          <button 
            onClick={() => setOpen(!open)} 
            className="text-cyan-400/80 hover:text-cyan-300 transition-colors p-1.5 border border-cyan-500/10 hover:border-cyan-500/30 bg-cyan-950/10 rounded-xs active:scale-90"
          >
            <Sliders size={13} />
          </button>
        </div>
        <div className="h-[1.5px] bg-zinc-900/60 w-full relative">
          <div className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 transition-all duration-200" style={{ width: `${depth * 100}%` }} />
        </div>
      </header>

      {/* SYSTEM OPERATIONS DRAWER SCREEN CONTAINER */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end font-mono text-xs select-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" onClick={onClose} />
          
          <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-zinc-900 flex flex-col shadow-2xl shadow-black/90">
            
            {/* MAXIMUM CAPACITY DRAWER HEADER SHEET */}
            <header className="sticky top-0 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/80 z-10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-sm bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-center">
                    <Cpu size={12} className="text-cyan-400 animate-pulse" />
                  </div>
                  <h2 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">SYSTEM_OPERATIONS_DRAWER</h2>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1 rounded-xs hover:bg-zinc-900 border border-transparent hover:border-zinc-800">
                  <X size={14} />
                </button>
              </div>
              
              {/* CYBERNETIC MATRIX TAB INTERFACE STRIP */}
              <div className="flex bg-zinc-950 border border-zinc-900 rounded-2xs p-0.5 text-[8px] tracking-wider">
                {([
                  { id: "telemetry", label: "TELEMETRY", icon: Activity },
                  { id: "emahistory", label: "EMA_HISTORY", icon: Database },
                  { id: "compendium", label: "COMPENDIUM", icon: FileText },
                  { id: "config", label: "XAI_CONFIG", icon: Palette },
                  { id: "system", label: "SYSTEM", icon: Shield },
                ] as { id: Tab; label: string; icon: any }[]).map((t) => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 transition-all duration-300 rounded-2xs ${active ? "text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 font-bold shadow-inner" : "text-zinc-500 hover:text-zinc-300 border border-transparent"}`}
                    >
                      <Icon size={11} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* HIGH-DENSITY RUNTIME CONTENT SWITCHBOARD MODULES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-[11px] text-zinc-400 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/40">
              
              {activeTab === "system" && <SystemTab />}

              {/* TAB 1: RUNTIME FOCUS & SCROLL TELEMETRY MODULE */}
              {activeTab === "telemetry" && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xs space-y-2.5">
                    <p className="text-cyan-400 font-bold text-[9px] tracking-widest uppercase">// TEXT_VIEWPORT_FOCUS_MONITOR</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 bg-black/40 border border-zinc-900 rounded-2xs">
                        <span className="block opacity-40 text-[8px]">MANUSCRIPT_DEPTH</span>
                        <span className="text-zinc-200 font-bold">{(depth * 100).toFixed(2)}% Streamed</span>
                      </div>
                      <div className="p-2 bg-black/40 border border-zinc-900 rounded-2xs">
                        <span className="block opacity-40 text-[8px]">ACTIVE_CHAPTER</span>
                        <span className="text-cyan-400 font-bold">Node_0{chapter}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-cyan-950/10 border border-cyan-900/30 rounded-2xs text-zinc-300 font-sans text-xs leading-relaxed">
                      <span className="font-mono text-[9px] text-cyan-400 block mb-1 font-bold">// REAL-TIME FOCUS LOG:</span>
                      As paragraphs stream into the center of the viewport, the core layout framework isolates token positions. Dynamic word transformations (vibrations, weights, and metrics scaling) execute natively when elements land inside the active tracking envelope.
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xs space-y-3">
                    <p className="text-zinc-400 font-bold text-[9px] tracking-widest uppercase">// NARRATIVE_LANDMARK_REGISTRATIONS</p>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between p-2 bg-black/30 border border-zinc-900/60 rounded-2xs items-center">
                        <span className="font-serif italic">1. Stardust to Stardust Cover Art</span>
                        <span className="text-emerald-400 font-medium tracking-tighter">/bg.png (LOADED)</span>
                      </div>
                      <div className="flex justify-between p-2 bg-black/30 border border-zinc-900/60 rounded-2xs items-center">
                        <span className="font-serif italic">2. Chapter 7 Narrative Fly Swarm</span>
                        <span className={`${chapter === 7 ? "text-cyan-400 animate-pulse font-bold" : "text-zinc-600"}`}>flies.jpg</span>
                      </div>
                      <div className="flex justify-between p-2 bg-black/30 border border-zinc-900/60 rounded-2xs items-center">
                        <span className="font-serif italic">3. Megiddo External Gate Matrix</span>
                        <span className={`${chapter === 7 ? "text-cyan-400 font-medium" : "text-zinc-600"}`}>megiddo1.jpg</span>
                      </div>
                      <div className="flex justify-between p-2 bg-black/30 border border-zinc-900/60 rounded-2xs items-center">
                        <span className="font-serif italic">4. Megiddo Town Interior Descent</span>
                        <span className={`${chapter === 7 ? "text-cyan-400 font-medium" : "text-zinc-600"}`}>megiddo2.jpg</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EMA_HISTORY DATA STREAM LOGGER */}
              {activeTab === "emahistory" && emaData && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xs space-y-2">
                    <p className="text-cyan-500 font-bold text-[9px] tracking-widest uppercase">// FILE_METADATA_MANIFEST_HANDSHAKE</p>
                    <p>NODE_UUID: <span className="text-zinc-300">{emaData.node_uuid}</span></p>
                    <p>SCHEMA_VERSION: <span className="text-zinc-300">{emaData.schema_version}</span></p>
                    <p>ACCESS_POLICY: <span className="text-amber-500 font-medium">{emaData.policy}</span></p>
                    <p>SYNC_STATUS: <span className="text-emerald-400 font-bold">{emaData.sync_status}</span></p>
                    <p className="truncate">LOGGED_STREAM: <span className="text-zinc-300 font-sans italic">{emaData.active_chapter_file}</span></p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-bold">// VERSION_REVISION_TRACK_HISTORY</p>
                    {emaData.revisions.map((rev: any, idx: number) => (
                      <div key={idx} className="p-3 bg-black/40 border border-zinc-900 rounded-xs flex justify-between items-center">
                        <div>
                          <p className="text-zinc-200 font-bold">{rev.id}</p>
                          <p className="text-[9px] opacity-40">TIMESTAMP: {rev.modifiedTime}</p>
                        </div>
                        <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-900/40 px-2 py-0.5 rounded-2xs text-[10px] font-bold">
                          {rev.total_edits} EDITS
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: NARRATIVE COMPENDIUM LOOKUP INDEX */}
              {activeTab === "compendium" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Query corpus dictionaries..."
                      className="flex-1 bg-black/40 border border-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-700 focus:border-cyan-800 focus:outline-none rounded-xs font-mono"
                    />
                  </div>

                  <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xs space-y-3">
                    <p className="text-cyan-500 font-bold text-[9px] tracking-widest uppercase">// INGESTED_CANON_PROFILES</p>
                    
                    <div className="space-y-2.5 font-sans text-xs text-zinc-300">
                      <div className="border-b border-zinc-900 pb-2">
                        <span className="font-mono text-[9px] text-zinc-500 block font-bold">// ENTITY: DAN (PROTAGONIST)</span>
                        A sixteen-year-old dreamwalker in Hebron, 1003 BCE. Actively references structural space cells constructed of universal dust.
                      </div>
                      <div className="border-b border-zinc-900 pb-2">
                        <span className="font-mono text-[9px] text-zinc-500 block font-bold">// LANDMARK: MEGIDDO FORTRESS</span>
                        An ancient archaeological tell layered in historical strata, serving as a deep thematic nexus for conflict.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MAXIMUM CAPACITY VISUAL LOGIC OVERRIDES */}
              {activeTab === "config" && (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xs space-y-3">
                    <p className="text-cyan-400 font-bold text-[9px] tracking-widest uppercase">// XAI_PER_TOKEN_MORPHING_governance</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-black/40 border border-zinc-900 rounded-2xs">
                        <div className="flex flex-col">
                          <span className="text-zinc-200 font-sans font-medium text-xs">Kinetic Word Shaking</span>
                          <span className="text-[9px] opacity-40">Triggers animation frame CSS transforms on keywords</span>
                        </div>
                        <div className="w-8 h-4 rounded-full p-0.5 bg-cyan-600 cursor-pointer">
                          <div className="w-3 h-3 rounded-full bg-white translate-x-4 transition-transform" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-black/40 border border-zinc-900 rounded-2xs">
                        <div className="flex flex-col">
                          <span className="text-zinc-200 font-sans font-medium text-xs">Focal Variable Typography</span>
                          <span className="text-[9px] opacity-40">Alters font types and sizes fluidly near screen center</span>
                        </div>
                        <div className="w-8 h-4 rounded-full p-0.5 bg-cyan-600 cursor-pointer">
                          <div className="w-3 h-3 rounded-full bg-white translate-x-4 transition-transform" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-black/40 border border-zinc-900 rounded-2xs">
                        <div className="flex flex-col">
                          <span className="text-zinc-200 font-sans font-medium text-xs">Absolute Block Color Erasure</span>
                          <span className="text-[9px] text-emerald-400 font-bold">Active Protocol Enabled</span>
                        </div>
                        <div className="p-1 text-emerald-400">
                          <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-red-950/10 border border-red-900/20 rounded-xs flex gap-3 items-start text-zinc-400 font-sans text-[11px] leading-relaxed">
                    <ShieldAlert size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[9px] text-red-400 block font-bold uppercase mb-0.5">// ANTI_CHUNK_GUARD_ACTIVE</span>
                      Global background paragraph text overlays are explicitly restricted. Color distribution parameters are limited to individual keywords based entirely on narrative depth attributes.
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* HIGH-SPEC TERMINAL SYSTEM FOUL FOOTER ROW */}
            <footer className="sticky bottom-0 bg-black border-t border-zinc-900 p-3.5 flex justify-between items-center font-mono text-[9px] text-zinc-500">
              <span className="flex items-center gap-1.5"><Layers size={10}/> STACK_L4_NODE_OK</span>
              <span>INDEX_REF_181</span>
            </footer>

          </div>
        </div>
      )}
    </>
  );
}


