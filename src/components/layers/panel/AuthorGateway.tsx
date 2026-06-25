"use client";
import { useEffect, useState } from "react";
import { bus } from "@/core/runtimeEngine";

const PIN = "9187";
const KEY = "nos-author-unlocked";
const CHAPTERS = [
  { n: 1,  title: "Stardust to Stardust" },
  { n: 2,  title: "Living Sacrifice" },
  { n: 3,  title: "Lift Up" },
  { n: 4,  title: "Pilgrimage" },
  { n: 5,  title: "The Snare" },
  { n: 6,  title: "Beelzebub Beelzebub" },
  { n: 7,  title: "The Pit" },
  { n: 8,  title: "Sea People" },
  { n: 9,  title: "The Ascent" },
  { n: 10, title: "Forsaken" },
  { n: 11, title: "Forsaken (II)" },
  { n: 13, title: "Exodus" },
];

type Source = "db" | "txt" | "drive";
const SRC_LABEL: Record<Source, string> = { db: "Database", txt: "Text File", drive: "Google Drive" };
const SRC_NEXT: Record<Source, Source>  = { db: "txt", txt: "drive", drive: "db" };

function PinPad({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState<string[]>([]);
  const [shake, setShake]   = useState(false);

  const press = (d: string) => {
    if (digits.length >= 4) return;
    const next = [...digits, d];
    setDigits(next);
    if (next.length === 4) {
      if (next.join("") === PIN) {
        try { localStorage.setItem(KEY, "true"); } catch {}
        onUnlock();
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setDigits([]); }, 600);
      }
    }
  };

  return (
    <div className="gw-pin-screen">
      <div className="gw-pin-title">Author Gateway</div>
      <div className="gw-pin-sub">Enter operator code</div>
      <div className={`gw-pin-dots${shake ? " shake" : ""}`}>
        {[0,1,2,3].map(i => (
          <div key={i} className={`gw-pin-dot${i < digits.length ? " filled" : ""}`} />
        ))}
      </div>
      <div className="gw-pin-grid">
        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
          <button
            key={i}
            className={`gw-pin-key${k === "" ? " invisible" : ""}`}
            onClick={() => k === "⌫" ? setDigits(d => d.slice(0,-1)) : k ? press(k) : undefined}
          >{k}</button>
        ))}
      </div>
    </div>
  );
}

