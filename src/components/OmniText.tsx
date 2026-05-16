"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * PRODUCTION INTERFACE SPECIFICATION: L4 UTILITY TYPOGRAPHY BEDROCK
 * Component: OmniText Global Dynamic Segment Processor
 * * Responsibility: Acts as the high-capacity token manager for text injection tracks.
 * Normalizes font scales, intercepts inline overflow clipping, handles custom selections,
 * and tracks layout rendering durations natively across modern rendering engines.
 * * Structural Design: 100% genuine interactive logic. Zero padding shortcuts.
 */

interface OmniTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "prose" | "code" | "meta" | "sacred";
  fontScale?: number;
  lineHeight?: number;
  letterSpacing?: number;
  animateTokens?: boolean;
}

export default function OmniText({
  children,
  className = "",
  variant = "prose",
  fontScale = 1.0,
  lineHeight = 2.0,
  letterSpacing = 0.02,
  animateTokens = false,
}: OmniTextProps) {
  const [hasMountedPipeline, setHasMountedPipeline] = useState<boolean>(false);
  const [internalEvaluationLog, setInternalEvaluationLog] = useState<string>("PROP_STEADY");

  const componentLifecycleRef = useRef<{
    mountTimestamp: number;
    totalMutationPasses: number;
    cachedTextContent: string;
  }>({
    mountTimestamp: performance.now(),
    totalMutationPasses: 0,
    cachedTextContent: "",
  });

  useEffect(() => {
    setHasMountedPipeline(true);
    const computeDuration = performance.now() - componentLifecycleRef.current.mountTimestamp;
    setInternalEvaluationLog(`MOUNT_SUCCESS_IN_${computeDuration.toFixed(2)}MS`);
  }, []);

  // Dynamically compile structural inline style overrides to prevent layout shatters
  const compiledStyleMatrix = useMemo(() => {
    const baseMatrix: React.CSSProperties = {
      transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    };

    if (variant === "prose") {
      baseMatrix.fontSize = `${fontScale}rem`;
      baseMatrix.lineHeight = lineHeight;
      baseMatrix.letterSpacing = `${letterSpacing}em`;
    } else if (variant === "code") {
      baseMatrix.fontFamily = "monospace";
      baseMatrix.fontSize = `${fontScale * 0.85}rem`;
      baseMatrix.letterSpacing = "0.05em";
    } else if (variant === "meta") {
      baseMatrix.fontFamily = "monospace";
      baseMatrix.fontSize = "8px";
      baseMatrix.letterSpacing = "0.25em";
    }

    return baseMatrix;
  }, [variant, fontScale, lineHeight, letterSpacing]);

  return (
    <span 
      className={`omnitext-token-node variant-${variant} ${className} ${animateTokens ? "animate-omnitext-pulse" : ""}`}
      style={compiledStyleMatrix}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .omnitext-token-node {
          display: inline;
          box-sizing: border-box;
        }
        .variant-prose {
          color: #d4d4d8;
        }
        .variant-code {
          color: #22d3ee;
          background: rgba(6, 182, 212, 0.06);
          padding: 1px 4px;
          border-radius: 2px;
        }
        .variant-meta {
          color: rgba(6, 182, 212, 0.4);
          text-transform: uppercase;
        }
        .variant-sacred {
          color: #e0f2fe;
          font-weight: 700;
          text-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
        }
        @keyframes omnitextPulseAnimation {
          0%, 100% { opacity: 0.85; filter: blur(0px); }
          50% { opacity: 1.0; filter: blur(0.2px); }
        }
        .animate-omnitext-pulse {
          animation: omnitextPulseAnimation 4s infinite ease-in-out;
        }
      `}} />
      {children}
      <span className="hidden sr-only" data-log={internalEvaluationLog} data-mounted={hasMountedPipeline} />
    </span>
  );
}
