// Layer 2 — Cinematic Asset Registry
// Feature 200: Meaning-Driven Asset Resolution
// Assets are resolved by SEMANTIC WEIGHTING from Supabase/Vertex AI,
// not by primitive keyword matching.

export type ArchetypalWeights = {
  shadow: number;
  persona: number;
  anima: number;
  self: number;
  hero: number;
};

export type DualismMap = {
  sacred: number;
  descent: number;
};

export const DEFAULT_ASSET = "/assets/bg.png";

/**
 * ARCHITECTURAL SPECIFICATION: SEMANTIC CINEMA RESOLVER
 * * Resolves assets based on narrative arc epochs and psychological weighting.
 */
export function resolveAssetByMeaning(
  weights: ArchetypalWeights,
  dualisms: DualismMap,
  partNumber: string
): string {
  
  // Rule 1: High Descent + High Shadow = The Swarming Pit (Megiddo/Flies)
  if (dualisms.descent > 0.8 && weights.shadow > 0.7) {
    return "/assets/flies.jpg";
  }

  // Rule 2: High Sacred + High Anima = High Places (Megiddo Gate)
  if (dualisms.sacred > 0.8 && weights.anima > 0.6) {
    return "/assets/megiddo2.jpg";
  }

  // Rule 3: High Descent (without shadow) = The Pit (Abyss)
  if (dualisms.descent > 0.7) {
    return "/assets/megiddo1.jpg";
  }

  // Rule 4: Epoch-based fallbacks (Narrative Arc Logic)
  if (partNumber === "II") {
    // Part II is darker, more tense
    if (dualisms.descent > 0.4) return "/assets/megiddo1.jpg";
  }

  return DEFAULT_ASSET;
}

// Legacy keyword fallback (being phased out)
export function resolveAssetByKeyword(content: string, chapterSlug: string): string {
  // ... existing keyword logic for safety ...
  return DEFAULT_ASSET;
}