export default function AuthorGateway() {
  const [unlocked, setUnlocked]           = useState(false);
  const [tab, setTab]                     = useState<"control"|"write"|"agent"|"drive">("control");
  const [activeChapter, setActiveChapter] = useState(1);
  const [sources, setSources]             = useState<Record<number,Source>>({});
  const [driveFiles, setDriveFiles]       = useState<any[]>([]);
  const [driveMap, setDriveMap]           = useState<Record<number,string>>({});
  const [driveLoading, setDriveLoading]   = useState(false);
  const [driveFetched, setDriveFetched]   = useState(false);
  const [writeContent, setWriteContent]   = useState("");
  const [writeSaving, setWriteSaving]     = useState(false);
  const [agentIn, setAgentIn]             = useState("");
  const [agentOut, setAgentOut]           = useState("");
  const [agentLoading, setAgentLoading]   = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem(KEY) === "true") setUnlocked(true); } catch {}
    try {
      const s = localStorage.getItem("nos-chapter-sources");
      if (s) setSources(JSON.parse(s));
      const m = localStorage.getItem("nos-drive-chapter-map");
      if (m) setDriveMap(JSON.parse(m));
    } catch {}
  }, []);

  // Track active chapter from reader scroll
  useEffect(() => {
    const unsub = bus.on("scroll:focus", (d: any) => {
      const n = parseInt(d.chapterSlug || "1");
      if (n > 0) setActiveChapter(n);
    });
    return unsub;
  }, []);

  const setSource = (n: number, src: Source) => {
    const next = { ...sources, [n]: src };
    setSources(next);
    try { localStorage.setItem("nos-chapter-sources", JSON.stringify(next)); } catch {}
    bus.emit("chapter:set", { chapterNumber: n, source: src });
  };

  const loadChapter = (n: number) => {
    bus.emit("chapter:set", { chapterNumber: n, source: sources[n] || "db" });
    bus.emit("panel:close");
  };

  const fetchDrive = async () => {
    setDriveLoading(true);
    try {
      const res = await fetch("/api/gdrive");
      if (res.ok) { const d = await res.json(); setDriveFiles(d.files || []); setDriveFetched(true); }
    } catch {}
    setDriveLoading(false);
  };

  const assignDrive = (n: number, fileId: string) => {
    const next = { ...driveMap, [n]: fileId };
    setDriveMap(next);
    try { localStorage.setItem("nos-drive-chapter-map", JSON.stringify(next)); } catch {}
  };

  const askAgent = async () => {
    if (!agentIn.trim()) return;
    setAgentLoading(true); setAgentOut("");
    try {
      const res = await fetch("/api/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: agentIn }) });
      const d = await res.json();
      setAgentOut(d.response || d.text || d.result || JSON.stringify(d));
    } catch (e: any) { setAgentOut(`Error: ${e.message}`); }
    setAgentLoading(false);
  };

  const lock = () => {
    setUnlocked(false);
    try { localStorage.removeItem(KEY); } catch {}
  };

  if (!unlocked) return <PinPad onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="gw-console">
      <nav className="gw-subnav">
        {(["control","write","agent","drive"] as const).map(t => (
          <button key={t} className={`gw-subnav-btn${tab===t?" active":""}`} onClick={() => setTab(t)}>
            {t === "control" ? "Chapters" : t === "write" ? "Write" : t === "agent" ? "Agent" : "Drive"}
          </button>
        ))}
        <button className="gw-lock-btn" onClick={lock}>lock</button>
      </nav>

      {/* ── CHAPTER CONTROL ── */}
      {tab === "control" && (
        <div className="gw-chapter-list">
          <div className="gw-section-label">
            Reader Control · currently on chapter <em>{activeChapter}</em>
          </div>
          {CHAPTERS.map(({ n, title }) => {
            const src: Source = sources[n] || "db";
            const isActive = activeChapter === n;
            return (
              <div key={n} className={`gw-chapter-row${isActive ? " active" : ""}`}>
                <button className="gw-chapter-load" onClick={() => loadChapter(n)}>
                  <span className="gw-ch-num">{String(n).padStart(2,"0")}</span>
                  <span className="gw-ch-title">{title}</span>
                  {isActive && <span className="gw-active-pip" />}
                </button>
                <button
                  className={`gw-src-badge gw-src-${src}`}
                  onClick={() => setSource(n, SRC_NEXT[src])}
                  title="Click to cycle data source"
                >{SRC_LABEL[src]}</button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── WRITE ── */}
      {tab === "write" && (
        <div className="gw-write-panel">
          <div className="gw-section-label">Writing Studio · Chapter {activeChapter}</div>
          <textarea
            className="gw-write-area"
            value={writeContent}
            onChange={e => setWriteContent(e.target.value)}
            placeholder={`Begin writing Chapter ${activeChapter}…\n\nThis drafting space accepts free prose. Use Agent tab for AI assistance.`}
            spellCheck
          />
          <div className="gw-write-footer">
            <span className="gw-char-count">{writeContent.length.toLocaleString()} chars</span>
            <button className="gw-action-btn" onClick={async () => { setWriteSaving(true); await new Promise(r=>setTimeout(r,700)); setWriteSaving(false); }} disabled={writeSaving}>
              {writeSaving ? "Saving…" : "Save Draft"}
            </button>
          </div>
        </div>
      )}

      {/* ── AGENT ── */}
      {tab === "agent" && (
        <div className="gw-agent-panel">
          <div className="gw-section-label">Writing Agent · Swarm Console</div>
          <textarea
            className="gw-agent-input"
            value={agentIn}
            onChange={e => setAgentIn(e.target.value)}
            placeholder="Ask about the manuscript, archetypes, biblical references, narrative arc…"
            rows={4}
          />
          <button className="gw-action-btn" onClick={askAgent} disabled={agentLoading}>
            {agentLoading ? "Thinking…" : "Send to Swarm"}
          </button>
          {agentOut && <div className="gw-agent-out">{agentOut}</div>}
        </div>
      )}

      {/* ── DRIVE ── */}
      {tab === "drive" && (
        <div className="gw-drive-panel">
          <div className="gw-section-label">Google Drive · Chapter File Map</div>
          {!driveFetched ? (
            <div className="gw-drive-connect">
              <p className="gw-drive-hint">Map Drive source files to chapters.<br />Requires <code>GOOGLE_DRIVE_API_KEY</code> in environment variables.</p>
              <button className="gw-action-btn" onClick={fetchDrive} disabled={driveLoading}>
                {driveLoading ? "Fetching files…" : "Connect & Fetch Drive"}
              </button>
            </div>
          ) : (
            <div className="gw-drive-list">
              {CHAPTERS.map(({ n, title }) => (
                <div key={n} className="gw-drive-row">
                  <span className="gw-drive-ch">{String(n).padStart(2,"0")} — {title}</span>
                  <select
                    className="gw-drive-select"
                    value={driveMap[n] || ""}
                    onChange={e => assignDrive(n, e.target.value)}
                  >
                    <option value="">— unassigned —</option>
                    {driveFiles.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
