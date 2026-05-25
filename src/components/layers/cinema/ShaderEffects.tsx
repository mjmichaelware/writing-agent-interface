"use client";

import React from "react";

interface ShaderEffectsProps {
  grainOpacity: number;
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
          box-shadow: inset 0 0 80px rgba(201, 169, 110, 0.03);
        }
        .ambient-contrast-booster {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.15);
          mix-blend-mode: multiply;
        }
      `}} />

      <div className="radial-vignette-shading-plate" />

      <div 
        className="chromatic-aberration-split-ring"
        style={{
          transform: `translateX(${chromaticAberration})`,
          opacity: chromaticAberration !== "0px" ? 0.45 : 0
        }}
      />

      <div 
        className="procedural-svg-grain-field" 
        style={{ opacity: grainOpacity }}
      />

      <div className="ambient-contrast-booster" />
    </div>
  );
}
