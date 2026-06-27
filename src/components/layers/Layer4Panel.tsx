"use client";
import { useEffect, useState, useRef, Suspense, lazy, Component, ReactNode } from "react";
import { bus } from "@/core/runtimeEngine";

const HyperlinksGraph = lazy(() => import("./panel/HyperlinksGraph"));
const BiblicalReferencesDirectory = lazy(() => import("./panel/BiblicalReferencesDirectory"));
const ArchetypesDirectory = lazy(() => import("./panel/ArchetypesDirectory"));
const BiblicalArchetypeMatrix = lazy(() => import("./panel/BiblicalArchetypeMatrix"));
const ChapterSettings = lazy(() => import("./panel/ChapterSettings"));
const AuthorGateway = lazy(() => import("./panel/AuthorGateway"));

class TabBoundary extends Component<{ children: ReactNode; name: string }, { err: any }> {
  constructor(p: any) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err: any) { return { err }; }
  componentDidCatch(err: any) { console.error("Tab crash:", this.props.name, err); }
  render() {
    if (this.state.err) {
      return <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#8a857c", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
        {this.props.name} crashed: {String(this.state.err?.message || this.state.err)}
      </div>;
    }
    return this.props.children;
  }
}

const TABS = [
  { id: "HYPERLINKS",   label: "Parallelisms & Dualisms", Component: HyperlinksGraph },
  { id: "BIBLICAL",     label: "Biblical References",     Component: BiblicalReferencesDirectory },
  { id: "ARCHETYPES",   label: "Archetypes",              Component: ArchetypesDirectory },
  { id: "SACRED_MAP",   label: "Sacred Resonance",        Component: BiblicalArchetypeMatrix },
  { id: "SETTINGS",     label: "Chapter Settings",        Component: ChapterSettings },
  { id: "GATEWAY",      label: "Author Gateway",          Component: AuthorGateway },
];

export default function Layer4Panel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("HYPERLINKS");
  const [headerVisible, setHeaderVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    console.log("NOS Layer4Panel persistent mount active");
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const d = y - lastScrollY.current;
        if (y < 100) setHeaderVisible(false);
        else if (d < -8) setHeaderVisible(true);
        else if (d > 8) setHeaderVisible(false);
        lastScrollY.current = y;
        const total = document.body.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (y / total) * 100 : 0;
        const bar = document.getElementById('reading-progress-bar');
        if (bar) bar.style.width = `${Math.min(100, progress)}%`;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const onOpen = (e: any) => {
      if (e?.tabId) setActiveTab(e.tabId);
      setIsOpen(true);
    };
    const onClose = () => setIsOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key.toLowerCase() === "m") return bus.emit("panel:open", { tabId: activeTab });
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5) bus.emit("panel:open", { tabId: TABS[n - 1].id });
    };
    bus.on("panel:open", onOpen);
    bus.on("panel:close", onClose);
    window.addEventListener("keydown", onKey);
    return () => {
      bus.off("panel:open", onOpen);
      bus.off("panel:close", onClose);
      window.removeEventListener("keydown", onKey);
    };
  }, [activeTab]);

  const Active = TABS.find(t => t.id === activeTab);
  const gold = "#c9a96e";
  const muted = "#8a857c";
  const body = "#e8e4dc";

  return (
    <>
      <div id="reading-progress-bar" className="reading-progress-bar" />

      {/* Floating Author Gateway trigger — always visible */}
      <button
        onClick={() => bus.emit("panel:open", { tabId: "GATEWAY" })}
        aria-label="Open Author Gateway"
        style={{
          position: "fixed", bottom: "1.75rem", right: "1.5rem",
          width: "2.5rem", height: "2.5rem", borderRadius: "50%",
          background: "rgba(8,6,3,0.88)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(201,169,110,0.35)",
          boxShadow: "0 0 18px rgba(201,169,110,0.10), 0 4px 16px rgba(0,0,0,0.65)",
          color: gold, fontSize: "1rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2147483645,
          transition: "box-shadow 350ms cubic-bezier(0.22,1,0.36,1), border-color 350ms",
          pointerEvents: isOpen ? "none" : "auto",
          opacity: isOpen ? 0 : 1,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 32px rgba(201,169,110,0.28), 0 4px 20px rgba(0,0,0,0.7)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.65)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 18px rgba(201,169,110,0.10), 0 4px 16px rgba(0,0,0,0.65)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.35)";
        }}
      >
        ✦
      </button>
      <header className={`layer4-top-header ${headerVisible ? "visible" : ""}`}>
        {TABS.map(t => (
          <button key={t.id}
            onClick={() => bus.emit("panel:open", { tabId: t.id })}
            style={{
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "0.8125rem", color: muted,
              background: "transparent", border: "none", cursor: "pointer",
              padding: "0.25rem 0",
            }}>
            {t.label}
          </button>
        ))}
      </header>

      {/* Backdrop dimmer */}
      <div onClick={() => bus.emit("panel:close")} aria-hidden="true"
        style={{
          position: "fixed", inset: 0,
          zIndex: 2147483646,
          background: isOpen ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0)",
          backdropFilter: isOpen ? "blur(4px)" : "blur(0)",
          WebkitBackdropFilter: isOpen ? "blur(4px)" : "blur(0)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "background 500ms cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 500ms",
        }} />

      {/* Centered floating panel */}
      <div role="dialog" aria-modal="true"
        style={{
          position: "fixed", top: "50vh", left: "50vw",
          transform: `translate(-50%, -50%) scale(${isOpen ? 1 : 0.96})`,
          width: "min(720px, calc(100vw - 1.5rem))",
          height: "min(80vh, 760px)",
          zIndex: 2147483647,
          background: "rgba(10,10,10,0.97)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: `1px solid rgba(201,169,110,0.3)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.85)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          display: "flex", flexDirection: "column", overflow: "hidden",
          transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms",
        }}>
        <nav role="tablist"
          style={{
            display: "flex", justifyContent: "center", alignItems: "center",
            gap: "1rem", padding: "1rem 0.75rem 0.75rem",
            borderBottom: "1px solid rgba(201,169,110,0.1)",
            flexWrap: "wrap",
          }}>
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id)}
              role="tab" aria-selected={activeTab === t.id}
              style={{
                fontFamily: "Georgia, serif", fontStyle: "italic",
                fontSize: "0.8125rem",
                color: activeTab === t.id ? gold : muted,
                background: "transparent", border: "none", cursor: "pointer",
                padding: "0.25rem 0", position: "relative",
                borderBottom: activeTab === t.id ? `1px solid ${gold}` : "1px solid transparent",
                transition: "color 350ms cubic-bezier(0.22, 1, 0.36, 1), border-color 350ms",
              }}>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.25rem 2rem" }}>
          {Active && (
            <TabBoundary name={Active.label}>
              <Suspense fallback={<div style={{ padding: "2.5rem 1rem", textAlign: "center", color: muted, fontFamily: "Georgia, serif", fontStyle: "italic" }}>Loading {Active.label}…</div>}>
                <Active.Component />
              </Suspense>
            </TabBoundary>
          )}
        </div>
      </div>
    </>
  );
}