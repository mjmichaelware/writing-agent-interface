"use client";

import { useEffect, useRef, useState } from "react";
import TitleCover from "./canvas/front-matter/TitleCover";

interface Layer3CanvasProps {
  chapter: number | null;
  setChapter: (chapter: number | null) => void;
  paragraphs: string[];
  loading: boolean;
  error: string | null;
  depth: number;
  TITLES: string[];
  CHAPTER_NUMS: number[];
  state?: unknown;
}

export default function Layer3Canvas({
  chapter,
  setChapter,
  paragraphs,
  loading,
  error,
  depth,
  TITLES,
  CHAPTER_NUMS,
  state
}: Layer3CanvasProps) {
  const [isMounted, setIsMounted] = useState(false);

  const manuscriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (chapter === null) return;

    if (manuscriptRef.current) {
      manuscriptRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [chapter]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative w-full min-h-screen">
      <TitleCover />

      <div
        ref={manuscriptRef}
        className="max-w-3xl mx-auto px-6 py-24"
      >
        {loading && (
          <div className="text-center py-12">
            Loading manuscript...
          </div>
        )}

        {error && (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          paragraphs?.map((paragraph, index) => (
            <p
              key={index}
              className="mb-6 leading-8 text-lg text-neutral-200"
            >
              {paragraph}
            </p>
          ))}
      </div>
    </div>
  );
}
