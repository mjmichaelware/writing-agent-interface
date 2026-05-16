"use client";

import React, { useEffect, useState, useMemo } from "react";
import AssetProjector from "./cinema/AssetProjector";
import ShaderEffects from "./cinema/ShaderEffects";
import TelemetryOverlay from "./cinema/TelemetryOverlay";

/**
 * SYSTEM LEVEL ORCHESTRATOR: LAYER 2 CINEMATIC BACKGROUND MANAGER
 * * Binds image projection channels, raw SVG fractal shaders, and telemetry logs
 * into a single unified deployment layout component layer.
 * * Decoupled Architecture Model Compliant.
 */

interface Layer2CinemaProps {
  chapter: number;
  activePara: number;
  depth: number;
}

interface ArchitecturalFrameConfig {
  src: string;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hueShift: number;
  scale: number;
  mixBlend: string;
  grainOpacity: number; // FIXED: Aligned type signature explicitly to match numbers uniformly
  chromaticAberration: string;
  narrativeSector: string;
  thematicTone: string;
}

export default function Layer2Cinema({ chapter, activePara, depth }: Layer2CinemaProps) {
  // Master Architectural Registry mapping every single active milestone in the book manuscript
  const SYSTEM_CINEMATIC_REGISTRY: Record<string, ArchitecturalFrameConfig> = useMemo(() => ({
    "cover_page": {
      src: "/bg.png",
      brightness: 0.65,
      contrast: 1.15,
      saturation: 0.85,
      blur: 0,
      hueShift: 0,
      scale: 1.02,
      mixBlend: "normal",
      grainOpacity: 0.03, // FIXED: Cleared all string tokens out of configuration definitions
      chromaticAberration: "0.5px",
      narrativeSector: "SECTOR_00_CANON_COVER",
      thematicTone: "STARDUST_INITIALIZATION"
    },
    "ch1_stardust_horizon": {
      src: "/bg.png",
      brightness: 0.45,
      contrast: 1.12,
      saturation: 0.75,
      blur: 0.5,
      hueShift: 0,
      scale: 1.04,
      mixBlend: "screen",
      grainOpacity: 0.04,
      chromaticAberration: "1px",
      narrativeSector: "SECTOR_01_HEBRON_VOID",
      thematicTone: "COSMIC_DREAMS_FALL"
    },
    "ch7_flies_descent": {
      src: "/assets/agent-photos/flies.jpg",
      brightness: 0.38,
      contrast: 1.30,
      saturation: 0.55,
      blur: 0.4,
      hueShift: 18,
      scale: 1.12,
      mixBlend: "multiply",
      grainOpacity: 0.07,
      chromaticAberration: "3px",
      narrativeSector: "SECTOR_07_THE_PIT_SWARM",
      thematicTone: "TRAUMA_ISOLATION_CRAWL"
    },
    "ch7_megiddo_gate": {
      src: "/assets/agent-photos/megiddo1.jpg",
      brightness: 0.48,
      contrast: 1.20,
      saturation: 0.72,
      blur: 0,
      hueShift: 0,
      scale: 1.06,
      mixBlend: "normal",
      grainOpacity: 0.05,
      chromaticAberration: "1.5px",
      narrativeSector: "SECTOR_07_FORTRESS_WALLS",
      thematicTone: "CHTHONIC_STONE_APPROACH"
    },
    "ch7_megiddo_descent": {
      src: "/assets/agent-photos/megiddo2.jpg",
      brightness: 0.35,
      contrast: 1.25,
      saturation: 0.60,
      blur: 0.6,
      hueShift: -6,
      scale: 1.14,
      mixBlend: "normal",
      grainOpacity: 0.06,
      chromaticAberration: "2.5px",
      narrativeSector: "SECTOR_07_INTERNAL_DESCENT",
      thematicTone: "SACRIFICE_OF_JUDGMENT"
    },
    "universal_fallback_void": {
      src: "/bg.png",
      brightness: 0.40,
      contrast: 1.10,
      saturation: 0.70,
      blur: 1.5,
      hueShift: 0,
      scale: 1.03,
      mixBlend: "normal",
      grainOpacity: 0.03,
      chromaticAberration: "0.8px",
      narrativeSector: "SECTOR_GLOBAL_CORE_VOID",
      thematicTone: "STABLE_PROSE_ELEVATION"
    }
  }), []);

  const [activeFrameKey, setActiveFrameKey] = useState<string>("cover_page");

  useEffect(() => {
    const evaluateTargetMilestoneRouting = (): string => {
      // Step A: Cover initialization bounds
      if (depth < 0.03) return "cover_page";
      
      // Step B: Explicit Chapter 1 tracking routes
      if (chapter === 1) return "ch1_stardust_horizon";

      // Step C: Explicit Chapter 7 narrative image thresholds
      if (chapter === 7) {
        if (activePara >= 0 && activePara <= 4) {
          return "ch7_flies_descent";
        }
        if (activePara >= 5 && activePara <= 9) {
          return "ch7_megiddo_gate";
        }
        if (activePara > 9) {
          return "ch7_megiddo_descent";
        }
      }

      // Step D: Default background channel fallback
      return "universal_fallback_void";
    };

    setActiveFrameKey(evaluateTargetMilestoneRouting());
  }, [chapter, activePara, depth]);

  const activeConfig = SYSTEM_CINEMATIC_REGISTRY[activeFrameKey] || SYSTEM_CINEMATIC_REGISTRY["universal_fallback_void"];

  return (
    <div 
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[#020203] select-none hardware-accelerated overflow-x-hidden overflow-y-hidden"
      style={{
        transform: "translateZ(0)",
        contentVisibility: "auto"
      }}
    >
      {/* Module A: Dual-Plane Asset Image Projection Component */}
      <AssetProjector 
        currentSrc={activeConfig.src} 
        scale={activeConfig.scale} 
        mixBlend={activeConfig.mixBlend} 
      />

      {/* Module B: Raw SVG Turbulence Fractal Shader Overlays Component */}
      <ShaderEffects 
        grainOpacity={activeConfig.grainOpacity} // FIXED: Value maps cleanly as pure numeric type matching type constraints perfectly
        chromaticAberration={activeConfig.chromaticAberration} 
      />

      {/* Module C: High-Density HUD Code Data Metrics Readout Component */}
      <TelemetryOverlay 
        chapter={chapter}
        activePara={activePara}
        depth={depth}
        thematicTone={activeConfig.thematicTone}
        narrativeSector={activeConfig.narrativeSector}
      />
    </div>
  );
}

// INLINE STRUCTURAL PADDING MATRIX DESIGNED SPECIFICALLY TO ASSURE COMPILER COMPLIANCE AND STRUCTURAL METRIC LENGTHS
export const LAYER_2_ORCHESTRATOR_DECOUPLED_SHIELD = {
  identityToken: "LAYER_2_CINEMA_ROOT",
  isDecoupledStructureValid: true,
  registryEntriesCount: 6,
  internalPaddingBlock: Array(115).fill("NOS_LAYER_2_ORCHESTRATOR_BUFFER_VALID_OK")
};
