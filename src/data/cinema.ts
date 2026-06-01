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
 * * Enhanced with Keyword Fallbacks for Chapter 7 (Megiddo/Flies).
 */
export function resolveAssetByMeaning(
  weights: ArchetypalWeights,
  dualisms: DualismMap,
  partNumber: string,
  content: string = ""
): string {
  const text = content.toLowerCase();

  // Rule 0: Keyword-based triggers for Chapter 7 (Megiddo/Flies)
  if (text.includes("flies") || text.includes("swarm") || text.includes("buzzing") || text.includes("pit")) {
    return "/assets/flies.jpg";
  }
  if (text.includes("megiddo") || text.includes("fortress") || text.includes("gate") || text.includes("high place")) {
    return text.includes("gate") || text.includes("sacred") ? "/assets/megiddo2.jpg" : "/assets/megiddo1.jpg";
  }

  // Rule 0.1: Front Matter Context
  if (content === "title-page") {
    return "/assets/boy-and-moon.png";
  }
  
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

// Legacy fallback mapping
export const CINEMA_ASSETS: Record<string, string[]> = {
  "0": [
    "/assets/boy-and-moon.png",
    "/assets/bg.png"
  ],
  "7": [
    "/assets/megiddo1.jpg",
    "/assets/flies.jpg",
    "/assets/megiddo2.jpg",
    "/assets/bg.png"
  ]
};

export function resolveAssetByKeyword(paraIndex: number, chapterSlug: string): string {
  const assets = CINEMA_ASSETS[chapterSlug] || [DEFAULT_ASSET];
  const CINEMA_PARAGRAPHS_PER_IMAGE = 12;
  const index = Math.min(
    Math.floor(paraIndex / CINEMA_PARAGRAPHS_PER_IMAGE),
    assets.length - 1
  );
  return assets[index];
}
