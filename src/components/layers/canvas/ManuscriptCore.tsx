"use client";

import React, { useEffect, useRef } from "react";
import { bus } from "@/core/runtimeEngine";
import TitleCover from "./front-matter/TitleCover";
import Dedication from "./front-matter/Dedication";
import Synopsis from "./front-matter/Synopsis";
import AboutAuthor from "./front-matter/AboutAuthor";
import TableOfContents from "./front-matter/TableOfContents";

const HEBREW_NAMES = /\b(Hebron|Hermon|Mamre|Beelzebub|Megiddo|Sak)\b/g;

function renderWithHebrewSpans(text: string): React.ReactNode[] {
  const matchSource = new RegExp(HEBREW_NAMES.source, 'g');
  const parts = text.split(HEBREW_NAMES);
  return parts.map((part, i) => {
    matchSource.lastIndex = 0;
    return matchSource.test(part)
      ? <span key={i} className="font-hebrew" lang="he">{part}</span>
      : part;
  });
}


export default function ManuscriptCore({
  blocks,
  chapterSlug,
  partNumber = "I",
  onLoadChapter
}: {
  blocks: (string | { 
    id: string; 
    content: string; 
    archetypal_weights?: any; 
    dualism_map?: any;
    hebrew_spans?: any[];
  })[];
  chapterSlug: string;
  partNumber?: string;
  onLoadChapter?: (n: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastFrameRef = useRef<number>(0);

  const handleLoadChapter = (n: number) => {
    if (onLoadChapter) onLoadChapter(n);
    setTimeout(() => {
        const target = document.getElementById("chapter-content");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        bus.emit("scroll:begin", { target: "chapter-content" });
    }, 100);
  };

  useEffect(() => {
    let frameId: number;
    const root = containerRef.current;
    if (!root) return;

    let paras = root.querySelectorAll<HTMLElement>("p[data-para]");

    const mutationObserver = new MutationObserver(() => {
      paras = root.querySelectorAll<HTMLElement>("p[data-para]");
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    const runKinematics = () => {
      const now = performance.now();
      const delta = now - lastFrameRef.current;
      if (delta < 8.33) {
        frameId = requestAnimationFrame(runKinematics);
        return;
      }
      lastFrameRef.current = now;
      const centerY = window.innerHeight / 2;

      paras.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const pCenter = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - pCenter);
        const maxDist = window.innerHeight * 0.6;
        
        const normDist = Math.min(1, dist / maxDist);
        const blurValue = normDist * 2.5; 
        const opacityValue = 1 - (normDist * 0.6);
        
        // Feature 11-14: Kinetic Distortions driven by weights
        const index = parseInt(p.dataset.index || "0");
        const block = blocks[index];
        if (typeof block !== 'string') {
          const weights = block?.archetypal_weights || {};
          const dualisms = block?.dualism_map || {};
          
          const mass = (weights.shadow || 0) * 1.5 + (dualisms.descent || 0) * 2;
          const tension = (weights.persona || 0) * 1.2;
          const drift = (weights.anima || 0) * 3;
          
          p.style.setProperty("--arc-mass", (mass * normDist).toString());
          p.style.setProperty("--arc-tension", (tension * normDist).toString());
          p.style.setProperty("--arc-drift", (drift * normDist).toString());
        }

        p.style.setProperty("--arc-blur", blurValue.toString());
        p.style.opacity = opacityValue.toString();
        
        // Only apply heavy filters when inactive to save performance
        if (p.dataset.state === "inactive") {
            p.style.filter = `blur(${blurValue}px)`;
            p.style.transform = `translateY(${normDist * 10}px)`;
        } else {
            p.style.filter = "none";
            p.style.transform = "none";
        }
      });

      frameId = requestAnimationFrame(runKinematics);
    };

    frameId = requestAnimationFrame(runKinematics);
    return () => {
      cancelAnimationFrame(frameId);
      mutationObserver.disconnect();
    };
  }, [blocks]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          el.dataset.state = entry.isIntersecting ? "active" : "inactive";

          if (entry.isIntersecting) {
            const sectionId = el.id;
            const index = el.dataset.index;
            
            if (index !== undefined) {
              const block = blocks[parseInt(index)];
              const payload = {
                paraIndex: index,
                content: typeof block === "string" ? block : block?.content || "",
                weights: typeof block === "string" ? {} : block?.archetypal_weights || {},
                dualisms: typeof block === "string" ? {} : block?.dualism_map || {},
                partNumber,
                chapterSlug
              };
              bus.emit("scroll:focus", payload);
            } else if (sectionId) {
              bus.emit("scroll:focus", {
                sectionId,
                chapterSlug: "0",
                content: sectionId
              });
            }
          }
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    observerRef.current = observer;
    root.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    root.querySelectorAll("p[data-para]").forEach((p) => observer.observe(p));

    const handleNavigate = (data: { id: string }) => {
        if (!data?.id) return;
        const target = document.querySelector(`[data-paragraph-id="${data.id}"]`);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.classList.add("paragraph-flash");
            setTimeout(() => target.classList.remove("paragraph-flash"), 1200);
        }
    };

    const unsubscribeNav = bus.on("navigate:paragraph", handleNavigate);

    return () => {
      observer.disconnect();
      unsubscribeNav();
    };
  }, [chapterSlug, blocks, partNumber]);

  // Helper to wrap Hebrew terms
  const renderText = (text: string) => {
    const hebrewTerms = ['Hebron', 'Hermon', 'Mamre', 'Beelzebub', 'Megiddo', 'Sak', 'Rafa'];
    let result: React.ReactNode[] = [text];
    
    hebrewTerms.forEach(term => {
      const newResult: React.ReactNode[] = [];
      result.forEach(node => {
        if (typeof node === 'string') {
          const parts = node.split(new RegExp(`(${term})`, 'g'));
          parts.forEach((part, i) => {
            if (part === term) {
              newResult.push(<span key={`${term}-${i}`} className="font-hebrew">{part}</span>);
            } else if (part) {
              newResult.push(part);
            }
          });
        } else {
          newResult.push(node);
        }
      });
      result = newResult;
    });
    
    return result;
  };

  return (
    <div ref={containerRef} className="reader-column pb-[50vh]">
      <TitleCover />
      <Dedication />
      <Synopsis />
      <div id="author"><AboutAuthor /></div>
      <TableOfContents onLoadChapter={handleLoadChapter} />

      <div className="reader-column pt-32">
        <h2 id="chapter-content" className="section-label text-center mb-32">Chapter {chapterSlug}</h2>
        {blocks.length === 0 ? (
          <div className="skeleton-container">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-para" style={{ width: `${75 + (i % 3) * 8}%` }} />
            ))}
          </div>
        ) : (
          blocks.map((block, idx) => {
            const text = typeof block === "string" ? block : block.content;
            const id = typeof block === "string" ? `para-${idx}` : block.id;

            return (
              <p
                key={id}
                data-para
                data-index={idx}
                data-paragraph-id={id}
                id={id}
                data-state="inactive"
                className="prose-paragraph kinetic-word"
              >
                {renderWithHebrewSpans(text)}
              </p>
            );
          })
        )}
      </div>

            return (
              <p
                key={id}
                data-para
                data-index={idx}
                data-paragraph-id={id}
                id={id}
                data-state="inactive"
                className="prose-paragraph kinetic-word"
              >
                {text}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}
