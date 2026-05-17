"use client";
import React, { useEffect, useRef } from "react";

interface ManuscriptCoreProps {
  manuscriptRef: React.RefObject<HTMLDivElement | null> | ((node: HTMLDivElement | null) => void) | null | any;
  chapter: number;
  paragraphs: string[];
  loading: boolean;
  error: string | null;
  state: { fontScale: number };
  tocRef?: React.RefObject<HTMLDivElement | null> | any;
  setChapter?: (n: number) => void;
  depth?: number;
  TITLES?: Record<number, string>;
  CHAPTER_NUMS?: number[];
  jumpTo?: () => void;
}

export default function ManuscriptCore({
  manuscriptRef,
  paragraphs,
  loading,
  error,
  state,
}: ManuscriptCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const container = containerRef.current;
    if (!container) return;

    const updatePhysics = () => {
      const viewportHeight = window.innerHeight;
      const tokens = container.querySelectorAll('.kinetic-token');

      tokens.forEach((token) => {
        const rect = token.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distFromCenter = Math.abs(center - viewportHeight / 2);

        const intersectionRatio = Math.max(0, 1 - (distFromCenter / (viewportHeight / 2.5)));
        const htmlToken = token as HTMLElement;

        if (intersectionRatio > 0.85) {
            htmlToken.style.opacity = '1';
            htmlToken.style.filter = 'blur(0px)';
        } else {
            htmlToken.style.opacity = Math.max(0.15, intersectionRatio).toString();
            htmlToken.style.filter = `blur(${(1 - intersectionRatio) * 5}px)`;
        }

        const weight = parseFloat(htmlToken.getAttribute('data-weight') || '0');
        const arcMass = weight * intersectionRatio;
        const arcTension = weight > 0.5 ? Math.pow(intersectionRatio, 2) : 0;
        const arcVelocity = (1 - intersectionRatio) * (weight > 0 ? 1 : -1);

        htmlToken.style.setProperty('--arc-mass', arcMass.toFixed(3));
        htmlToken.style.setProperty('--arc-tension', arcTension.toFixed(3));
        htmlToken.style.setProperty('--arc-velocity', arcVelocity.toFixed(3));
      });

      rafId = requestAnimationFrame(updatePhysics);
    };

    rafId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(rafId);
  }, [paragraphs]);

  const renderVisceralProse = (text: string, pIndex: number) => {
    const words = text.split(/(\b\w+\b)/g);
    return words.map((word, wIndex) => {
      const cleanWord = word.toLowerCase();
      let thematicWeight = 0;

      if (['fall', 'down', 'heavy', 'pit', 'drop'].includes(cleanWord)) thematicWeight = 1.0;
      else if (['squeeze', 'compress', 'crush'].includes(cleanWord)) thematicWeight = 0.8;
      else if (['stretch', 'long', 'ascend', 'sky'].includes(cleanWord)) thematicWeight = -0.8;

      return (
        <span
          key={`${pIndex}-${wIndex}`}
          className="kinetic-token inline-block transition-transform duration-300"
          data-weight={thematicWeight}
        >
          {word}
        </span>
      );
    });
  };

  if (loading) return <div className="text-center py-24 font-serif text-zinc-500 italic">Retrieving canonical text...</div>;
  if (error) return <div className="text-center py-24 font-serif text-[#6b2c2c] italic">This chapter is not yet available.</div>;

  return (
    <div
      ref={(node) => {
        // @ts-ignore
        containerRef.current = node;
        if (manuscriptRef) {
          if (typeof manuscriptRef === 'function') {
            manuscriptRef(node);
          } else if ('current' in manuscriptRef) {
            (manuscriptRef as any).current = node;
          }
        }
      }}
      className="w-full max-w-2xl mx-auto py-16 px-4 md:px-0 relative z-20 font-serif manuscript-paragraph-segment"
      style={{ fontSize: `${state?.fontScale || 1.125}rem` }}
    >
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-10 text-justify leading-[var(--leading-prose)]" data-para-index={i}>
          {renderVisceralProse(p, i)}
        </p>
      ))}
    </div>
  );
}
