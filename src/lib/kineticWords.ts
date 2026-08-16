import React from "react";

// Two-tier kinetic typography system:
//
//   TIER 1 (Intrinsic) — words with deterministic physical/semantic meaning
//               animate always, regardless of Supabase data.
//               "fall" falls, "tremble" trembles, "fade" fades — from the word itself.
//
//   TIER 2 (Semantic) — additional words the Supabase pipeline identified as
//               `subject_name` in semantic_meaning_spans for THIS paragraph.
//               Proper names, chapter-specific weight words, etc.
//               Effect = claim_family fallback when intrinsic meaning is ambiguous.
//
//   INTENSITY — paragraph's archetypal_weights / dualism_map from Supabase
//               amplify animation speed. Baseline intensity applies when no weights exist.

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
  violence:       "kinetic-shake-ambient 2.5s ease-in-out infinite",
  motion_lateral: "kinetic-drift-ambient 3.5s ease-in-out infinite",
  rotation:       "kinetic-spin-ambient 5s ease-in-out infinite",
};

// Non-motion visual properties per category.
// No letterSpacing or fontWeight — those change word width and push surrounding text.
// verticalAlign: "baseline" prevents inline-block from shifting line height.
const CATEGORY_BASE: Record<KineticCategory, React.CSSProperties> = {
  descent:        { opacity: 0.82, verticalAlign: "baseline" },
  ascent:         { verticalAlign: "baseline" },
  growth:         { verticalAlign: "baseline" },
  compression:    { opacity: 0.80, verticalAlign: "baseline" },
  shadow:         { opacity: 0.65, verticalAlign: "baseline" },
  blur:           { verticalAlign: "baseline" },
  light:          { color: "#f5e8b0", textShadow: "0 0 6px rgba(255,240,180,0.45)", verticalAlign: "baseline" },
  sacred:         { color: "#e8d49a", verticalAlign: "baseline" },
  silence:        { opacity: 0.65, verticalAlign: "baseline" },
  violence:       { opacity: 0.88, verticalAlign: "baseline" },
  motion_lateral: { verticalAlign: "baseline" },
  rotation:       { verticalAlign: "baseline" },
};

