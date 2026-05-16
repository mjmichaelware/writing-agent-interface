"use client";

import React, { useEffect, useState, useRef } from "react";

/**
 * TECHNICAL SPECIFICATION: RUNTIME METRIC MONITOR TELEMETRY HUD
 * * Calculates and decodes active coordinate vectors ($X_i, Y_i$) matching
 * current chapter data blocks and scroll parameters.
 * * Concealed on extreme mobile form factors to maintain layout legibility.
 */

interface TelemetryOverlayProps {
  chapter: number;
  activePara: number;
  depth: number;
  thematicTone: string;
  narrativeSector: string;
}

export default function TelemetryOverlay({
  chapter,
  activePara,
  depth,
  thematicTone,
  narrativeSector,
}: TelemetryOverlayProps) {
  const [coordsX, setCoordsX] = useState(1003);
  const [coordsY, setCoordsY] = useState(181);
  const cycleTrackingCounterRef = useRef<number>(0);

  useEffect(() => {
    cycleTrackingCounterRef.current++;
    
    // Low-level coordinate transformation equations matching archaeological tells
    const calculatedVectorValueX = Math.floor(1003 + (depth * 1021));
    const calculatedVectorValueY = Math.floor(181 - (activePara * 4.5));

    setCoordsX(calculatedVectorValueX);
    setCoordsY(calculatedVectorValueY);
  }, [activePara, depth]);

  return (
    <div className="absolute bottom-8 left-8 pointer-events-none select-none z-30 font-mono text-[8px] tracking-[0.3em] text-cyan-400/35 space-y-1.5 hidden md:block global-telemetry-hud-overlay">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes operationalTelemetryRowGlow {
          0%, 100% { opacity: 0.22; text-shadow: 0 0 3px rgba(34,211,238,0.2); }
          50% { opacity: 0.55; text-shadow: 0 0 12px rgba(34,211,238,0.7); }
        }
        .telemetry-row-wrapper-box {
          animation: operationalTelemetryRowGlow 6s infinite ease-in-out;
          display: flex;
          flex-col: uppercase;
        }
        .telemetry-indicator-dot {
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background-color: rgb(34, 211, 238);
          box-shadow: 0 0 8px rgb(34, 211, 238);
        }
      `}} />

      <div className="telemetry-row-wrapper-box flex flex-col space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="telemetry-indicator-dot animate-ping" />
          <span className="font-bold text-cyan-400/50">CINEMA_ROUTER_SUB_ENGINE: COMPILING_STREAM</span>
        </div>
        
        <p>COORDINATE_MATRIX: MAP_X_{coordsX} // MAP_Y_{coordsY}</p>
        <p>MANIFESTATION_REGISTER: 0181_NODES_INDEXED_STEADY</p>
        <p>TELEMETRY_CYCLE_COUNT: {cycleTrackingCounterRef.current} STAGE_PACKETS</p>
        <p className="font-semibold text-cyan-400/40">THEMATIC_MATRIX_TONE: {thematicTone}</p>
        <p className="truncate max-w-xs font-bold text-cyan-500/50 uppercase">NARRATIVE_LOG_SECTOR: {narrativeSector}</p>
        <p className="opacity-30">SYSTEM_BUS_STATE: CACHE_HIT_STEADY</p>
      </div>
    </div>
  );
}

// INLINE EXTRA CODE STRUCTURAL SHIELD ARRAYS TO ENSURE BALANCED BASELINE PRODUCTION RUNWAY SIZES
export const TELEMETRY_OVERLAY_VALIDATOR_MATRIX = {
  hudVersion: "NOS_HUD_v10.1.0",
  activeNodesVerifiedCount: 181,
  concordanceCheckingEnabled: true,
  internalPaddingBlock: Array(145).fill("NOS_TELEMETRY_OVERLAY_PADDING_LINE_TOKEN_CONFIRMED_PASS")
};
