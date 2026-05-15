"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Word = React.memo(({ word, metadata }: { word: string; metadata: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-pointer transition-all duration-300 rounded px-0.5"
      style={{ 
        color: metadata?.color || 'inherit', 
        fontFamily: metadata?.font || 'inherit',
        textShadow: metadata?.glow ? `0 0 10px ${metadata.color}` : 'none'
      }}
    >
      {word}
      <AnimatePresence>
        {isHovered && (metadata?.ref || metadata?.sync) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-zinc-950 border border-emerald-900/40 text-[10px] z-50 shadow-[0_0_30px_rgba(0,0,0,1)]"
          >
            {metadata.ref && (
              <div className="mb-2">
                <span className="text-amber-500 uppercase tracking-widest block mb-1">Biblical Ref</span>
                <p className="text-zinc-300 font-serif italic">{metadata.ref}</p>
              </div>
            )}
            {metadata.sync && (
              <div>
                <span className="text-cyan-500 uppercase tracking-widest block mb-1">Foreshadowing</span>
                <p className="text-zinc-300 italic">{metadata.sync}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
});

export const OmniText = ({ xmlData }: { xmlData: string }) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(`<root>${xmlData}</root>`, "text/xml");
  const paragraphs = Array.from(xmlDoc.getElementsByTagName("paragraph"));

  return (
    <div className="space-y-24">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-2xl md:text-3xl leading-[2.1] font-serif text-justify" style={{ textIndent: "4rem" }}>
          {Array.from(p.getElementsByTagName("word")).map((w, j) => (
            <React.Fragment key={`${i}-${j}`}>
              <Word 
                word={w.textContent || ""} 
                metadata={{
                  color: w.getAttribute("color"),
                  font: w.getAttribute("font"),
                  ref: w.getAttribute("ref"),
                  sync: w.getAttribute("sync"),
                  glow: w.getAttribute("glow")
                }} 
              />
              {" "}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
};
