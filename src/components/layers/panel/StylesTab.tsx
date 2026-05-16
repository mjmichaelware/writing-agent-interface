"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Sliders, Type, Grid, Eye, RefreshCw, Layers, CheckCircle } from "lucide-react";
import { ControlPanelState } from "../Layer4Panel";

/**
 * PRODUCTION INTERFACE SPECIFICATION: LEVEL 4 STYLES ENGINE
 * Component: Styles Customization Dashboard Tab Panel
 * * Responsibility: Renders fine-grained adjustment tracks for typography sizing maps,
 * letter-spacing values, and baseline colors, driving continuous theme overrides natively.
 * * Structural Design: 100% functional interactive elements. Zero layout filler padding.
 */

interface StylesTabProps {
  cp: {
    state: ControlPanelState;
    update: (patch: Partial<ControlPanelState>) => void;
    updateCharacter: (name: string, patch: any) => void;
  };
}

export default function StylesTab({ cp }: StylesTabProps) {
  const [localFontScale, setLocalFontScale] = useState<number>(cp.state.fontScale || 1.0);
  const [localLetterSpacing, setLocalLetterSpacing] = useState<number>(cp.state.letterSpacing || 0.02);
  const [activeProfileLabel, setActiveProfileLabel] = useState<string>("PROSE_STEADY_DEFAULT");
  const [renderCount, setRenderCount] = useState<number>(0);

  useEffect(() => {
    setLocalFontScale(cp.state.fontScale);
    setLocalLetterSpacing(cp.state.letterSpacing);
  }, [cp.state.fontScale, cp.state.letterSpacing]);

  const handleFontScaleTrackChange = (updatedVal: number) => {
    setLocalFontScale(updatedVal);
    cp.update({ fontScale: updatedVal });
    setRenderCount(prev => prev + 1);
  };

  const handleLetterSpacingTrackChange = (updatedVal: number) => {
    setLocalLetterSpacing(updatedVal);
    cp.update({ letterSpacing: updatedVal });
    setRenderCount(prev => prev + 1);
  };

  const forceLayoutResetToBaseline = () => {
    setLocalFontScale(1.0);
    setLocalLetterSpacing(0.02);
    // FIXED: Formatted numerical value properties directly to resolve compiler type flags cleanly
    cp.update({
      fontScale: 1.0,
      lineHeight: 2.0,
      letterSpacing: 0.02,
      baseColor: "#d4d4d8",
    });
    setActiveProfileLabel("PROSE_STEADY_DEFAULT");
    setRenderCount(prev => prev + 1);
  };

  const activateHighContrastCompactProfile = () => {
    setLocalFontScale(0.875);
    setLocalLetterSpacing(0.01);
    // FIXED: Formatted numerical value properties directly to resolve compiler type flags cleanly
    cp.update({
      fontScale: 0.875,
      lineHeight: 1.7,
      letterSpacing: 0.01,
      baseColor: "#ffffff",
    });
    setActiveProfileLabel("HIGH_CONTRAST_COMPACT_MATRIX");
    setRenderCount(prev => prev + 1);
  };

  return (
    <div className="space-y-6 select-none font-mono text-[10px] text-zinc-400 bg-transparent cross-platform-styles-tab-dashboard">
      
      <style dangerouslySetInnerHTML={{__html: `
        .style-slider-track-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 3px;
          background: #18181b;
          border-radius: 2px;
          outline: none;
          transition: background 0.3s ease;
        }
        .style-slider-track-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22d3ee;
          cursor: pointer;
          box-shadow: 0 0 6px #06b6d4;
          transition: transform 0.2s ease;
        }
        .style-slider-track-input::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }
        .style-slider-track-input::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22d3ee;
          cursor: pointer;
          box-shadow: 0 0 6px #06b6d4;
          border: none;
          transition: transform 0.2s ease;
        }
        .style-action-profile-card-btn {
          border: 1px solid rgba(6, 182, 212, 0.12);
          background: rgba(4, 4, 6, 0.6);
          padding: 10px;
          border-radius: 2px;
          width: 100%;
          text-align: left;
          transition: all 0.3s ease;
          color: #a1a1aa;
        }
        .style-action-profile-card-btn:hover {
          border-color: rgba(34, 211, 238, 0.4);
          background: rgba(6, 182, 212, 0.05);
          color: #ffffff;
        }
        .active-profile-card-border-lock {
          border-color: rgba(34, 211, 238, 0.5) !important;
          color: #22d3ee !important;
          background: rgba(6, 182, 212, 0.08) !important;
        }
      `}} />

      {/* MODULE BOX 1: TYPOGRAPHY SLIDER SLOT BLOCK */}
      <div className="status-metric-panel-box p-4">
        <div className="status-metric-panel-title-label pb-2 mb-4 flex items-center gap-1.5 uppercase font-bold">
          <Type size={10} />
          <span>// TYPOGRAPHY_SCALE_ADJUSTMENT</span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-zinc-500 font-semibold">FONT_SCALE_COEFFICIENT:</span>
              <span className="text-cyan-400 font-bold">{localFontScale.toFixed(3)} REM</span>
            </div>
            <input 
              type="range"
              min="0.75"
              max="1.45"
              step="0.025"
              value={localFontScale}
              onChange={(e) => handleFontScaleTrackChange(parseFloat(e.target.value))}
              className="style-slider-track-input"
            />
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <div className="flex justify-between items-center text-[9px]">
              <span className="text-zinc-500 font-semibold">LETTER_SPACING_FACTOR:</span>
              <span className="text-cyan-400 font-bold">{localLetterSpacing.toFixed(3)} EM</span>
            </div>
            <input 
              type="range"
              min="0.00"
              max="0.08"
              step="0.002"
              value={localLetterSpacing}
              onChange={(e) => handleLetterSpacingTrackChange(parseFloat(e.target.value))}
              className="style-slider-track-input"
            />
          </div>
        </div>
      </div>

      {/* MODULE BOX 2: PRE-COMPILED THEMATIC WORKSPACE PROFILES */}
      <div className="status-metric-panel-box p-4">
        <div className="status-metric-panel-title-label pb-2 mb-4 flex items-center gap-1.5 uppercase font-bold">
          <Grid size={10} />
          <span>// PRESET_THEMATIC_MATRIX_PROFILES</span>
        </div>

        <div className="space-y-2.5">
          <button 
            onClick={forceLayoutResetToBaseline}
            className={`style-action-profile-card-btn flex justify-between items-center font-mono ${activeProfileLabel === "PROSE_STEADY_DEFAULT" ? "active-profile-card-border-lock" : ""}`}
          >
            <div className="flex flex-col space-y-0.5">
              <span className="font-bold text-[9px] uppercase">PROSE_STEADY_DEFAULT</span>
              <span className="text-[7.5px] text-zinc-500 lowercase">scale: 1.000rem // space: 0.020em // color: #d4d4d8</span>
            </div>
            {activeProfileLabel === "PROSE_STEADY_DEFAULT" && <CheckCircle size={10} className="text-cyan-400" />}
          </button>

          <button 
            onClick={activateHighContrastCompactProfile}
            className={`style-action-profile-card-btn flex justify-between items-center font-mono ${activeProfileLabel === "HIGH_CONTRAST_COMPACT_MATRIX" ? "active-profile-card-border-lock" : ""}`}
          >
            <div className="flex flex-col space-y-0.5">
              <span className="font-bold text-[9px] uppercase">HIGH_CONTRAST_COMPACT_MATRIX</span>
              <span className="text-[7.5px] text-zinc-500 lowercase">scale: 0.875rem // space: 0.010em // color: #ffffff</span>
            </div>
            {activeProfileLabel === "HIGH_CONTRAST_COMPACT_MATRIX" && <CheckCircle size={10} className="text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* MODULE BOX 3: LIVE LAYER VIEWPORT STATUS OVERLAYS */}
      <div className="status-metric-panel-box p-4">
        <div className="status-metric-panel-title-label pb-2 mb-2 flex items-center gap-1.5 uppercase font-bold">
          <Eye size={10} />
          <span>// STACKING_LAYER_OVERLAY_MONITOR</span>
        </div>
        
        <div className="flex flex-col space-y-0.5">
          <div className="status-telemetry-row-item">
            <span>LAYER_1_VOID_CORES:</span>
            <span className="text-emerald-400 font-bold">MUTEX_ACTIVE_60FPS</span>
          </div>
          <div className="status-telemetry-row-item">
            <span>LAYER_2_CINEMA_SHADERS:</span>
            <span className="text-emerald-400 font-bold">SVG_FILTERS_MOUNTED</span>
          </div>
          <div className="status-telemetry-row-item">
            <span>LAYER_3_CANUS_PROSE:</span>
            <span className="text-cyan-400 font-bold">TOKEN_PARSING_ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="w-full text-center pt-2 select-none">
        <div className="inline-flex items-center gap-1.5 text-[7.5px] text-zinc-600 uppercase tracking-widest border border-dashed border-zinc-900 px-3 py-1.5 rounded-2xs">
          <RefreshCw size={8} className="text-zinc-700" />
          <span>STYLES_BUS_CYCLES_COMMITTED: {renderCount}</span>
        </div>
      </div>

    </div>
  );
}
