// Placeholder for Dualism Logic service
import { DualismMap } from "@/core/narrative-types";

export interface DualismAnalysis {
  strongestDualism: string | null;
  intensity: number;
  allDualisms: Array<{ name: string; value: number }>;
}

export function analyzeDualism(dualismMap: DualismMap): DualismAnalysis {
  const allDualisms: Array<{ name: string; value: number }> = [];
  let strongestDualism: string | null = null;
  let maxIntensity = 0;

  if (dualismMap) {
    for (const dualismName in dualismMap) {
      if (dualismMap.hasOwnProperty(dualismName)) {
        const value = dualismMap[dualismName];
        allDualisms.push({ name: dualismName, value });

        if (value > maxIntensity) {
          maxIntensity = value;
          strongestDualism = dualismName;
        }
      }
    }
  }

  // Sort by value descending
  allDualisms.sort((a, b) => b.value - a.value);

  return {
    strongestDualism,
    intensity: maxIntensity,
    allDualisms,
  };
}
