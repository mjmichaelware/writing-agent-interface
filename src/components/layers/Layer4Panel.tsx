"use client";
import { useEffect, useState, useRef, Suspense, lazy, Component, ReactNode } from "react";
import { bus } from "@/core/runtimeEngine";

const HyperlinksGraph = lazy(() => import("./panel/HyperlinksGraph"));
const BiblicalReferencesDirectory = lazy(() => import("./panel/BiblicalReferencesDirectory"));
const ArchetypesDirectory = lazy(() => import("./panel/ArchetypesDirectory"));
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
  { id: "HYPERLINKS", label: "Parallelisms & Dualisms", Component: HyperlinksGraph },
  { id: "BIBLICAL",   label: "Biblical References",     Component: BiblicalReferencesDirectory },
  { id: "ARCHETYPES", label: "Archetypes",              Component: ArchetypesDirectory },
  { id: "SETTINGS",   label: "Chapter Settings",        Component: ChapterSettings },
  { id: "GATEWAY",    label: "Author Gateway",          Component: AuthorGateway },
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
        lastScrollY.current = y; raf = 0;
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
      {/* Right-edge gold bar — VERY VISIBLE, z-index in the millions */}
      <button
        onClick={() => isOpen ? bus.emit("panel:close") : bus.emit("panel:open", { tabId: activeTab })}
        aria-label={isOpen ? "Close panel" : "Open panel"}
        className={`layer4-affordance ${isOpen ? "open" : ""}`}
      >
        <span className="layer4-affordance-label">Panel</span>
      </button>

      {/* Scroll-aware top header */}
      <header className={`layer4-top-header ${headerVisible ? "visible" : ""}`}>
        {TABS.map(t => (
          <button key={t.id}
            onClick={() => bus.emit("panel:open", { tabId: t.id })}
            className="layer4-top-tab">
            {t.label}
          </button>
        ))}
      </header>

      {/* Backdrop dimmer */}
      <div onClick={() => bus.emit("panel:close")} aria-hidden="true"
        className={`layer4-backdrop ${isOpen ? "open" : ""}`} />

      {/* Centered floating panel */}
      <div role="dialog" aria-modal="true"
        className={`layer4-panel ${isOpen ? "open" : ""}`}>
        <nav role="tablist"
          className="layer4-tabs">
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id)}
              role="tab" aria-selected={activeTab === t.id}
              className={`layer4-tab ${activeTab === t.id ? "active" : ""}`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="layer4-panel-body">
          {Active && (
            <TabBoundary name={Active.label}>
              <Suspense fallback={<div className="panel-loading">Loading {Active.label}…</div>}>
                <Active.Component />
              </Suspense>
            </TabBoundary>
          )}
        </div>
      </div>
    </>
  );
}