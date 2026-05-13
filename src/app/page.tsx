"use client";

import React, { useState, useEffect } from 'react';
import { BookOpen, Feather, Info } from 'lucide-react';

export default function LandingPage() {
  const [stage, setStage] = useState(0); 

  useEffect(() => {
    // Stage 0: Logo (0 to 2s)
    // Stage 1: Cinematic Pan begins (2s)
    const t1 = setTimeout(() => setStage(1), 2000);
    // Stage 2: Text & UI sequence begins (5.5s)
    const t2 = setTimeout(() => setStage(2), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans text-slate-200">
      
      {/* THE ANIMATION ENGINE (Pure CSS, Zero Bloat) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pan {
          0% { transform: scale(1.05) translate(0, 0); }
          100% { transform: scale(1.15) translate(-2%, -1%); }
        }
        @keyframes dust {
          0% { background-position: 0% 0%; opacity: 0.15; }
          50% { opacity: 0.25; }
          100% { background-position: 100% 100%; opacity: 0.15; }
        }
        @keyframes dropIn {
          0% { transform: translateY(-40px); opacity: 0; filter: blur(10px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0px); }
        }
        @keyframes fadeInUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .font-ancient {
          font-family: 'Times New Roman', Times, serif;
          letter-spacing: 0.15em;
        }
      `}} />

      {/* STAGE 0: AlliterasBooks Logo (0.0s to 2.0s) */}
      <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${stage === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <h2 className="text-3xl md:text-5xl tracking-[0.4em] text-gray-500 uppercase font-light grayscale">
          AlliterasBooks <span className="font-bold text-gray-300">LLC</span>
        </h2>
        <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent mt-8 animate-pulse"></div>
      </div>

      {/* STAGE 1 & 2: Atmospheric Background (Starts at 2.0s) */}
      {stage >= 1 && (
        <>
          {/* Main Image Layer (Ken Burns Pan) */}
          <div 
            className={`absolute inset-0 z-0 transition-opacity duration-2000 ${stage >= 1 ? 'opacity-40 animate-[pan_20s_ease-out_forwards]' : 'opacity-0'}`}
            style={{
              backgroundImage: 'url("/bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Blowing Dust Overlay */}
          <div 
            className="absolute inset-0 z-0 animate-[dust_30s_linear_infinite]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Vignette (Darkens the edges so text pops) */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </>
      )}

      {/* STAGE 2: Title & UI (Starts at 5.5s) */}
      {stage === 2 && (
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl px-6">
          
          {/* Main Title (5.5s) */}
          <h1 className="font-ancient text-6xl md:text-8xl lg:text-9xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-[dropIn_1.5s_ease-out_forwards]">
            THE WEIGHT<br/>OF THE SKY
          </h1>
          
          {/* Subtitle (7.0s) */}
          <h2 className="mt-8 text-xl md:text-3xl text-cyan-500/80 font-light tracking-[0.3em] uppercase opacity-0 animate-[fadeInUp_1s_ease-out_1.5s_forwards]">
            An Archetypal Tale
          </h2>

          {/* Author Name (8.0s) */}
          <h3 className="mt-12 text-lg md:text-2xl text-slate-400 tracking-widest opacity-0 animate-[fadeInUp_1s_ease-out_2.5s_forwards]">
            By <span className="text-slate-200 font-semibold tracking-widest">Michael Alonza P. Ware</span>
          </h3>

          {/* Interactive Navigation (9.0s) */}
          <div className="mt-20 flex flex-col sm:flex-row gap-6 opacity-0 animate-[fadeIn_1.5s_ease-out_3.5s_forwards]">
            <button className="flex items-center justify-center gap-3 px-8 py-4 w-64 bg-black/40 hover:bg-cyan-900/40 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white rounded transition-all backdrop-blur-md group">
              <BookOpen size={18} className="text-cyan-600 group-hover:text-cyan-400 transition-colors" />
              <span className="tracking-[0.2em] uppercase text-xs font-semibold">Title Page</span>
            </button>
            
            <button className="flex items-center justify-center gap-3 px-8 py-4 w-64 bg-black/40 hover:bg-emerald-900/40 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white rounded transition-all backdrop-blur-md group">
              <Feather size={18} className="text-emerald-600 group-hover:text-emerald-400 transition-colors" />
              <span className="tracking-[0.2em] uppercase text-xs font-semibold">Dedication</span>
            </button>
            
            <button className="flex items-center justify-center gap-3 px-8 py-4 w-64 bg-black/40 hover:bg-purple-900/40 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white rounded transition-all backdrop-blur-md group">
              <Info size={18} className="text-purple-600 group-hover:text-purple-400 transition-colors" />
              <span className="tracking-[0.2em] uppercase text-xs font-semibold">The Blurb</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
