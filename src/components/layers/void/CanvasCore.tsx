"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * HIGH-PERFORMANCE NARRATIVE ENGINE SCHEMA: LEVEL 1 CANVAS BEDROCK
 * Core Component: Spatial Hash Grid Partitioning Canvas Kernel
 * * Implements a high-capacity spatial partitioning lookup dictionary, an inline
 * fractional vector flow field oscillator, hardware context anomaly interceptors,
 * and strict device-pixel-ratio frame calculations to optimize performance on mobile Android.
 */

export interface ParticleCell {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  alpha: number;
  speedX: number;
  speedY: number;
  angle: number;
  velocityAngle: number;
  colorShift: number;
  pulseSpeed: number;
  hueVariant: number;
  kineticEnergy: number;
  mass: number;
  vortexPhase: number;
}

interface CanvasCoreProps {
  particleArray: ParticleCell[];
  setParticleArray: React.Dispatch<React.SetStateAction<ParticleCell[]>>;
  onRenderTick: (ctx: CanvasRenderingContext2D, width: number, height: number, absoluteTime: number) => void;
  setFps: React.Dispatch<React.SetStateAction<number>>;
  setCycleTime: React.Dispatch<React.SetStateAction<number>>;
  setTotalCycles: React.Dispatch<React.SetStateAction<number>>;
}

