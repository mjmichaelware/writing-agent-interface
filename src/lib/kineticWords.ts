import React from "react";

// Kinetic typography is fully Supabase-driven:
//
//   GATE      — only words the semantic pipeline identified as `subject_name`
//               in this paragraph's semantic_meaning_spans get any effect.
//               Nothing animates unless Supabase said it matters here.
//
//   EFFECT    — determined by the word's intrinsic physical/semantic meaning
//               ("dust" sinks, "fire" glows, "silence" breathes wide)
//               plus the claim_family when intrinsic meaning is ambiguous
//               (proper names: archetype.Ego → compression, Persona → silence).
//
//   INTENSITY — paragraph's archetypal_weights / dualism_map from Supabase
//               amplify the animation speed (high shadow pressure → faster descent).

export type KineticCategory =
  | "descent" | "ascent" | "growth" | "compression"
  | "shadow" | "blur" | "light" | "sacred"
  | "silence" | "violence" | "motion_lateral" | "rotation";

export type SemanticWordEntry = {
  word: string;
  claim_family: string;
  label: string;
  confidence: number;
};

export type KineticEffect = {
  style: React.CSSProperties;
  category: KineticCategory;
};

// Infinite ambient animations — defined in globals.css
const CATEGORY_ANIMATION: Record<KineticCategory, string> = {
  descent:        "kinetic-descend-ambient 2.8s ease-in-out infinite",
  ascent:         "kinetic-ascend-ambient 3.2s ease-in-out infinite",
  growth:         "kinetic-grow-ambient 2.4s ease-in-out infinite",
  compression:    "kinetic-compress-ambient 2.2s ease-in-out infinite",
  shadow:         "kinetic-shadow-ambient 3.5s ease-in-out infinite",
  blur:           "kinetic-blur-ambient 3s ease-in-out infinite",
  light:          "kinetic-glow-ambient 2s ease-in-out infinite",
  sacred:         "kinetic-sacred-ambient 4.5s ease-in-out infinite",
  silence:        "kinetic-silence-ambient 5s ease-in-out infinite",
  violence:       "kinetic-shake-ambient 0.7s ease-in-out infinite",
  motion_lateral: "kinetic-drift-ambient 3.5s ease-in-out infinite",
  rotation:       "kinetic-spin-ambient 5s ease-in-out infinite",
};

// Non-motion visual properties per category (color, spacing, opacity, filter)
const CATEGORY_BASE: Record<KineticCategory, React.CSSProperties> = {
  descent:        { opacity: 0.80 },
  ascent:         {},
  growth:         { fontWeight: 600 },
  compression:    { letterSpacing: "-0.04em" },
  shadow:         { opacity: 0.62, textShadow: "1px 1px 4px rgba(0,0,0,0.75)" },
  blur:           { filter: "blur(0.5px)", opacity: 0.76 },
  light:          { color: "#f5e8b0", textShadow: "0 0 10px rgba(255,240,180,0.60)" },
  sacred:         { letterSpacing: "0.12em", color: "#e8d49a" },
  silence:        { letterSpacing: "0.20em", opacity: 0.58 },
  violence:       { opacity: 0.84 },
  motion_lateral: { fontStyle: "italic" },
  rotation:       {},
};

// Map a word to its kinetic category from its intrinsic physical/semantic meaning.
// This is NOT a story dictionary — it categorizes general English words by what
// they fundamentally DO or ARE in the physical/narrative world.
function getIntrinsicCategory(w: string): KineticCategory | null {
  if (/^(dust|ash|ashes|buried|grave|ruin|ruins|decay|dirt|clay|mud|sand|collapse|collapsed|heavy|weight|burden|deep|underground|tomb|dead|death|fallen|sank|sinking|dropped|below|fall|fell|falling|plunge|plunged|sink|descend|descent)$/.test(w)) return "descent";
  if (/^(star|stars|stardust|sky|heaven|heavens|angel|spirit|soul|breath|float|above|high|heights|wing|wings|air|lifted|elevated|upward|rise|rising|soar|ascend|ascent|radiant|divine|cloud|clouds)$/.test(w)) return "ascent";
  if (/^(silence|silent|quiet|whisper|whispered|still|stillness|empty|hollow|void|nothing|nothingness|absence|hush|mute|breathless|alone|lonely|solitude|invisible|hidden|secret|dark|dim)$/.test(w)) return "silence";
  if (/^(fire|flame|flames|burning|burn|glow|glowing|bright|shine|shining|gleam|gleaming|spark|sparks|torch|candle|golden|gold|luminous|blaze|blazing|lit|light|shining|radiant)$/.test(w)) return "light";
  if (/^(shatter|shattered|broken|fracture|fractured|torn|crack|cracked|trembling|tremor|tremble|shake|shaking|war|battle|struck|wound|wounds|blood|rage|fury|anger|wrath|sword|blade|sever|violent|violence|clash|clashed)$/.test(w)) return "violence";
  if (/^(abundance|abundant|vast|wide|endless|infinite|filled|grow|growing|grew|swell|swelled|expand|expanded|rich|richness|overflow|overflowing|multiply|multiplied|great|greatness|fullness|harvest|plenty|fill)$/.test(w)) return "growth";
  if (/^(holy|sacred|divine|glory|glorious|lord|god|blessed|blessing|eternal|covenant|prophecy|temple|altar|sacrifice|worship|righteous|mercy|grace|ancient|anointed)$/.test(w)) return "sacred";
  if (/^(shadow|shadows|darkness|obscure|fog|mist|night|midnight|blind|blindness|veil|veiled|mask|masked)$/.test(w)) return "shadow";
  if (/^(sea|wave|waves|drift|drifting|river|current|flow|flowing|slide|scatter|scattered|wandering|wander|wind|storm|swept|slide|slid|sliding)$/.test(w)) return "motion_lateral";
  if (/^(spin|spiral|twist|twisted|whirl|coil|coiled|winding|turning|turn|rotate|rotation)$/.test(w)) return "rotation";
  if (/^(squeeze|compressed|crush|crushed|shrink|shrank|withered|wither|narrow|narrowed|tight|tighten|bind|bound|cage|caged|imprisoned|pressed|pressing|constrict|constricted)$/.test(w)) return "compression";
  if (/^(blur|blurred|blurry|haze|hazed|obscured|dim|dimming|fog|foggy|smoky|smoke)$/.test(w)) return "blur";
  return null;
}

