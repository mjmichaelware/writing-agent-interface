"use client";
import React from 'react';
import { EMAWord } from '@/core/types';

/**
 * OmniText: Surgical build-fix. 
 * Added default empty array and optional chaining to prevent 'undefined (reading map)'
 */
export function OmniText({ words = [] }: { words?: EMAWord[] }) {
  if (!words || !Array.isArray(words)) return null;

  return (
    <>
      {words.map((w, i) => (
        <span 
          key={`${w.text}-${i}`}
          data-word-index={w.index}
          className="inline-block transition-colors duration-700"
          style={{ 
            color: w.color, 
            fontFamily: w.font,
            marginRight: '0.25em'
          }}
        >
          {w.text}
        </span>
      ))}
    </>
  );
}
