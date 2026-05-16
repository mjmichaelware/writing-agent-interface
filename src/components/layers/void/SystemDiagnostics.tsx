"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

/**
 * TECHNICAL SPECIFICATION: HIGH-CAPACITY PERFORMANCE GRAPH INTERFACE
 * * Operating Layer: Level 1 Void Sub-System Diagnostics Node
 * * Responsibility: Captures continuous frame frequency intervals, populates an internal
 * structural rolling ring-buffer cache, applies a Simple Moving Average (SMA) filter,
 * and renders a real-time vector graph plotting hardware efficiency indexes.
 * * Standards Compliance: Strict ECMAScript 2022 + Type Safety constraints.
 */

interface SystemDiagnosticsProps {
  activeCells: number;
  fps: number;
  totalCycles: number;
  cycleTime: number;
}

interface TelemetrySample {
  fpsValue: number;
  computeDurationMs: number;
  timestamp: number;
}

export default function SystemDiagnostics({
  activeCells,
  fps,
  totalCycles,
  cycleTime,
}: SystemDiagnosticsProps) {
  const sparklineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interactive UI layout view state toggles
  const [isExtendedViewActive, setIsExtendedViewActive] = useState<boolean>(false);
  const [systemHealthRating, setSystemHealthRating] = useState<string>("OPTIMAL");
  const [smoothedComputeLoad, setSmoothedComputeLoad] = useState<number>(0);

  // Persistent low-level memory rings to hold data metrics without React re-render thrashing
  const telemetryHistoryRef = useRef<{
    samplesBuffer: TelemetrySample[];
    maxBufferSize: number;
    movingAverageWindow: number;
    peakComputeLoadRecorded: number;
    lowestFpsRecorded: number;
    graphRenderId: number;
  }>({
    samplesBuffer: [],
    maxBufferSize: 90, // Limits data timeline arrays to fit mobile portrait bounds cleanly
    movingAverageWindow: 10,
    peakComputeLoadRecorded: 0.001,
    lowestFpsRecorded: 60,
    graphRenderId: 0,
  });

  /**
   * RE-CALCULATE HARDWARE EFFICIENCY STATES
   * Evaluates historical records to determine current system performance ratings.
   */
  useEffect(() => {
    const telemetry = telemetryHistoryRef.current;
    const activeTimestamp = performance.now();

    // Push new hardware telemetry sample straight into the operational ring-buffer array
    telemetry.samplesBuffer.push({
      fpsValue: fps,
      computeDurationMs: cycleTime,
      timestamp: activeTimestamp,
    });

    // Enforce strict memory limits by popping old data indexes out of the buffer pipeline
    if (telemetry.samplesBuffer.length > telemetry.maxBufferSize) {
      telemetry.samplesBuffer.shift();
    }

    // High-precision peaks evaluation calculations
    if (cycleTime > telemetry.peakComputeLoadRecorded) {
      telemetry.peakComputeLoadRecorded = cycleTime;
    }
    if (fps < telemetry.lowestFpsRecorded && fps > 1) {
      telemetry.lowestFpsRecorded = fps;
    }

    /**
     * SIMPLE MOVING AVERAGE (SMA) ALGORITHM
     * Filters high-frequency spikes to extract clear performance trendlines.
     * $$SMA = \frac{1}{k} \sum_{i=n-k+1}^{n} p_i$$
     */
    const computePerformanceMovingAverage = (): number => {
      const totalAvailableSamples = telemetry.samplesBuffer.length;
      if (totalAvailableSamples === 0) return 0;

      const activeWindowSize = Math.min(telemetry.movingAverageWindow, totalAvailableSamples);
      let cumulativeSum = 0;

      for (let i = totalAvailableSamples - activeWindowSize; i < totalAvailableSamples; i++) {
        cumulativeSum += telemetry.samplesBuffer[i].computeDurationMs;
      }

      return parseFloat((cumulativeSum / activeWindowSize).toFixed(3));
    };

    const calculatedSma = computePerformanceMovingAverage();
    setSmoothedComputeLoad(calculatedSma);

    // Evaluate structural performance boundaries to update layout state notifications
    if (calculatedSma > 4.5 || fps < 45) {
      setSystemHealthRating("HARDWARE_THROTTLING_DEGRADED");
    } else if (calculatedSma > 2.0 || fps < 55) {
      setSystemHealthRating("LOAD_ELEVATED_STABLE");
    } else {
      setSystemHealthRating("OPTIMAL");
    }
  }, [fps, cycleTime, totalCycles]);

  /**
   * HIGH-DENSITY SPARKLINE RENDERING ENGINE
   * Draws a vector chart directly onto a sub-pixel canvas overlay layer.
   */
  useEffect(() => {
    const plotTelemetryVisualWaveform = () => {
      const canvas = sparklineCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bufferData = telemetryHistoryRef.current.samplesBuffer;
      const totalDataPoints = bufferData.length;

      // Clear layout background with complete alpha transparency transparency ratios
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (totalDataPoints < 2) return;

      const layoutWidth = canvas.width;
      const layoutHeight = canvas.height;
      const structuralStepX = layoutWidth / (telemetryHistoryRef.current.maxBufferSize - 1);

      // Find global metrics scales to adjust vertical coordinate limits dynamically
      let maxLoadValue = 1.5; 
      for (let i = 0; i < totalDataPoints; i++) {
        if (bufferData[i].computeDurationMs > maxLoadValue) {
          maxLoadValue = bufferData[i].computeDurationMs;
        }
      }
      // Add padding room above graph lines to maximize readability
      maxLoadValue *= 1.25;

      // Draw horizontal reference grid coordinate vectors lines
      ctx.strokeStyle = "rgba(6, 182, 212, 0.05)";
      ctx.lineWidth = 0.5;
      
      ctx.beginPath();
      ctx.moveTo(0, layoutHeight * 0.25); ctx.lineTo(layoutWidth, layoutHeight * 0.25);
      ctx.moveTo(0, layoutHeight * 0.50); ctx.lineTo(layoutWidth, layoutHeight * 0.50);
      ctx.moveTo(0, layoutHeight * 0.75); ctx.lineTo(layoutWidth, layoutHeight * 0.75);
      ctx.stroke();

      // Begin vector chart plot trajectory calculations
      ctx.beginPath();
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = systemHealthRating === "OPTIMAL" ? "rgba(34, 211, 238, 0.7)" : "rgba(248, 113, 113, 0.6)";

      for (let idx = 0; idx < totalDataPoints; idx++) {
        const coordinateX = idx * structuralStepX;
        // Invert Y coordinate matching canvas orientation boundaries
        const normalizedYRatio = bufferData[idx].computeDurationMs / maxLoadValue;
        const coordinateY = layoutHeight - (normalizedYRatio * layoutHeight);

        if (idx === 0) {
          ctx.moveTo(coordinateX, coordinateY);
        } else {
          ctx.lineTo(coordinateX, coordinateY);
        }
      }
      ctx.stroke();

      // Build closed gradient area under the plotted vector trace line
      ctx.lineTo((totalDataPoints - 1) * structuralStepX, layoutHeight);
      ctx.lineTo(0, layoutHeight);
      ctx.closePath();
      
      const backgroundAreaGradient = ctx.createLinearGradient(0, 0, 0, layoutHeight);
      backgroundAreaGradient.addColorStop(0, "rgba(6, 182, 212, 0.08)");
      backgroundAreaGradient.addColorStop(1, "rgba(6, 182, 212, 0.00)");
      ctx.fillStyle = backgroundAreaGradient;
      ctx.fill();
    };

    telemetryHistoryRef.current.graphRenderId = requestAnimationFrame(plotTelemetryVisualWaveform);
    return () => {
      cancelAnimationFrame(telemetryHistoryRef.current.graphRenderId);
    };
  }, [totalCycles, systemHealthRating]);

  // Read direct history buffer state metrics securely
  const historicalAverages = useMemo(() => {
    return {
      peak: telemetryHistoryRef.current.peakComputeLoadRecorded.toFixed(3),
      floor: telemetryHistoryRef.current.lowestFpsRecorded
    };
  }, [totalCycles]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 overflow-hidden global-diagnostics-overlay-plane">
      
      {/* Maximum Capacity Style Sheet System Rules */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtleVignettePulseAnimation {
          0%, 100% { opacity: 0.86; transform: scale(1.00); }
          50% { opacity: 0.94; transform: scale(1.012); }
        }
        @keyframes shiftingTelemetryRowText {
          0%, 100% { transform: translateX(0); opacity: 0.28; text-shadow: 0 0 2px rgba(6,182,212,0.1); }
          50% { transform: translateX(5px); opacity: 0.60; text-shadow: 0 0 8px rgba(6,182,212,0.6); }
        }
        @keyframes dynamicGlitchStripScroll {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .void-radial-vignette-plate {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 20%, rgba(2, 2, 4, 0.42) 58%, #020203 100%);
          animation: subtleVignettePulseAnimation 11s infinite ease-in-out;
        }
        .telemetry-row-item-string {
          font-family: monospace;
          font-size: 8px;
          color: rgba(6, 182, 212, 0.45);
          letter-spacing: 0.26em;
          animation: shiftingTelemetryRowText 6s infinite ease-in-out;
          text-transform: uppercase;
        }
        .telemetry-row-item-degraded {
          color: rgba(248, 113, 113, 0.45);
        }
        .glitch-scanline-strip-element {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: rgba(34, 211, 238, 0.015);
          animation: dynamicGlitchStripScroll 14s infinite linear;
        }
        .interactive-hud-button-trigger {
          pointer-events: auto;
          background: rgba(4, 4, 6, 0.6);
          border: 1px solid rgba(6, 182, 212, 0.15);
          font-family: monospace;
          font-size: 7.5px;
          color: rgba(6, 182, 212, 0.5);
          letter-spacing: 0.15em;
          padding: 3px 6px;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .interactive-hud-button-trigger:hover {
          color: #22d3ee;
          border-color: rgba(34, 211, 238, 0.4);
          background: rgba(6, 182, 212, 0.1);
        }
      `}} />

      {/* COMPONENT MODULE 1: DEEP VIEWPORT AMBIENT SHADING VIGNETTE */}
      <div className="void-radial-vignette-plate" />
      
      {/* COMPONENT MODULE 2: CONSTANT SCROLLING SCANLINE TICK STRIP */}
      <div className="glitch-scanline-strip-element" />

      {/* COMPONENT MODULE 3: HIGH-SPEC TELEMETRY DATA PANEL OVERLAY */}
      <div className="absolute bottom-8 right-8 flex flex-col space-y-1.5 text-right tracking-widest z-30">
        
        {/* Real-time Interactive HUD Toggle Button Interface Row */}
        <div className="flex justify-end mb-1.5">
          <button 
            onClick={() => setIsExtendedViewActive(!isExtendedViewActive)}
            className="interactive-hud-button-trigger"
          >
            {isExtendedViewActive ? "COLLAPSE_DIAG_HUD" : "EXTEND_DIAG_HUD"}
          </button>
        </div>

        <div className="telemetry-row-item-string flex items-center justify-end gap-2">
          <span className={`w-1 h-1 rounded-full animate-pulse ${systemHealthRating === "OPTIMAL" ? "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,1)]" : "bg-red-400"}`} />
          <span>NOS_CORE_KERNEL_HEALTH: {systemHealthRating}</span>
        </div>
        
        <div className="telemetry-row-item-string">
          <span>ACTIVE_PARTICLE_CELLS: {activeCells} UNITS_MOUNTED</span>
        </div>
        
        <div className="telemetry-row-item-string">
          <span>HARDWARE_FRAME_CLOCK: {fps} FPS_STEADY_FREQUENCY</span>
        </div>

        {/* Dynamic Canvas Sparkline Telemetry Waveform Core Module */}
        <div className="w-40 h-8 my-1 border border-zinc-900/40 bg-zinc-950/20 rounded-2xs flex justify-end items-end relative overflow-hidden self-end">
          <canvas 
            ref={sparklineCanvasRef} 
            width={160} 
            height={32}
            className="w-full h-full opacity-60"
          />
        </div>
        
        <div className="telemetry-row-item-string">
          <span>INSTANT_COMPUTE_TIME: {cycleTime} MS_CORE_DELTA</span>
        </div>

        {/* Extended Systems Diagnostics Data Fields Matrix */}
        {isExtendedViewActive && (
          <>
            <div className="telemetry-row-item-string">
              <span>SMOOTHED_COMPUTE_SMA: {smoothedComputeLoad} MILLISECONDS</span>
            </div>
            <div className="telemetry-row-item-string text-cyan-500/30">
              <span>PEAK_COMPUTE_SPIKE: {historicalAverages.peak} MS_RECORDED</span>
            </div>
            <div className="telemetry-row-item-string text-cyan-500/30">
              <span>MINIMUM_CRITICAL_FPS: {historicalAverages.floor} FPS_RECORDED</span>
            </div>
            <div className="telemetry-row-item-string">
              <span>TOTAL_COMPUTE_PASSES: {totalCycles} PIPELINE_CYCLES</span>
            </div>
            <div className="telemetry-row-item-string font-bold text-zinc-600">
              <span>OPERATOR_HANDLE: WARE_MICHAEL_ALONZA_P</span>
            </div>
          </>
        )}
      </div>

      {/* COMPONENT MODULE 4: VIEWPORT TRANSITION SHADING BOUNDS */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020203] via-[#020203]/60 to-transparent z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020203] via-[#020203]/60 to-transparent z-20" />
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#020203]/30 to-transparent z-20" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#020203]/30 to-transparent z-20" />
    </div>
  );
}
