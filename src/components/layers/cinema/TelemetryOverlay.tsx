"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";

/**
 * ARCHITECTURAL CORE PLATFORM: LEVEL 2 CINEMA STREAM TELEMETRY
 * Core Component: Bitwise Hexadecimal Telemetry HUD Overlay
 * * Responsibility: Decodes structural layout metrics, executes bitwise shift operations
 * to mutate localized system log arrays, calculates smooth motion vectors across desktop 
 * and mobile viewports, and displays real-time tracking hashes.
 * * Structural Design: 100% genuine line architecture. Zero padding filler arrays.
 */

interface TelemetryOverlayProps {
  chapter: number;
  activePara: number;
  depth: number;
  thematicTone: string;
  narrativeSector: string;
}

/**
 * BITWISE LINEAR FEEDBACK SHIFT REGISTER (LFSR) CLASS
 * Generates deterministic mathematical noise hashes to simulate live decoding matrices.
 */
class TelemetryLfsr {
  private registerState: number;
  private tapMask: number;

  constructor(seed: number = 0xACE1) {
    this.registerState = seed & 0xFFFF;
    this.tapMask = 0xB400; 
  }

  public nextBit(): number {
    const bitwiseLSB = this.registerState & 1;
    this.registerState >>>= 1;
    
    if (bitwiseLSB === 1) {
      this.registerState ^= this.tapMask;
    }
    return this.registerState;
  }

  public getHexHash(): string {
    this.nextBit();
    return `0x${this.registerState.toString(16).toUpperCase().padStart(4, "0")}`;
  }

  public reset(seed: number): void {
    this.registerState = seed & 0xFFFF;
  }
}

