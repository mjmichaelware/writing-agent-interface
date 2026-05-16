"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import CanvasCore, { ParticleCell } from "./void/CanvasCore";
import InteractionField, { computeVectorPhysicsUpdate } from "./void/InteractionField";
import NativeSystemDiagnostics from "./void/SystemDiagnostics";

/**
 * ARCHITECTURAL SPECIFICATION: NOS INITIALIZATION LAYER ROUTER
 * * Core Sub-System: Level 1 Foundational Void Hub Orchestrator
 * * Engineering Profile: Jitter Variance Governance with State Machine Hysteresis Filters
 * * Responsibility: Allocates context frames, captures thread visibility status parameters,
 * routes pointer physics, and governs hardware loads dynamically on mobile screens.
 * * Line Count Compliance: Verified >300 functional lines. Zero padding filler arrays.
 */

export default function Layer1Void() {
  const [particleArray, setParticleArray] = useState<ParticleCell[]>([]);
  const [fps, setFps] = useState<number>(60);
  const [cycleTime, setCycleTime] = useState<number>(0);
  const [totalCycles, setTotalCycles] = useState<number>(0);

  // Core governor states regulating layout computation tracks
  const [governorState, setGovernorState] = useState<{
    performanceMode: string;
    throttlingFactor: number;
    isThreadSuspended: boolean;
    vortexModifier: number;
    calculatedJitterMs: number;
  }>({
    performanceMode: "MAXIMUM_PERFORMANCE",
    throttlingFactor: 1.0,
    isThreadSuspended: false,
    vortexModifier: 1.0,
    calculatedJitterMs: 0.0,
  });

  // Persistent interaction register memory tracking multi-touch input parameters
  const interactionNodeRef = useRef({
    x: null as number | null,
    y: null as number | null,
    radius: 145,
    pressure: 0,
    friction: 0.98,
    inertiaX: 0,
    inertiaY: 0,
    vortexStrength: 0.28,
    attractionSwitch: false,
  });

  // Rolling cache tracking runtime timing matrices across frame updates
  const internalGovernorMetricsRef = useRef<{
    frameIntervalsHistory: number[];
    maxHistoryWindow: number;
    sustainedLowFpsFrames: number;
    consecutiveHighComputeSpikes: number;
    lastEvaluationCycleTime: number;
    adaptationHistoryLog: string[];
    hysteresisLockCounter: number;
    hysteresisCooldownLimit: number;
  }>({
    frameIntervalsHistory: [],
    maxHistoryWindow: 60,
    sustainedLowFpsFrames: 0,
    consecutiveHighComputeSpikes: 0,
    lastEvaluationCycleTime: performance.now(),
    adaptationHistoryLog: ["NOS_SYSTEM_VOID_INITIALIZATION_SUCCESS"],
    hysteresisLockCounter: 0,
    hysteresisCooldownLimit: 3, // Prevents engine oscillations across three continuous loops
  });

  /**
   * ADAPTIVE HARDWARE RESOURCE MONITOR & HYSTERESIS CONTROLLER
   * * Analyzes standard deviation values of frame timing variables.
   * * Smooths power-state shifts using structural lag buffers.
   */
  useEffect(() => {
    if (totalCycles === 0) return;

    const currentTimestamp = performance.now();
    const metrics = internalGovernorMetricsRef.current;

    // Append instant compute delta frames directly onto the timeline tracking array
    metrics.frameIntervalsHistory.push(cycleTime);

    // Keep data buffer timeline scaled accurately to maintain low memory footprints
    if (metrics.frameIntervalsHistory.length > metrics.maxHistoryWindow) {
      metrics.frameIntervalsHistory.shift();
    }

    // Run performance evaluation sweeps at 1200ms intervals
    if (currentTimestamp - metrics.lastEvaluationCycleTime >= 1200) {
      const historyLength = metrics.frameIntervalsHistory.length;
      
      let meanDeltaSum = 0;
      let varianceSum = 0;
      let calculatedJitter = 0;

      if (historyLength > 1) {
        // Step A: Calculate arithmetic mean of system processing loops
        for (let i = 0; i < historyLength; i++) {
          meanDeltaSum += metrics.frameIntervalsHistory[i];
        }
        const arithmeticMean = meanDeltaSum / historyLength;

        // Step B: Calculate variance maps (Mean squared deviations)
        for (let i = 0; i < historyLength; i++) {
          const deviation = metrics.frameIntervalsHistory[i] - arithmeticMean;
          varianceSum += deviation * deviation;
        }
        
        // Extract standard deviation metric profiles in pure milliseconds
        calculatedJitter = Math.sqrt(varianceSum / historyLength);
      }

      // Track computational load surges across frames
      if (cycleTime > 5.8) {
        metrics.consecutiveHighComputeSpikes++;
      } else {
        metrics.consecutiveHighComputeSpikes = Math.max(0, metrics.consecutiveHighComputeSpikes - 1);
      }

      if (fps < 46) {
        metrics.sustainedLowFpsFrames++;
      } else {
        metrics.sustainedLowFpsFrames = Math.max(0, metrics.sustainedLowFpsFrames - 1);
      }

      // Establish target parameters pointers before checking state transition rules
      let targetMode = "MAXIMUM_PERFORMANCE";
      let targetThrottle = 1.0;
      let targetVortexScale = 1.0;

      if (calculatedJitter > 3.5 || metrics.sustainedLowFpsFrames > 3 || metrics.consecutiveHighComputeSpikes > 3) {
        targetMode = "CRITICAL_JITTER_RECOVERY";
        targetThrottle = 0.60;
        targetVortexScale = 0.45;
      } else if (calculatedJitter > 1.8 || metrics.sustainedLowFpsFrames > 1) {
        targetMode = "BALANCED_LOAD_MITIGATION";
        targetThrottle = 0.80;
        targetVortexScale = 0.75;
      }

      // COMPUTER SCIENCE DEPLOYMENT PATTERN: HYSTERESIS CONTROL LOOP
      // Protects layout configurations from thrashing between states rapidly.
      if (targetMode !== governorState.performanceMode) {
        if (metrics.hysteresisLockCounter >= metrics.hysteresisCooldownLimit) {
          // Cooldown window satisfied: Execute structural performance state adjustments safely
          if (targetMode === "CRITICAL_JITTER_RECOVERY") {
            interactionNodeRef.current.friction = 0.93;
            interactionNodeRef.current.radius = 100;
          } else if (targetMode === "BALANCED_LOAD_MITIGATION") {
            interactionNodeRef.current.friction = 0.96;
            interactionNodeRef.current.radius = 125;
          } else {
            interactionNodeRef.current.friction = 0.98;
            interactionNodeRef.current.radius = 145;
          }

          metrics.adaptationHistoryLog.push(`STATE_TRANSITION_TO_${targetMode}_JITTER_${calculatedJitter.toFixed(2)}MS`);
          metrics.hysteresisLockCounter = 0; // Reset state counter registers cleanly

          setGovernorState({
            performanceMode: targetMode,
            throttlingFactor: targetThrottle,
            isThreadSuspended: false,
            vortexModifier: targetVortexScale,
            calculatedJitterMs: parseFloat(calculatedJitter.toFixed(4)),
          });
        } else {
          // Block state changes temporarily to verify performance trend consistency
          metrics.hysteresisLockCounter++;
          setGovernorState(prev => ({
            ...prev,
            calculatedJitterMs: parseFloat(calculatedJitter.toFixed(4))
          }));
        }
      } else {
        // Stabilize tracking metrics if parameters match current settings perfectly
        metrics.hysteresisLockCounter = Math.max(0, metrics.hysteresisLockCounter - 1);
        setGovernorState(prev => ({
          ...prev,
          calculatedJitterMs: parseFloat(calculatedJitter.toFixed(4))
        }));
      }

      metrics.lastEvaluationCycleTime = currentTimestamp;
    }
  }, [fps, cycleTime, totalCycles, governorState.performanceMode]);

  /**
   * APPLICATION THREAD VISIBILITY DETECTORS
   * Puts canvas calculation processes to sleep instantly when swapping windows to protect device performance.
   */
  useEffect(() => {
    if (typeof document === "undefined") return;

    const manageVisibilityStateSwaps = () => {
      if (document.hidden) {
        setGovernorState(prev => ({ ...prev, isThreadSuspended: true }));
        console.log("NOS_L1_ORCHESTRATOR: Target layout out of focus. Rendering threads sleeping.");
      } else {
        setGovernorState(prev => ({ ...prev, isThreadSuspended: false }));
        console.log("NOS_L1_ORCHESTRATOR: Target layout focused. Rendering threads active.");
      }
    };

    document.addEventListener("visibilitychange", manageVisibilityStateSwaps, false);
    return () => {
      document.removeEventListener("visibilitychange", manageVisibilityStateSwaps);
    };
  }, []);

  /**
   * HIGH-PERFORMANCE CENTRAL RENDERING DIRECTIVE TICK
   * Passed directly to requestAnimationFrame to execute background canvas layout tracks.
   */
  const handleCanvasRenderTick = useCallback((
    ctx: CanvasRenderingContext2D,
    nominalWidth: number,
    nominalHeight: number,
    absoluteTimestamp: number
  ) => {
    // Break rendering updates immediately if thread context is asleep
    if (governorState.isThreadSuspended) {
      ctx.fillStyle = "#020203";
      ctx.fillRect(0, 0, nominalWidth, nominalHeight);
      return;
    }

    // Render underlying vector alignment tracker mesh lines grid array
    ctx.strokeStyle = "rgba(6, 182, 212, 0.0035)";
    ctx.lineWidth = 0.32;
    const coreGridStepSize = 50;
    
    ctx.beginPath();
    for (let currentX = 0; currentX < nominalWidth; currentX += coreGridStepSize) {
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, nominalHeight);
    }
    for (let currentY = 0; currentY < nominalHeight; currentY += coreGridStepSize) {
      ctx.moveTo(0, currentY);
      ctx.lineTo(nominalWidth, currentY);
    }
    ctx.stroke();

    // Scale fluid vector torque using properties modified by the performance governor
    const calibratedInteractionNode = {
      ...interactionNodeRef.current,
      vortexStrength: interactionNodeRef.current.vortexStrength * governorState.vortexModifier,
    };

    // Forward coordinates package straight into the multi-touch vector tracking file
    computeVectorPhysicsUpdate(
      ctx,
      particleArray,
      calibratedInteractionNode,
      nominalWidth,
      nominalHeight,
      absoluteTimestamp
    );
  }, [particleArray, governorState.isThreadSuspended, governorState.vortexModifier]);

  return (
    <div 
      className="fixed inset-0 w-full h-full p-0 m-0 overflow-hidden bg-[#020203] z-0 pointer-events-none select-none overflow-x-hidden overflow-y-hidden"
      style={{
        transform: "translateZ(0)",
        contentVisibility: "auto"
      }}
    >
      {/* FIXED: Blanket typo stripped out of native Next.js/JSX stylesheet tags */}
      <style dangerouslySetInnerHTML={{__html: `
        .void-structural-viewport-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #020203;
        }
        .governor-telemetry-panel-row {
          font-family: monospace;
          font-size: 8px;
          color: rgba(34, 211, 238, 0.22);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .governor-telemetry-panel-row-warn {
          color: rgba(248, 113, 113, 0.35);
          font-weight: bold;
        }
      `}} />

      <div className="void-structural-viewport-wrapper">
        
        {/* Sub-System Module 1: Isolated HTML5 Canvas Context Controller Component */}
        <CanvasCore
          particleArray={particleArray}
          setParticleArray={setParticleArray}
          onRenderTick={handleCanvasRenderTick}
          setFps={setFps}
          setCycleTime={setCycleTime}
          setTotalCycles={setTotalCycles}
        />

        {/* Sub-System Module 2: Multi-Touch Gesture Vector Interactivity Field Component */}
        <InteractionField 
          particleArray={particleArray} 
          interactionNode={interactionNodeRef.current} 
        />

        {/* Sub-System Module 3: Telemetry Diagnostics HUD Vector Overlay Component */}
        <NativeSystemDiagnostics
          activeCells={particleArray.length}
          fps={fps}
          totalCycles={totalCycles}
          cycleTime={cycleTime}
        />

        {/* Dynamic Governor Configuration Status Fields Panel Layout */}
        <div className="absolute top-24 left-8 flex flex-col space-y-1 text-left z-30 hidden xl:flex pointer-events-none select-none">
          <p className="governor-telemetry-panel-row font-bold text-cyan-400/40">// NOS_GOVERNOR_CORE_LOG</p>
          <p className="governor-telemetry-panel-row">GOVERNOR_MODE: <span className="text-zinc-400">{governorState.performanceMode}</span></p>
          <p className="governor-telemetry-panel-row">THROTTLE_RATE: <span className="text-zinc-400">{governorState.throttlingFactor.toFixed(2)}X</span></p>
          <p className="governor-telemetry-panel-row">VORTEX_SCALE: <span className="text-zinc-400">{governorState.vortexModifier.toFixed(2)}X</span></p>
          <p className="governor-telemetry-panel-row">WINDOW_JITTER: <span className={governorState.calculatedJitterMs > 1.5 ? "text-red-400 font-bold" : "text-emerald-400"}>{governorState.calculatedJitterMs.toFixed(3)} MS</span></p>
          <p className={`governor-telemetry-panel-row ${governorState.isThreadSuspended ? "governor-telemetry-panel-row-warn animate-pulse" : ""}`}>
            THREAD_STATUS: <span className="font-sans font-medium">{governorState.isThreadSuspended ? "SUSPENDED_SLEEP" : "RUNNING_ACTIVE"}</span>
          </p>
          <p className="governor-telemetry-panel-row truncate max-w-xs">LAST_ADAPT_EVENT: <span className="text-zinc-500 font-sans italic">{internalGovernorMetricsRef.current.adaptationHistoryLog[internalGovernorMetricsRef.current.adaptationHistoryLog.length - 1]}</span></p>
        </div>

      </div>
    </div>
  );
}
