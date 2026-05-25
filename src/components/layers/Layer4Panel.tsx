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
      return <div className="panel-empty">
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

  useEffect(() => { document.body.classList.remove("layer4-open"); }, []);

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
      document.body.classList.add("layer4-open");
    };
    const onClose = () => {
      setIsOpen(false);
      document.body.classList.remove("layer4-open");
    };
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

  return (
    <>
      <div id="reading-progress-bar" className="reading-progress-bar" />
      <header className={`layer4-top-header ${headerVisible ? "visible" : ""}`}>
        {TABS.map(t => (
          <button key={t.id} className="layer4-top-tab"
            onClick={() => bus.emit("panel:open", { tabId: t.id })}>
            {t.label}
          </button>
        ))}
      </header>

      <button className={`layer4-affordance ${isOpen ? "open" : ""}`}
        onClick={() => isOpen
          ? bus.emit("panel:close")
          : bus.emit("panel:open", { tabId: activeTab })}
        aria-label={isOpen ? "Close panel" : "Open panel"}>
        <span className="layer4-affordance-label">{isOpen ? "close" : "menu"}</span>
      </button>

      <div className={`layer4-backdrop ${isOpen ? "open" : ""}`}
        onClick={() => bus.emit("panel:close")} aria-hidden="true" />

      <div className={`layer4-panel ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <nav className="layer4-tabs" role="tablist">
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`layer4-tab ${activeTab === t.id ? "active" : ""}`}
              role="tab" aria-selected={activeTab === t.id}>
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
