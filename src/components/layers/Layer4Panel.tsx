"use client";
import { useEffect, useState, useRef } from "react";
import { bus } from "@/core/runtimeEngine";
import HyperlinksGraph from "./panel/HyperlinksGraph";
import BiblicalReferencesDirectory from "./panel/BiblicalReferencesDirectory";
import ArchetypesDirectory from "./panel/ArchetypesDirectory";
import ChapterSettings from "./panel/ChapterSettings";
import AuthorGateway from "./panel/AuthorGateway";

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
    let raf = 0;
    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e?.tabId) setActiveTab(e.tabId);
      setIsOpen(true);
      document.body.classList.add("layer4-open");
    };
    const handleClose = () => {
      setIsOpen(false);
      document.body.classList.remove("layer4-open");
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return handleClose();
      if (e.key.toLowerCase() === "m") return bus.emit("panel:open", { tabId: activeTab });
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5) bus.emit("panel:open", { tabId: TABS[n - 1].id });
    };
    bus.on("panel:open", handleOpen);
    bus.on("panel:close", handleClose);
    window.addEventListener("keydown", handleKey);
    return () => {
      bus.off("panel:open", handleOpen);
      bus.off("panel:close", handleClose);
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeTab]);

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.Component;

  return (
    <>
      <div id="reading-progress-bar" className="reading-progress-bar" />
      <header className={`layer4-top-header ${headerVisible ? "visible" : ""}`}>
        {TABS.map(tab => (
          <button key={tab.id}
            onClick={() => bus.emit("panel:open", { tabId: tab.id })}
            className="layer4-top-tab">{tab.label}</button>
        ))}
      </header>

      <button
        className={`layer4-affordance ${isOpen ? "open" : ""}`}
        onClick={() => isOpen 
          ? bus.emit("panel:close") 
          : bus.emit("panel:open", { tabId: activeTab })}
        aria-label={isOpen ? "Close panel" : "Open panel"}>
        <span className="layer4-affordance-label">
          {isOpen ? "close" : "menu"}
        </span>
      </button>

      <div className={`layer4-backdrop ${isOpen ? "open" : ""}`}
        onClick={() => bus.emit("panel:close")} aria-hidden="true" />

      <div className={`layer4-panel ${isOpen ? "open" : ""}`}
        role="dialog" aria-modal="true">
        <nav className="layer4-tabs" role="tablist">
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`layer4-tab ${activeTab === tab.id ? "active" : ""}`}
              role="tab" aria-selected={activeTab === tab.id}>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="layer4-panel-body">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </>
  );
}