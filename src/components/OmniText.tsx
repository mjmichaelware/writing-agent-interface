"use client";
import React from 'react';

export function OmniText({ words = [] }: { words?: any[] }) {
  if (!words) return null;
  return (
    <>
      {words.map((w, i) => (
        <span 
          key={i}
          className="transition-all duration-500 hover:text-white"
          style={{ 
            color: w.color || 'inherit', 
            fontFamily: w.font || 'inherit'
          }}
        >
          {w.text}{' '}
        </span>
      ))}
    </>
  );
}