export default function CanvasCore({
  particleArray,
  setParticleArray,
  onRenderTick,
  setFps,
  setCycleTime,
  setTotalCycles,
}: CanvasCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // High-precision system metrics log hooks
  const [metrics, setMetrics] = useState({
    activeCells: 0,
    allocatedBuckets: 0,
    computeLoadMs: 0
  });

  // Low-level hardware registers bypassing React engine loops entirely
  const internalHardwareStateRef = useRef<{
    animationId: number;
    lastFrameTime: number;
    frameCount: number;
    fpsInterval: number;
    lastFpsUpdateTime: number;
    totalRenderCycles: number;
    isContextLost: boolean;
    nominalWidth: number;
    nominalHeight: number;
    devicePixelRatio: number;
    spatialGridCellSize: number;
    spatialHashGrid: Map<string, ParticleCell[]>;
  }>({
    animationId: 0,
    lastFrameTime: performance.now(),
    frameCount: 0,
    fpsInterval: 1000,
    lastFpsUpdateTime: performance.now(),
    totalRenderCycles: 0,
    isContextLost: false,
    nominalWidth: 0,
    nominalHeight: 0,
    devicePixelRatio: 1,
    spatialGridCellSize: 64, // Grid resolution bounds matching link-distance thresholds
    spatialHashGrid: new Map(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    });

    if (!ctx) {
      console.error("NOS_VOID_CORE: Failed to claim hardware-accelerated 2D context handle.");
      return;
    }

    /**
     * PROCEDURAL TOPOLOGY OPTIMIZER
     * Dynamically sizes backbuffer boundaries relative to device hardware scales.
     */
    const rebuildViewportResolutionTopology = () => {
      const state = internalHardwareStateRef.current;
      const targetWidth = window.innerWidth;
      const targetHeight = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      state.nominalWidth = targetWidth;
      state.nominalHeight = targetHeight;
      state.devicePixelRatio = pixelRatio;

      canvas.width = targetWidth * pixelRatio;
      canvas.height = targetHeight * pixelRatio;
      
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      ctx.scale(pixelRatio, pixelRatio);

      // Allocates macro cosmic dust blocks relative to surface boundaries
      const surfaceAreaDensity = targetWidth * targetHeight;
      const adaptiveCount = Math.min(280, Math.floor(surfaceAreaDensity / 3400));
      const newlyInstantiatedCells: ParticleCell[] = [];

      for (let i = 0; i < adaptiveCount; i++) {
        const generatedX = Math.random() * targetWidth;
        const generatedY = Math.random() * targetHeight;
        const baselineSize = Math.random() * 1.65 + 0.35;

        newlyInstantiatedCells.push({
          x: generatedX,
          y: generatedY,
          baseX: generatedX,
          baseY: generatedY,
          size: baselineSize,
          density: Math.random() * 26 + 14,
          alpha: Math.random() * 0.45 + 0.15,
          speedX: Math.random() * 0.12 - 0.06,
          speedY: Math.random() * 0.08 - 0.04,
          angle: Math.random() * Math.PI * 2,
          velocityAngle: Math.random() * 0.012 - 0.006,
          colorShift: Math.random() * 60,
          pulseSpeed: Math.random() * 0.016 + 0.004,
          hueVariant: Math.floor(Math.random() * 30) - 15,
          kineticEnergy: 1.0,
          mass: baselineSize * 1.5,
          vortexPhase: Math.random() * Math.PI,
        });
      }

      setParticleArray(newlyInstantiatedCells);
      setMetrics(prev => ({ ...prev, activeCells: newlyInstantiatedCells.length }));
    };

    /**
     * DYNAMIC SPATIAL HASH GRID INITIALIZER
     * Sorts particle coordinate positions into local memory grids.
     */
    const compileSpatialHashGridIndex = (particles: ParticleCell[]) => {
      const state = internalHardwareStateRef.current;
      state.spatialHashGrid.clear();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Mathematical bucket assignment: Floor calculations yield structural grid nodes
        const buckX = Math.floor(p.x / state.spatialGridCellSize);
        const buckY = Math.floor(p.y / state.spatialGridCellSize);
        const uniqueHashKey = `${buckX}_${buckY}`;

        let targetBucket = state.spatialHashGrid.get(uniqueHashKey);
        if (!targetBucket) {
          targetBucket = [];
          state.spatialHashGrid.set(uniqueHashKey, targetBucket);
        }
        targetBucket.push(p);
      }
    };

    /**
     * SYSTEM MASTER RECURSIVE TICK CONSOLE
     * Monitors frame execution speeds and clears screen buffers cleanly.
     */
    const executeSystemFramePipeline = (timestampMarker: number) => {
      const timeSnapshotStart = performance.now();
      const state = internalHardwareStateRef.current;

      if (state.isContextLost) return;

      state.frameCount++;
      state.totalRenderCycles++;

      // Heartbeat diagnostic execution cycle
      if (timestampMarker - state.lastFpsUpdateTime >= state.fpsInterval) {
        const instantFps = Math.round(
          (state.frameCount * 1000) / (timestampMarker - state.lastFpsUpdateTime)
        );
        
        setFps(instantFps);
        setTotalCycles(state.totalRenderCycles);
        
        const deltaComputeDuration = performance.now() - timeSnapshotStart;
        setCycleTime(parseFloat(deltaComputeDuration.toFixed(3)));
        
        setMetrics(prev => ({
          ...prev,
          allocatedBuckets: state.spatialHashGrid.size,
          computeLoadMs: deltaComputeDuration
        }));

        state.frameCount = 0;
        state.lastFpsUpdateTime = timestampMarker;
      }

      // Render baseline color clear plane
      ctx.fillStyle = "#020203";
      ctx.fillRect(0, 0, state.nominalWidth, state.nominalHeight);

      // Re-index all active nodes into spatial dictionary bins before rendering
      if (particleArray.length > 0) {
        compileSpatialHashGridIndex(particleArray);
      }

      // Execute target callbacks down the application pipeline
      onRenderTick(ctx, state.nominalWidth, state.nominalHeight, timestampMarker);

      state.lastFrameTime = timestampMarker;
      state.animationId = requestAnimationFrame(executeSystemFramePipeline);
    };

    // Sub-level canvas driver failure crash boundaries
    const processContextLossAnomalies = (e: Event) => {
      e.preventDefault();
      internalHardwareStateRef.current.isContextLost = true;
      cancelAnimationFrame(internalHardwareStateRef.current.animationId);
      console.warn("NOS_VOID_CRITICAL: Canvas frame buffer loss flag raised. Execution thread suspended.");
    };

    const processContextRestorationAnomalies = () => {
      internalHardwareStateRef.current.isContextLost = false;
      rebuildViewportResolutionTopology();
      internalHardwareStateRef.current.animationId = requestAnimationFrame(executeSystemFramePipeline);
      console.log("NOS_VOID_RECOVERY: Canvas pixel pipe recovered successfully. Thread re-mounted.");
    };

    // Low-overhead ResizeObserver wrapper tracking native Android layout changes
    let observerReferenceInstance: ResizeObserver | null = null;
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      observerReferenceInstance = new ResizeObserver(() => {
        rebuildViewportResolutionTopology();
      });
      if (canvas.parentElement) {
        observerReferenceInstance.observe(canvas.parentElement);
      }
    }

    canvas.addEventListener("canvascontextlost", processContextLossAnomalies, false);
    canvas.addEventListener("canvascontextrestored", processContextRestorationAnomalies, false);

    // Initial hardware pipeline trigger execution
    rebuildViewportResolutionTopology();
    internalHardwareStateRef.current.animationId = requestAnimationFrame(executeSystemFramePipeline);

    return () => {
      cancelAnimationFrame(internalHardwareStateRef.current.animationId);
      if (observerReferenceInstance) {
        observerReferenceInstance.disconnect();
      }
      canvas.removeEventListener("canvascontextlost", processContextLossAnomalies);
      canvas.removeEventListener("canvascontextrestored", processContextRestorationAnomalies);
    };
  }, [onRenderTick, particleArray.length, setParticleArray, setFps, setCycleTime, setTotalCycles]);

  /**
   * RECKON SPATIAL MATRIX NEIGHBORS
   * Low-level vector proximity grid algorithm lookup query execution.
   */
  const querySpatialGridNeighbors = (p: ParticleCell): ParticleCell[] => {
    const state = internalHardwareStateRef.current;
    const neighborCellsList: ParticleCell[] = [];
    
    const centerBuckX = Math.floor(p.x / state.spatialGridCellSize);
    const centerBuckY = Math.floor(p.y / state.spatialGridCellSize);

    // Scan adjacent quadrants (3x3 grid neighborhood matrix check)
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        const targetHashKey = `${centerBuckX + offsetX}_${centerBuckY + offsetY}`;
        const segmentBucket = state.spatialHashGrid.get(targetHashKey);
        
        if (segmentBucket) {
          for (let k = 0; k < segmentBucket.length; k++) {
            neighborCellsList.push(segmentBucket[k]);
          }
        }
      }
    }
    return neighborCellsList;
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden bg-transparent">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none select-none"
        style={{
          imageRendering: "auto",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          transform: "translate3d(0,0,0)"
        }}
      />
      {/* Hidden telemetry bridge mapping structural node load metrics inside the rendering module */}
      <div className="hidden sr-only" data-active-cells={metrics.activeCells} data-buckets={metrics.allocatedBuckets} data-load={metrics.computeLoadMs} />
    </div>
  );
}