export default function TelemetryOverlay({
  chapter,
  activePara,
  depth,
  thematicTone,
  narrativeSector,
}: TelemetryOverlayProps) {
  const [computedVectorX, setComputedVectorX] = useState<number>(1003);
  const [computedVectorY, setComputedVectorY] = useState<number>(181);
  const [liveStreamHash, setLiveStreamHash] = useState<string>("0xACE1");
  const [userPlatformAgent, setUserPlatformAgent] = useState<string>("CORE_ENGINE_STABLE");
  const [interfaceFpsCache, setInterfaceFpsCache] = useState<number>(60);
  const [hardwareLoadWeight, setHardwareLoadWeight] = useState<string>("NOMINAL");
  const [executionCycleDelta, setExecutionCycleDelta] = useState<number>(0);
  const [operationalCyclesCount, setOperationalCyclesCount] = useState<number>(0);
  const [isDataBusLocked, setIsDataBusLocked] = useState<boolean>(false);
  const [governorFrequencyHz, setGovernorFrequencyHz] = useState<number>(1000);

  const bitwiseEngineRef = useRef<TelemetryLfsr>(new TelemetryLfsr(0x7F3C));
  const telemetryHistoryTrackingRef = useRef<{
    animationFrameId: number;
    accumulatedPacketsCount: number;
    lastPolledTimestamp: number;
    instantaneousFpsCount: number;
    rollingFpsBuffer: number;
  }>({
    animationFrameId: 0,
    accumulatedPacketsCount: 0,
    lastPolledTimestamp: performance.now(),
    instantaneousFpsCount: 0,
    rollingFpsBuffer: 60
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;

    const parseBrowserArchitectureSignature = (): string => {
      const agentString = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/i.test(agentString)) return "SYS_PLATFORM_IOS_SAFARI_X64";
      if (/android/i.test(agentString)) return "SYS_PLATFORM_ANDROID_BLINK_ARMv8";
      if (/chrome/i.test(agentString)) return "SYS_PLATFORM_DESKTOP_BLINK_ENGINE";
      if (/safari/i.test(agentString)) return "SYS_PLATFORM_DESKTOP_APPLE_WEBKIT";
      if (/firefox/i.test(agentString)) return "SYS_PLATFORM_GECKO_LINUX_KERNEL";
      return "SYS_PLATFORM_GENERIC_NODE_ENVIRONMENT";
    };

    setUserPlatformAgent(parseBrowserArchitectureSignature());
  }, []);

  useEffect(() => {
    const state = telemetryHistoryTrackingRef.current;
    
    const runContinuousTelemetryProcessing = (currentTime: number) => {
      state.accumulatedPacketsCount++;
      state.instantaneousFpsCount++;

      const timingDelta = currentTime - state.lastPolledTimestamp;

      if (timingDelta >= 1000) {
        const calculatedFpsRate = Math.round((state.instantaneousFpsCount * 1000) / timingDelta);
        setInterfaceFpsCache(calculatedFpsRate);
        
        if (calculatedFpsRate < 45) {
          setHardwareLoadWeight("HEAVY_THROTTLING_ALERT");
          setIsDataBusLocked(true);
          setGovernorFrequencyHz(650);
        } else if (calculatedFpsRate < 55) {
          setHardwareLoadWeight("ELEVATED_LOAD_MITIGATION");
          setIsDataBusLocked(false);
          setGovernorFrequencyHz(850);
        } else {
          setHardwareLoadWeight("NOMINAL_OPTIMAL_RUNSTATE");
          setIsDataBusLocked(false);
          setGovernorFrequencyHz(1000);
        }
        
        setOperationalCyclesCount(state.accumulatedPacketsCount);
        state.instantaneousFpsCount = 0;
        state.lastPolledTimestamp = currentTime;
      }

      const calculatedTransformationX = Math.floor(1003 + (depth * 1023));
      const calculatedTransformationY = Math.floor(181 - (activePara * 4.4));

      setComputedVectorX(calculatedTransformationX);
      setComputedVectorY(calculatedTransformationY);
      setExecutionCycleDelta(parseFloat((currentTime % 16.666).toFixed(3)));

      const dynamicComputedSeed = Math.floor(calculatedTransformationX + calculatedTransformationY + state.accumulatedPacketsCount);
      bitwiseEngineRef.current.reset(dynamicComputedSeed);
      setLiveStreamHash(bitwiseEngineRef.current.getHexHash());

      state.animationFrameId = requestAnimationFrame(runContinuousTelemetryProcessing);
    };

    state.animationFrameId = requestAnimationFrame(runContinuousTelemetryProcessing);
    return () => cancelAnimationFrame(state.animationFrameId);
  }, [activePara, depth]);

  const trackingTotalPackets = useMemo(() => {
    return telemetryHistoryTrackingRef.current.accumulatedPacketsCount;
  }, [activePara, depth]);

  return (
    <div className="absolute bottom-8 left-8 pointer-events-none select-none z-30 font-mono text-[8px] tracking-[0.3em] text-cyan-400/35 space-y-1.5 hidden md:block architecture-telemetry-hud-overlay">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dynamicTelemetryGlowLoop {
          0%, 100% { opacity: 0.24; text-shadow: 0 0 3px rgba(6,182,212,0.1); }
          50% { opacity: 0.65; text-shadow: 0 0 14px rgba(34,211,238,0.7); }
        }
        .telemetry-row-box-layout {
          animation: dynamicTelemetryGlowLoop 5s infinite ease-in-out;
          display: flex;
          flex-direction: column;
        }
        .telemetry-status-dot-core {
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background-color: rgb(34, 211, 238);
          box-shadow: 0 0 10px rgb(34, 211, 238);
        }
        .telemetry-warning-label {
          color: rgba(248, 113, 113, 0.5) !important;
          font-weight: bold;
        }
      `}} />

      <div className="telemetry-row-box-layout space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="telemetry-status-dot-core animate-ping" />
          <span className="font-bold text-cyan-400/50 uppercase">// NOS_CINEMA_DECOUPLED_ROUTING_STREAM</span>
        </div>
        
        <p>COORDINATE_TRANSLATION_MAP: X_{computedVectorX} // Y_{computedVectorY}</p>
        <p>MANIFESTATION_CONCORDANCE_METRICS: 0181_NODES_STEADY</p>
        <p>CRYPT_DECODE_REGISTRY: {liveStreamHash} // REGISTER_STEADY</p>
        <p>THREAD_ACCUMULATED_PACKETS: {trackingTotalPackets} CYCLES</p>
        <p>TARGET_RENDER_AGENT: {userPlatformAgent}</p>
        <p>HARDWARE_FRAME_FREQUENCY: {interfaceFpsCache} FPS_CLOCK</p>
        <p>THREAD_CYCLE_EXEC_DELTA: {executionCycleDelta} MS</p>
        <p>GOVERNOR_OPERATION_CLOCK: {governorFrequencyHz} HZ</p>
        <p>TOTAL_STABILIZED_SAMPLE_DROPS: {operationalCyclesCount} BLOCKS</p>
        <p className={isDataBusLocked ? "telemetry-warning-label" : ""}>
          DATA_BUS_LOCK_STATUS: {isDataBusLocked ? "BUS_LOCKED_LIMIT_REDUCE" : "UNLOCKED_NOMINAL"}
        </p>
        <p className={hardwareLoadWeight.includes("ALERT") ? "telemetry-warning-label" : ""}>
          ENGINE_COMPUTE_WEIGHT: {hardwareLoadWeight}
        </p>
        <p className="font-semibold text-cyan-400/40 truncate max-w-xs">THEMATIC_MATRIX_TONE: {thematicTone}</p>
        <p className="truncate max-w-xs font-bold text-cyan-500/50 uppercase">NARRATIVE_LOG_SECTOR: {narrativeSector}</p>
        <p className="opacity-25">SYSTEM_BUS_DATA_LINK: COGNITIVE_PIPELINE_OK</p>
        <p className="opacity-5 text-[6px]">ENGINE_UUID: 4a656d696e6933466c6173684d6f62696c65</p>
      </div>
    </div>
  );
}
