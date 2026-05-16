"use client";

import React, { useEffect, useRef } from "react";
import { ParticleCell } from "./CanvasCore";

/**
 * HIGH-CAPACITY VECTOR PROTOCOL: MULTI-TOUCH INTERACTION MECHANICS ENGINE
 * * Module Core: Verlet Velocity Interpolation & Vortex Fluid Momentum Fields
 * * Standards Compliance: Strict ECMAScript 2022 + Type Validation Rails
 * * Systems Utility: Implements a custom 2D Vector arithmetic matrix class,
 * tracks persistent Android pointer mapping indices, handles kinetic inertia decay,
 * and processes cross-product swirl fields against local spatial partitioning cells.
 */

/**
 * LOW-LEVEL VECTOR ARITHMETIC UTILITY CLASS
 * Provides pure mathematical operations for hardware force transformations.
 */
class Vector2D {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public set(x: number, y: number): Vector2D {
    this.x = x;
    this.y = y;
    return this;
  }

  public add(v: Vector2D): Vector2D {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  public sub(v: Vector2D): Vector2D {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  public multiply(scalar: number): Vector2D {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public divide(scalar: number): Vector2D {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector2D {
    const mag = this.magnitude();
    if (mag > 0) {
      this.divide(mag);
    }
    return this;
  }

  public distanceTo(v: Vector2D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public copy(): Vector2D {
    return new Vector2D(this.x, this.y);
  }
}

interface InteractionFieldProps {
  particleArray: ParticleCell[];
  interactionNode: {
    x: number | null;
    y: number | null;
    radius: number;
    pressure: number;
    friction: number;
    inertiaX: number;
    inertiaY: number;
    vortexStrength: number;
    attractionSwitch: boolean;
  };
}

export default function InteractionField({ particleArray, interactionNode }: InteractionFieldProps) {
  const pointerTrackCacheRef = useRef<{
    activePointersMap: Map<number, Vector2D>;
    instantaneousVelocity: Vector2D;
    lastPolledTime: number;
    smoothingWeight: number;
    isPrimaryActive: boolean;
  }>({
    activePointersMap: new Map(),
    instantaneousVelocity: new Vector2D(0, 0),
    lastPolledTime: performance.now(),
    smoothingWeight: 0.35,
    isPrimaryActive: false,
  });

  useEffect(() => {
    // Pipeline processing touch start mechanics inside Android containers
    const handleAndroidTouchStart = (e: TouchEvent) => {
      const cache = pointerTrackCacheRef.current;
      const initialTouchNode = e.touches[0];

      if (initialTouchNode) {
        interactionNode.x = initialTouchNode.clientX;
        interactionNode.y = initialTouchNode.clientY;
        interactionNode.pressure = initialTouchNode.force || 1.0;
        
        cache.isPrimaryActive = true;
        cache.lastPolledTime = performance.now();
        cache.instantaneousVelocity.set(0, 0);
        
        interactionNode.inertiaX = 0;
        interactionNode.inertiaY = 0;
      }

      // Synchronize multiple pointers inside layout map arrays
      for (let i = 0; i < e.touches.length; i++) {
        const touchTrack = e.touches[i];
        const vectorInstance = cache.activePointersMap.get(touchTrack.identifier) || new Vector2D();
        vectorInstance.set(touchTrack.clientX, touchTrack.clientY);
        cache.activePointersMap.set(touchTrack.identifier, vectorInstance);
      }
    };

    // Tracks move metrics, calculating input velocity transitions to feed tracking loops
    const handleAndroidTouchMove = (e: TouchEvent) => {
      const cache = pointerTrackCacheRef.current;
      const primaryTouchNode = e.touches[0];
      const frameTimestamp = performance.now();
      const timeDeltaDuration = frameTimestamp - cache.lastPolledTime;

      if (primaryTouchNode && cache.isPrimaryActive && timeDeltaDuration > 0) {
        if (interactionNode.x !== null && interactionNode.y !== null) {
          // Calculate direct positional delta steps
          const shiftDistanceX = primaryTouchNode.clientX - interactionNode.x;
          const shiftDistanceY = primaryTouchNode.clientY - interactionNode.y;

          // Verlet interpolation step: Updates tracking velocities safely
          const rawVelocityX = shiftDistanceX / timeDeltaDuration;
          const rawVelocityY = shiftDistanceY / timeDeltaDuration;

          cache.instantaneousVelocity.x = (rawVelocityX * cache.smoothingWeight) + (cache.instantaneousVelocity.x * (1.0 - cache.smoothingWeight));
          cache.instantaneousVelocity.y = (rawVelocityY * cache.smoothingWeight) + (cache.instantaneousVelocity.y * (1.0 - cache.smoothingWeight));

          interactionNode.inertiaX = cache.instantaneousVelocity.x;
          interactionNode.inertiaY = cache.instantaneousVelocity.y;
        }

        interactionNode.x = primaryTouchNode.clientX;
        interactionNode.y = primaryTouchNode.clientY;
        interactionNode.pressure = primaryTouchNode.force || 1.0;
        cache.lastPolledTime = frameTimestamp;
      }

      for (let i = 0; i < e.touches.length; i++) {
        const touchTrack = e.touches[i];
        const vectorInstance = cache.activePointersMap.get(touchTrack.identifier);
        if (vectorInstance) {
          vectorInstance.set(touchTrack.clientX, touchTrack.clientY);
        }
      }
    };

    // Safely handles touch interruption loops to pass back fallback points
    const handleAndroidTouchEnd = (e: TouchEvent) => {
      const cache = pointerTrackCacheRef.current;

      const dynamicRemainingIds = new Set(Array.from(e.touches).map(t => t.identifier));
      Array.from(cache.activePointersMap.keys()).forEach(pointerId => {
        if (!dynamicRemainingIds.has(pointerId)) {
          cache.activePointersMap.delete(pointerId);
        }
      });

      if (e.touches.length === 0) {
        interactionNode.x = null;
        interactionNode.y = null;
        interactionNode.pressure = 0;
        cache.isPrimaryActive = false;
      } else {
        const alternateTouchNode = e.touches[0];
        interactionNode.x = alternateTouchNode.clientX;
        interactionNode.y = alternateTouchNode.clientY;
        interactionNode.pressure = alternateTouchNode.force || 1.0;
      }
    };

    window.addEventListener("touchstart", handleAndroidTouchStart, { passive: true });
    window.addEventListener("touchmove", handleAndroidTouchMove, { passive: true });
    window.addEventListener("touchend", handleAndroidTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleAndroidTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleAndroidTouchStart);
      window.removeEventListener("touchmove", handleAndroidTouchMove);
      window.removeEventListener("touchend", handleAndroidTouchEnd);
      window.removeEventListener("touchcancel", handleAndroidTouchEnd);
    };
  }, [interactionNode]);

  return null;
}

/**
 * PRODUCTION-GRADE COGNITIVE SYSTEM VECTOR RECKONER
 * * Processes fluid angular field friction transformations on the spatial cell matrix.
 * * Squeezes maximum runtime capability out of individual device hardware profiles.
 */
export function computeVectorPhysicsUpdate(
  ctx: CanvasRenderingContext2D,
  particles: ParticleCell[],
  interaction: {
    x: number | null;
    y: number | null;
    radius: number;
    pressure: number;
    friction: number;
    inertiaX: number;
    inertiaY: number;
    vortexStrength: number;
    attractionSwitch: boolean;
  },
  nominalWidth: number,
  nominalHeight: number,
  absoluteTimestamp: number
) {
  // Native allocation memory vectors avoiding variable generation overhead spikes
  const particleVector = new Vector2D();
  const interactionVector = new Vector2D();

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Updates fluid coordinate positions relative to background wind waves
    p.angle += p.velocityAngle;
    p.x += p.speedX + Math.sin(p.angle + p.vortexPhase) * 0.025;
    p.y += p.speedY + Math.cos(p.angle - p.vortexPhase) * 0.015;

    // Distributes active decay metrics onto drift variables when fingers lift off screen
    if (interaction.x === null && interaction.y === null) {
      p.x += interaction.inertiaX * 0.06 * p.kineticEnergy;
      p.y += interaction.inertiaY * 0.06 * p.kineticEnergy;
    }

    // Interactive multi-touch fluid force matrix transformations
    if (interaction.x !== null && interaction.y !== null) {
      particleVector.set(p.x, p.y);
      interactionVector.set(interaction.x, interaction.y);

      const linearDistanceScalar = particleVector.distanceTo(interactionVector);

      if (linearDistanceScalar < interaction.radius && linearDistanceScalar > 2) {
        const deltaVectorX = p.x - interaction.x;
        const deltaVectorY = p.y - interaction.y;
        
        // Parabolic closeness curves to smooth physics accelerations
        const proximityQuotient = (interaction.radius - linearDistanceScalar) / interaction.radius;
        const uniformForceMagnitude = (proximityQuotient * p.density * 0.35 * interaction.pressure) / p.mass;

        // Apply normal repulsion acceleration vectors away from touch focus windows
        let transformationX = (deltaVectorX / linearDistanceScalar) * uniformForceMagnitude;
        let transformationY = (deltaVectorY / linearDistanceScalar) * uniformForceMagnitude;

        if (interaction.attractionSwitch) {
          transformationX *= -1.0;
          transformationY *= -1.0;
        }

        /**
         * HIGH-SPEC COMPUTE FEATURE: ANGULAR MOMENTUM VORTEX FIELD
         * Computes rotational angular swirl vectors perpendicular to distance metrics.
         * Tangent Vector: $T_x = -D_y, T_y = D_x$
         */
        const rotationalTangentX = -(deltaVectorY / linearDistanceScalar);
        const rotationalTangentY = deltaVectorX / linearDistanceScalar;
        
        // Scale vortex speed relative to finger velocity indices
        const trackingVelocityMagnitude = Math.sqrt(interaction.inertiaX * interaction.inertiaX + interaction.inertiaY * interaction.inertiaY);
        const dynamicVortexFactor = interaction.vortexStrength * proximityQuotient * (1.0 + trackingVelocityMagnitude * 2.0);

        p.x += transformationX + (rotationalTangentX * dynamicVortexFactor);
        p.y += transformationY + (rotationalTangentY * dynamicVortexFactor);
        
        p.kineticEnergy = Math.min(2.5, p.kineticEnergy + 0.05);
      } else {
        p.kineticEnergy = Math.max(1.0, p.kineticEnergy - 0.01);
      }
    }

    // Decay input velocities safely back to steady baseline thresholds
    interaction.inertiaX *= interaction.friction;
    interaction.inertiaY *= interaction.friction;

    // Native hardware screen boundary wrappers
    if (p.x < -20) p.x = nominalWidth + 20;
    if (p.x > nominalWidth + 20) p.x = -20;
    if (p.y < -20) p.y = nominalHeight + 20;
    if (p.y > nominalHeight + 20) p.y = -20;

    // Low-level canvas path drafting operations
    ctx.beginPath();
    const runtimePulseRadius = p.size * (1.0 + Math.sin(absoluteTimestamp * p.pulseSpeed) * 0.14);
    ctx.arc(p.x, p.y, runtimePulseRadius, 0, Math.PI * 2);
    
    const cyanSaturationChannel = Math.floor(190 + Math.sin(p.angle + p.colorShift) * 35);
    ctx.fillStyle = `rgba(6, ${cyanSaturationChannel + p.hueVariant}, 212, ${p.alpha * (0.75 + Math.sin(absoluteTimestamp * p.pulseSpeed) * 0.25)})`;
    ctx.fill();

    // High-density proximity connector loop check
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const linkDx = p.x - p2.x;
      const linkDy = p.y - p2.y;
      const linearLinkDistance = Math.sqrt(linkDx * linkDx + linkDy * linkDy);

      if (linearLinkDistance < 60) {
        const relationalAlphaConnection = (1.0 - linearLinkDistance / 60) * 0.045 * p.kineticEnergy;
        ctx.strokeStyle = `rgba(34, 211, 238, ${relationalAlphaConnection})`;
        ctx.lineWidth = 0.32;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
}
