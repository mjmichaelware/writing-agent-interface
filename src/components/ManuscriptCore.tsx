"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useScrollFocus } from '@/hooks/useScrollFocus';
import { useNarrative } from '@/context/NarrativeContext';
import { tokenize } from '@/services/tokenize';
import { bus } from '@/core/runtimeEngine';
import { Howl } from 'howler';

interface Paragraph {
  id: string;
  content: string;
  archetypal_weights: any;
  dualism_map: any;
  hebrew_spans: string[];
}

const ManuscriptCore: React.FC<{ chapterId: string; ttsEnabled?: boolean }> = ({ chapterId, ttsEnabled }) => {
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);
  const { setFocus } = useNarrative();
  const focusedId = useScrollFocus(containerRef);

  useEffect(() => {
    if (focusedId) {
      const p = paragraphs.find(para => para.id === focusedId);
      if (p) {
        setFocus(p.id, p.archetypal_weights, p.dualism_map);
        bus.emit("scroll:focus", { paraIndex: p.id });

        // Feature 33: Scroll-Focused Audio Sync
        if (ttsEnabled) {
          fetch('/api/tts', {
            method: 'POST',
            body: JSON.stringify({ text: p.content }),
          })
            .then(res => res.blob())
            .then(blob => {
              if (soundRef.current) soundRef.current.stop();
              const url = URL.createObjectURL(blob);
              soundRef.current = new Howl({
                src: [url],
                format: ['mp3'],
                autoplay: true,
                onend: () => URL.revokeObjectURL(url),
              });
            });
        }
      }
    }
  }, [focusedId, paragraphs, setFocus, ttsEnabled]);

  // Feature 37: Mechanical Audio Teardown
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chapterId) {
      fetch(`/api/manuscript?chapterId=${chapterId}`)
        .then(res => res.json())
        .then(data => setParagraphs(data || []));
    }
  }, [chapterId]);

  useEffect(() => {
    let frameId: number;
    const root = containerRef.current;
    if (!root) return;

    const runKinematics = () => {
      const centerY = window.innerHeight / 2;
      const paras = root.querySelectorAll<HTMLElement>("p[data-para]");

      paras.forEach((p) => {
        const rect = p.getBoundingClientRect();
        const pCenter = rect.top + rect.height / 2;
        const dist = Math.abs(centerY - pCenter);
        const maxDist = window.innerHeight * 0.6;
        
        // Normalized distance 0 to 1
        const normDist = Math.min(1, dist / maxDist);
        
        // Apply spring-damped logic via CSS variables
        const blurValue = normDist * 8; // Max 8px blur
        const opacityValue = 1 - (normDist * 0.7); // Min 0.3 opacity
        const translateY = normDist * 10; // Subtle drift

        p.style.setProperty("--arc-blur", blurValue.toString());
        p.style.opacity = opacityValue.toString();
        p.style.filter = `blur(${blurValue}px)`;
        p.style.transform = `translateY(${translateY}px)`;
      });

      frameId = requestAnimationFrame(runKinematics);
    };

    frameId = requestAnimationFrame(runKinematics);

    return () => cancelAnimationFrame(frameId);
  }, [paragraphs]);

  if (!paragraphs.length) return null;

  return (
    <div ref={containerRef} className="w-full mx-auto pb-[50vh] px-6 md:px-0">
      <div className="max-w-prose mx-auto pt-32 space-y-16">
        {paragraphs.map((p, idx) => {
          const isFocused = focusedId === p.id;
          
          return (
            <p 
              key={p.id}
              id={p.id}
              data-para
              data-paragraph-id={p.id}
              data-state={isFocused ? "active" : "inactive"}
              className={`prose-paragraph ${idx === 0 ? "first-paragraph" : ""} transition-all duration-1000 ease-spring will-change-[transform,filter,opacity]`}
              dangerouslySetInnerHTML={{ __html: tokenize(p.content) }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ManuscriptCore;