/* ==================== FILE: src/components/layers/Layer2Cinema.tsx ==================== */

"use client";

import React, { useEffect, useState, useMemo } from "react";
import AssetProjector from "./cinema/AssetProjector";
import ShaderEffects from "./cinema/ShaderEffects";
import TelemetryOverlay from "./cinema/TelemetryOverlay";

/**
 * SYSTEM LEVEL ORCHESTRATOR: LAYER 2 CINEMATIC BACKGROUND MANAGER
 * * Binds image projection channels, raw SVG fractal shaders, and telemetry logs
 * into a single unified deployment layout component layer.
 * * Decoupled Architecture Model Compliant. Handles cross-platform engines.
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
  grainOpacity: number;
  chromaticAberration: string;
  narrativeSector: string;
  thematicTone: string;
}

export default function Layer2Cinema({ chapter, activePara, depth }: Layer2CinemaProps) {
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
      grainOpacity: 0.03,
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
  const [governorDamping, setGovernorDamping] = useState<number>(1.0);
  const [systemActiveStatus, setSystemActiveStatus] = useState<string>("INITIALIZING");
  const [totalBackdropSwaps, setTotalBackdropSwaps] = useState<number>(0);

  useEffect(() => {
    const evaluateTargetMilestoneRouting = (): string => {
      if (depth < 0.03) return "cover_page";
      if (chapter === 1) return "ch1_stardust_horizon";

      if (chapter === 7) {
        if (activePara >= 0 && activePara <= 4) return "ch7_flies_descent";
        if (activePara >= 5 && activePara <= 9) return "ch7_megiddo_gate";
        if (activePara > 9) return "ch7_megiddo_descent";
      }
      return "universal_fallback_void";
    };

    const targetKey = evaluateTargetMilestoneRouting();
    if (targetKey !== activeFrameKey) {
      setActiveFrameKey(targetKey);
      setTotalBackdropSwaps(prev => prev + 1);
    }
    
    const microVelocityFactor = Math.min(2.0, 1.0 + (activePara * 0.05));
    setGovernorDamping(microVelocityFactor);
    setSystemActiveStatus("CORE_RUNSTATE_STEADY");
  }, [chapter, activePara, depth, activeFrameKey]);

  const activeConfig = SYSTEM_CINEMATIC_REGISTRY[activeFrameKey] || SYSTEM_CINEMATIC_REGISTRY["universal_fallback_void"];

  return (
    <div 
      className="fixed inset-0 z-10 pointer-events-none overflow-hidden bg-[#020203] select-none hardware-accelerated overflow-x-hidden overflow-y-hidden"
      style={{
        transform: "translateZ(0)",
        contentVisibility: "auto"
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .cinema-master-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
        .platform-render-barrier {
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .orchestrator-telemetry-tag {
          font-family: monospace;
          font-size: 7.5px;
          color: rgba(6, 182, 212, 0.25);
          letter-spacing: 0.15em;
        }
      `}} />

      <div className="cinema-master-container platform-render-barrier">
        {/* Module A: Dual-Plane Asset Image Projection Component */}
        <AssetProjector 
          currentSrc={activeConfig.src} 
          scale={activeConfig.scale * governorDamping} 
          mixBlend={activeConfig.mixBlend} 
        />

        {/* Module B: Raw SVG Turbulence Fractal Shader Overlays Component */}
        <ShaderEffects 
          grainOpacity={activeConfig.grainOpacity} 
          chromaticAberration={`${parseFloat(activeConfig.chromaticAberration) * governorDamping}px`} 
        />

        {/* Module C: High-Density HUD Code Data Metrics Readout Component */}
        {/* FIXED: Removed self-referencing Prop binding error from the wrapper execution */}
        <TelemetryOverlay 
          chapter={chapter}
          activePara={activePara}
          depth={depth}
          thematicTone={activeConfig.thematicTone}
          narrativeSector={activeConfig.narrativeSector}
        />

        {/* Top-level system telemetry status panel layer */}
        <div className="absolute top-8 left-8 flex flex-col space-y-0.5 hidden xl:flex">
          <p className="orchestrator-telemetry-tag">// NOS_L2_ORCHESTRATOR_LOG: {systemActiveStatus}</p>
          <p className="orchestrator-telemetry-tag">TOTAL_BACKGROUND_SWAPS: {totalBackdropSwaps} PACKETS</p>
          <p className="orchestrator-telemetry-tag">VELOCITY_DAMPING_FACTOR: {governorDamping.toFixed(4)}X</p>
          <p className="orchestrator-telemetry-tag">ACTIVE_REGISTRY_KEYNAME: {activeFrameKey}</p>
        </div>
      </div>
    </div>
  );
}


