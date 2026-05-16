"use client";
import React from "react";

interface ManuscriptCoreProps {
  manuscriptRef: React.RefObject<HTMLDivElement | null>;
  tocRef: React.RefObject<HTMLDivElement | null>;
  chapter: number;
  setChapter: (n: number) => void;
  paragraphs: string[];
  loading: boolean;
  error: string | null;
  state: any;
  depth: number;
  TITLES: Record<number, string>;
  CHAPTER_NUMS: number[];
  jumpTo: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

export default function ManuscriptCore({
  manuscriptRef,
  chapter,
  paragraphs
}: ManuscriptCoreProps) {

  const renderVisceralProse = (text: string, chapter: number) => {
    const tokens = text.split(/(\s+)/);

    return tokens.map((token, index) => {
      if (!token.trim()) return token;

      const sanitized = token.toLowerCase().replace(/[^\w]/g, "");
      let className = "visceral-token";

      if (sanitized === "squeeze" || sanitized === "crush") className += " word-squeeze";
      else if (sanitized === "fall" || sanitized === "plunge" || sanitized === "descent") className += " word-fall";
      else if (sanitized === "heavy" || sanitized === "weight" || sanitized === "gravity") className += " word-heavy";
      else if (sanitized === "light" || sanitized === "glow" || sanitized === "star") className += " word-light";
      else if (sanitized === "dark" || sanitized === "void") className += " word-dark";

      const key = `${chapter}-${index}-${token}`;

      return className === "visceral-token" ? (
        <span key={key}>{token}</span>
      ) : (
        <span key={key} className={className}>
          {token}
        </span>
      );
    });
  };

  if (!paragraphs || paragraphs.length === 0) {
    return (
      <div ref={manuscriptRef} className="p-10 text-center opacity-60">
        Loading manuscript...
      </div>
    );
  }

  return (
    <div ref={manuscriptRef} className="w-full px-6 md:px-24 py-20">
      <h1 className="text-3xl md:text-5xl font-serif mb-10">
        Chapter {chapter}
      </h1>

      {paragraphs.map((para, i) => (
        <p key={`${chapter}-p-${i}`} className="mb-6 leading-relaxed">
          {renderVisceralProse(para, chapter)}
        </p>
      ))}
    </div>
  );
}