// Map a word to its kinetic category from its intrinsic physical/semantic meaning.
// NOT a story dictionary — categorizes general English words by what they DO or ARE
// in the physical/narrative world. Expand freely; never add story-specific proper nouns.
function getIntrinsicCategory(w: string): KineticCategory | null {
  // DESCENT — gravity, burial, collapse, weight
  if (/^(dust|ash|ashes|buried|grave|ruin|ruins|decay|dirt|clay|mud|sand|collapse|collapsed|heavy|weight|burden|deep|underground|tomb|dead|death|fallen|sank|sinking|dropped|below|fall|falls|fell|falling|plunge|plunged|plunging|sink|sinks|sinking|descend|descent|lower|lowered|lowering|drag|dragged|dragging|drown|drowned|drowning|crush|crushed|crushing|press|pressed|pressing)$/.test(w)) return "descent";

  // ASCENT — sky, spirit, flight, rising
  if (/^(star|stars|stardust|sky|heaven|heavens|angel|spirit|soul|breath|float|floats|floating|above|high|heights|wing|wings|air|lifted|elevate|elevated|upward|rise|rises|rising|soar|soars|soaring|ascend|ascent|radiant|divine|cloud|clouds|fly|flies|flying|flew|hover|hovering|awaken|awakened|light|lightness|leap|leapt|leaping)$/.test(w)) return "ascent";

  // VIOLENCE — shaking, breaking, conflict, trembling
  if (/^(shatter|shattered|shattering|broken|fracture|fractured|fracturing|torn|tearing|tear|crack|cracked|cracking|trembling|tremor|tremble|trembles|trembled|quiver|quivers|quivering|quivered|shudder|shudders|shuddering|shuddered|shiver|shivers|shivering|shivered|shake|shakes|shaking|shook|war|battle|struck|wound|wounds|blood|rage|fury|anger|wrath|sword|blade|sever|severed|violent|violence|clash|clashed|clashing|strike|struck|striking|beat|beaten|beating|burst|bursting|explode|exploded|rip|ripped|ripping|snap|snapped|snapping|jolt|jolted|jolting|convulse|convulsed|convulsing|spasm|quake|quaking|quaked)$/.test(w)) return "violence";

  // SILENCE — stillness, invisibility, disappearance, fading
  if (/^(silence|silent|quiet|whisper|whispers|whispered|whispering|still|stillness|empty|hollow|void|nothing|nothingness|absence|hush|hushed|mute|breathless|alone|lonely|solitude|invisible|hidden|secret|dark|dim|fade|fades|faded|fading|vanish|vanishes|vanished|vanishing|dissolve|dissolves|dissolved|dissolving|disappear|disappeared|disappearing|murmur|murmured|murmuring|recede|receded|receding|drift|drifted|drifting|linger|lingering|lingered|melt|melted|melting|ebb|ebbed|ebbing|wane|waned|waning|dim|dimmed|dimming|faint|faintly|haze|pale|paled|paling|soften|softened|softening)$/.test(w)) return "silence";

  // LIGHT — fire, glow, brilliance, illumination
  if (/^(fire|flame|flames|burning|burn|burns|glow|glows|glowing|bright|brightness|shine|shines|shining|gleam|gleams|gleaming|spark|sparks|sparkling|torch|candle|golden|gold|luminous|blaze|blazes|blazing|lit|light|illuminate|illuminated|illuminating|flicker|flickers|flickering|flash|flashed|flashing|radiate|radiated|radiating|shimmer|shimmers|shimmering|beam|beams|beaming|dazzle|dazzled|dazzling|glitter|glitters|glittering|incandescent)$/.test(w)) return "light";

  // GROWTH — abundance, expansion, fullness
  if (/^(abundance|abundant|vast|wide|endless|infinite|filled|grow|grows|growing|grew|swell|swells|swelled|swelling|expand|expands|expanded|expanding|rich|richness|overflow|overflows|overflowing|multiply|multiplies|multiplied|multiplying|great|greatness|fullness|harvest|plenty|fill|fills|filling|spread|spreads|spreading|surge|surges|surging|surge|bloom|blooms|blooming|bloomed|flourish|flourishes|flourished|flourishing|thrive|thrives|thriving|thrived|magnify|magnified|magnifying)$/.test(w)) return "growth";

  // SACRED — holy, covenant, worship, eternal
  if (/^(holy|sacred|divine|glory|glorious|lord|god|blessed|blessing|eternal|covenant|prophecy|temple|altar|sacrifice|worship|righteous|mercy|grace|ancient|anointed|hallowed|sanctified|consecrated|venerate|venerated|revere|revered|revering|celestial|immortal|transcendent|exalted|psalm|prayer|prayers|praying|prayed)$/.test(w)) return "sacred";

  // SHADOW — darkness, obscuration, concealment
  if (/^(shadow|shadows|darkness|obscure|obscured|obscuring|fog|mist|night|midnight|blind|blindness|veil|veiled|veiling|mask|masked|masking|shroud|shrouded|shrouding|cloak|cloaked|cloaking|eclipse|eclipsed|dim|dusk|dusk|murk|murky|opaque|gloomy|gloom|blackness|pitch|obscurity)$/.test(w)) return "shadow";

  // MOTION LATERAL — sea, drift, current, wandering
  if (/^(sea|wave|waves|drift|drifts|drifting|river|current|currents|flow|flows|flowing|slide|slides|scatter|scatters|scattered|scattering|wandering|wander|wanders|wandered|wind|storm|swept|slid|sliding|stream|streams|streaming|course|courses|coursing|meander|meandered|meandering|ripple|ripples|rippling|undulate|undulates|undulating|sway|sways|swaying|swayed|eddy|eddying)$/.test(w)) return "motion_lateral";

  // ROTATION — spiral, spin, coil
  if (/^(spin|spins|spinning|spiral|spirals|spiraling|twist|twists|twisted|twisting|whirl|whirls|whirling|coil|coils|coiled|coiling|winding|wind|turn|turns|turning|rotate|rotates|rotation|revolve|revolves|revolving|cycle|cycles|cycling|orbit|orbiting|circle|circles|circling)$/.test(w)) return "rotation";

  // COMPRESSION — squeezing, binding, withering
  if (/^(squeeze|squeezes|compressed|crush|crushed|crushing|shrink|shrinks|shrank|withered|wither|withers|withering|narrow|narrows|narrowed|narrowing|tight|tighten|tightens|tightened|bind|binds|bound|binding|cage|caged|caging|imprisoned|press|presses|pressed|pressing|constrict|constricts|constricted|constricting|clench|clenches|clenched|clenching|grip|grips|gripping|gripped|choke|chokes|choked|choking|strangle|strangles|strangled|strangling|contract|contracts|contracted|contracting)$/.test(w)) return "compression";

  // BLUR — haze, smoke, obscured vision
  if (/^(blur|blurs|blurred|blurring|blurry|haze|hazed|hazing|hazed|obscure|obscured|foggy|smoky|smoke|smokes|smoked|smoking|murky|muddy|clouded|clouding|smear|smeared|smearing|distort|distorted|distorting|warp|warped|warping|wavering|waver|wavers|wavered)$/.test(w)) return "blur";

  return null;
}

