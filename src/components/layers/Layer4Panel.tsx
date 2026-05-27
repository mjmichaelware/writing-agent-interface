"use client";
import { useEffect, useState, useRef, Suspense, lazy, Component, ReactNode } from "react";
import { bus } from "@/core/runtimeEngine";

// Lazy-loaded tab components
const HyperlinksGraph = lazy(() => import("./panel/HyperlinksGraph"));
const BiblicalReferencesDirectory = lazy(() => import("./panel/BiblicalReferencesDirectory"));
const ArchetypesDirectory = lazy(() => import("./panel/ArchetypesDirectory"));
const ChapterSettings = lazy(() => import("./panel/ChapterSettings"));
const AuthorGateway = lazy(() => import("./panel/AuthorGateway"));
const SystemTab = lazy(() => import("./panel/SystemTab"));

// Error Boundary for UI isolation
class TabBoundary extends Component<{ children: ReactNode; name: string }, { err: any }> {
  constructor(p: any) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err: any) { return { err }; }
  render() {
    if (this.state.err) return <div style={{ padding: "1rem", color: "#6b2c2c" }}>{this.props.name} failed.</div>;
    return this.props.children;
  }
}

const TABS = [
  { id: "HYPERLINKS", label: "Parallelisms & Dualisms", Component: HyperlinksGraph },
  { id: "BIBLICAL",   label: "Biblical References",     Component: BiblicalReferencesDirectory },
  { id: "ARCHETYPES", label: "Archetypes",              Component: ArchetypesDirectory },
  { id: "SETTINGS",   label: "Chapter Settings",        Component: ChapterSettings },
  { id: "GATEWAY",    label: "Author Gateway",          Component: AuthorGateway },
  { id: "SYSTEM",     label: "System",                  Component: SystemTab },
];

export default function Layer4Panel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("HYPERLINKS");
  const [headerVisible, setHeaderVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const d = y - lastScrollY.current;
        if (y < 100) setHeaderVisible(false);
        else if (delta < -8) setHeaderVisible(true);
        else if (delta > 8) setHeaderVisible(false);
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
    bus.on("panel:open", onOpen);
    bus.on("panel:close", onClose);
    return () => { bus.off("panel:open", onOpen); bus.off("panel:close", onClose); };
  }, []);

  const Active = TABS.find(t => t.id === activeTab);

  return (
    <>
      <div id="reading-progress-bar" className="reading-progress-bar" />
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
          borderRadius: "8px", padding: "1rem",
          boxShadow: "0 0 50px rgba(0,0,0,0.8)",
          display: "flex", flexDirection: "column"
        }}>
          {/* Tab Headers */}
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ 
                  background: activeTab === t.id ? gold : "transparent",
                  color: activeTab === t.id ? "#000" : gold,
                  border: `1px solid ${gold}`, padding: "0.4rem 0.6rem", 
                  cursor: "pointer", fontSize: "0.7rem", fontFamily: "monospace" 
                }}>
                {t.label}
              </button>
            ))}
          </div>
          
          {/* Active Content */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <Suspense fallback={<div style={{ color: gold }}>Initializing...</div>}>
              <TabBoundary name={activeTab}>
                {Active && <Active.Component />}
              </TabBoundary>
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