// When the word has no clear intrinsic physical meaning (e.g. a proper name),
// fall back to what the semantic pipeline classified this word AS in the narrative.
function getClaimDefaultCategory(claimFamily: string, label: string): KineticCategory {
  if (claimFamily === "biblical") return "sacred";
  if (claimFamily === "archetype") {
    if (label === "Ego")    return "compression"; // ego consciousness = weight, burden
    if (label === "Persona") return "silence";    // persona/mask = controlled, restrained
  }
  if (claimFamily === "dualism") return "violence"; // opposing forces in tension
  return "silence";
}

// Pressure from the paragraph's Supabase weights amplifies animation speed (0–1).
function getPressure(
  cat: KineticCategory,
  w: Record<string, number>,
  d: Record<string, number>
): number {
  const s = (k: Record<string, number>, key: string) => Math.min(1, k[key] || 0);
  switch (cat) {
    case "descent":        return Math.min(1, s(d,"descent") + s(d,"fall")    + s(w,"shadow") * 0.3);
    case "ascent":         return Math.min(1, s(d,"ascent")  + s(d,"rise")    + s(w,"anima")  * 0.3);
    case "growth":         return Math.min(1, s(w,"self")    + s(d,"ascent")  * 0.4);
    case "compression":    return Math.min(1, s(w,"shadow")  + s(d,"descent") * 0.5);
    case "shadow":         return s(w,"shadow");
    case "blur":           return Math.min(1, s(w,"shadow")  + s(w,"anima")   * 0.4);
    case "light":          return Math.min(1, s(w,"self")    + s(d,"ascent")  * 0.5);
    case "sacred":         return Math.min(1, s(w,"self")    * 1.4);
    case "silence":        return Math.min(1, s(w,"persona") * 1.3);
    case "violence":       return Math.min(1, s(d,"tension") + s(d,"conflict") + s(w,"shadow") * 0.5);
    case "motion_lateral": return s(w,"anima");
    case "rotation":       return Math.min(1, s(w,"anima")   + s(d,"tension") * 0.4);
    default:               return 0;
  }
}

// Main render function — fully Supabase-driven.
//
// semanticWords: the `subject_name` entries from semantic_meaning_spans for THIS
// paragraph (loaded by the manuscript API). Empty array = no kinetic effects.
//
// Only words in semanticWords animate. Effect type = intrinsic word meaning
// or claim_family fallback. Intensity = paragraph weights × span confidence.
export function getSemanticKineticEffect(
  word: string,
  semanticWords: SemanticWordEntry[],
  weights: Record<string, number>,
  dualisms: Record<string, number>
): React.CSSProperties | null {
  const bare = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!bare || bare.length < 3 || !semanticWords.length) return null;

  // Gate: only words the AI identified as semantic subjects in THIS paragraph
  const match = semanticWords.find(
    (s) => s.word?.toLowerCase().replace(/[^a-z]/g, "") === bare
  );
  if (!match) return null;

  const category =
    getIntrinsicCategory(bare) ??
    getClaimDefaultCategory(match.claim_family, match.label);

  const pressure       = getPressure(category, weights, dualisms);
  const confidenceBoost = Math.min(1, (match.confidence || 0.15) * 5);
  const intensity      = Math.max(0.1, pressure * 0.7 + confidenceBoost * 0.3);

  const style: React.CSSProperties = {
    display: "inline-block",
    ...CATEGORY_BASE[category],
  };

  const baseAnim = CATEGORY_ANIMATION[category];
  if (baseAnim) {
    const durationMatch = baseAnim.match(/([\d.]+)s/);
    if (durationMatch) {
      const base   = parseFloat(durationMatch[1]);
      const scaled = Math.max(0.4, base * (1 - intensity * 0.35));
      style.animation = baseAnim.replace(durationMatch[0], `${scaled.toFixed(2)}s`);
    } else {
      style.animation = baseAnim;
    }
  }

  return style;
}

export function hasKineticEffect(word: string, semanticWords: SemanticWordEntry[]): boolean {
  const bare = word.toLowerCase().replace(/[^a-z]/g, "");
  return semanticWords.some((s) => s.word?.toLowerCase().replace(/[^a-z]/g, "") === bare);
}
