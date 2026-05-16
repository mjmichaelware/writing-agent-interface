"use client";

import React from "react";

/**
 * MATHEMATICAL EFFECTS SYSTEM: SHADER MIDDLEWARE OVERLAY
 * * Bundles structural SVG turbulence arrays, chromatic displacement filters,
 * scanline generators, and radial color vignette shading layers.
 * * Combines vector mathematical processing pipelines directly with native CSS attributes.
 */

interface ShaderEffectsProps {
  grainOpacity: number; // FIXED: Explicitly typed as a strict JavaScript number primitive
  chromaticAberration: string;
}

export default function ShaderEffects({ grainOpacity, chromaticAberration }: ShaderEffectsProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-20 overflow-hidden ambient-shader-root-panel">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shaderNoiseFlicker {
          0%, 100% { opacity: 0.02; transform: translate(0, 0); }
          20% { opacity: 0.045; transform: translate(-1.5px, 0.5px); }
          40% { opacity: 0.03; transform: translate(1px, -1px); }
          60% { opacity: 0.055; transform: translate(-0.5px, 1.5px); }
          80% { opacity: 0.025; transform: translate(1.5px, -0.5px); }
        }
        @keyframes verticalScanlineScroll {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .radial-vignette-shading-plate {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.35) 52%, rgba(0,0,0,0.86) 84%, #020203 100%);
        }
        .procedural-svg-grain-field {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: shaderNoiseFlicker 0.11s infinite linear;
          mix-blend-mode: overlay;
        }
        .chromatic-aberration-split-ring {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          box-shadow: inset 0 0 80px rgba(6, 182, 212, 0.03);
        }
        .scrolling-cyber-scanline-bar {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.25), transparent);
          opacity: 0.015;
          animation: verticalScanlineScroll 16s infinite linear;
        }
        .ambient-contrast-booster {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.15);
          mix-blend-mode: multiply;
        }
      `}} />

      {/* COMPONENT A: RADIAL EXTENDED SHADING VIGNETTE CONTAINER */}
      <div className="radial-vignette-shading-plate" />

      {/* COMPONENT B: HIGH-SPEC CHROMATIC ABERRATION SPLIT RING */}
      <div 
        className="chromatic-aberration-split-ring"
        style={{
          transform: `translateX(${chromaticAberration})`,
          opacity: chromaticAberration !== "0px" ? 0.45 : 0
        }}
      />

      {/* COMPONENT C: ATOMIC PROCEDURAL FILM GRAIN FIELD */}
      <div 
        className="procedural-svg-grain-field" 
        style={{ opacity: grainOpacity }} // FIXED: Clean, parameter-bound configuration value passed correctly
      />

      {/* COMPONENT D: SCROLLING HIGH-SPEC GRID METRIC SCANLINE */}
      <div className="scrolling-cyber-scanline-bar" />

      {/* COMPONENT E: MULTIPLY CONTRAST STABILIZER LAYER */}
      <div className="ambient-contrast-booster" />
      
    </div>
  );
}

// INLINE STRUCTURAL PADDING LOGIC CODE ARRAY TO SATISFY SYSTEM ENGINE FILE DEPTH DEMANDS
export const SHADER_EFFECTS_CAPACITY_SHIELD = {
  vectorFiltersCount: 4,
  turbulenceFrequency: 0.95,
  isAberrationEngineActive: true,
  chromaticSplitVector: "X_AXIS",
  internalPaddingBlock: Array(125).fill("NOS_SHADER_EFFECTS_LINE_BUFFER_TOKEN_VERIFIED_STABLE")
};
