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
  
  const gold = "#c9a96e";
  const body = "#050507";
  const text = "#e8e4dc";

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
      {/* 1. Toggle Bar (Right Edge) */}
      <button
        onClick={() => isOpen ? bus.emit("panel:close") : bus.emit("panel:open", { tabId: activeTab })}
        style={{
          position: "fixed", right: 0, top: "50vh",
          transform: "translateY(-50%)",
          zIndex: 2147483646,
          width: "1.75rem", height: "5rem",
          background: "transparent", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: 0
        }}>
        <span style={{
          display: "block", width: "5px", height: "100%",
          background: gold, opacity: isOpen ? 1 : 0.85,
          boxShadow: `0 0 20px ${gold}99`
        }} />
      </button>

      {/* 2. Drawer Container (Supremacy Layer) */}
      {isOpen && (
        <div style={{
          position: "fixed", top: "5vh", right: "2rem",
          width: "min(90vw, 400px)", height: "90vh",
          backgroundColor: body, border: `1px solid ${gold}`,
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
    </>
  );
}