// When the word has no clear intrinsic physical meaning (e.g. a proper name),
// fall back to what the semantic pipeline classified this word AS in the narrative.
function getClaimDefaultCategory(claimFamily: string, label: string): KineticCategory {
  if (claimFamily === "biblical") return "sacred";
  if (claimFamily === "archetype") {
    if (label === "Ego")     return "compression";
    if (label === "Persona") return "silence";
  }
  if (claimFamily === "dualism") return "violence";
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
    case "descent":        return Math.min(1, s(d,"descent") + s(d,"fall")     + s(w,"shadow") * 0.3);
    case "ascent":         return Math.min(1, s(d,"ascent")  + s(d,"rise")     + s(w,"anima")  * 0.3);
    case "growth":         return Math.min(1, s(w,"self")    + s(d,"ascent")   * 0.4);
    case "compression":    return Math.min(1, s(w,"shadow")  + s(d,"descent")  * 0.5);
    case "shadow":         return s(w,"shadow");
    case "blur":           return Math.min(1, s(w,"shadow")  + s(w,"anima")    * 0.4);
    case "light":          return Math.min(1, s(w,"self")    + s(d,"ascent")   * 0.5);
    case "sacred":         return Math.min(1, s(w,"self")    * 1.4);
    case "silence":        return Math.min(1, s(w,"persona") * 1.3);
    case "violence":       return Math.min(1, s(d,"tension") + s(d,"conflict") + s(w,"shadow") * 0.5);
    case "motion_lateral": return s(w,"anima");
    case "rotation":       return Math.min(1, s(w,"anima")   + s(d,"tension")  * 0.4);
    default:               return 0;
  }
}

// Main render function — two-tier system.
//
// Tier 1: intrinsic physical meaning words animate always (deterministic from the word itself).
// Tier 2: Supabase semantic_meaning_spans adds additional words for proper names, etc.
// Intensity = paragraph weights × confidence (baseline 0.35 when no Supabase data).
export function getSemanticKineticEffect(
  word: string,
  semanticWords: SemanticWordEntry[],
  weights: Record<string, number>,
  dualisms: Record<string, number>
): React.CSSProperties | null {
  const bare = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!bare || bare.length < 3) return null;

  // Tier 1: intrinsic physical meaning — always animates
  const intrinsicCategory = getIntrinsicCategory(bare);

  // Tier 2: Supabase semantic gate for non-intrinsic words
  const match = semanticWords.find(
    (s) => s.word?.toLowerCase().replace(/[^a-z]/g, "") === bare
  );

  // Neither intrinsic nor in Supabase → no effect
  if (!intrinsicCategory && !match) return null;

  const category = intrinsicCategory ?? getClaimDefaultCategory(match!.claim_family, match!.label);

  const pressure        = getPressure(category, weights, dualisms);
  // Baseline 0.35 when no Supabase match; Supabase confidence boosts intensity
  const confidenceBoost = match ? Math.min(1, (match.confidence || 0.15) * 5) : 0.35;
  const intensity       = Math.max(0.15, pressure * 0.7 + confidenceBoost * 0.3);

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
  if (!bare || bare.length < 3) return false;
  if (getIntrinsicCategory(bare)) return true;
  return semanticWords.some((s) => s.word?.toLowerCase().replace(/[^a-z]/g, "") === bare);
}
