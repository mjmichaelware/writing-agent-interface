import React from "react";

// Semantic categories — each word's effect MATCHES its narrative meaning.
// "ascent" climbs up. "gain" gets bigger. "squeeze" compresses.
// Paragraph-level archetypal_weights/dualism_map from Supabase amplify
// the base intensity — high descent paragraph = falling words fall harder.
export type KineticCategory =
  | "descent" | "ascent" | "growth" | "compression"
  | "shadow" | "blur" | "light" | "sacred"
  | "silence" | "violence" | "motion_lateral" | "rotation";

type KineticEntry = {
  category: KineticCategory;
  base: React.CSSProperties;
};

const KINETIC: Record<string, KineticEntry> = {
  // DESCENT — gravity, collapse, sinking
  fall:       { category:"descent",  base:{ display:"inline-block", transform:"translateY(6px) rotate(-1.5deg)", opacity:0.82 } },
  falling:    { category:"descent",  base:{ display:"inline-block", transform:"translateY(5px) rotate(-1deg)",  opacity:0.8  } },
  fell:       { category:"descent",  base:{ display:"inline-block", transform:"translateY(4px)",                opacity:0.83 } },
  sink:       { category:"descent",  base:{ display:"inline-block", transform:"translateY(6px) scaleY(0.93)",  opacity:0.75 } },
  sank:       { category:"descent",  base:{ display:"inline-block", transform:"translateY(5px) scaleY(0.94)",  opacity:0.77 } },
  sinking:    { category:"descent",  base:{ display:"inline-block", transform:"translateY(4px) scaleY(0.92)",  opacity:0.78 } },
  plunge:     { category:"descent",  base:{ display:"inline-block", transform:"translateY(8px) scaleY(0.9)",   opacity:0.7  } },
  plunged:    { category:"descent",  base:{ display:"inline-block", transform:"translateY(7px) scaleY(0.91)",  opacity:0.72 } },
  descent:    { category:"descent",  base:{ display:"inline-block", transform:"translateY(5px)",               opacity:0.8  } },
  descend:    { category:"descent",  base:{ display:"inline-block", transform:"translateY(4px)",               opacity:0.82 } },
  collapsed:  { category:"descent",  base:{ display:"inline-block", transform:"translateY(7px) scaleX(0.88) scaleY(0.88)", opacity:0.7 } },
  collapse:   { category:"descent",  base:{ display:"inline-block", transform:"translateY(6px) scaleX(0.9)",  opacity:0.72 } },
  dropped:    { category:"descent",  base:{ display:"inline-block", transform:"translateY(5px)",               opacity:0.8  } },
  drop:       { category:"descent",  base:{ display:"inline-block", transform:"translateY(4px)",               opacity:0.82 } },

  // ASCENT — rising, lifting, soaring
  rise:       { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-4px) scaleY(1.04)"  } },
  rising:     { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-5px) scaleY(1.06)"  } },
  rose:       { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-3px) scaleY(1.03)"  } },
  ascend:     { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-4px) scaleY(1.06)"  } },
  ascent:     { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-5px) scaleY(1.08)"  } },
  lifted:     { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-3px)"               } },
  lift:       { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-3px) scaleY(1.03)"  } },
  soared:     { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-7px) scaleY(1.1)"   } },
  soar:       { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-6px) scaleY(1.08)"  } },
  climb:      { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-4px)"               } },
  climbed:    { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-3px)"               } },
  elevated:   { category:"ascent",   base:{ display:"inline-block", transform:"translateY(-4px) scaleY(1.05)"  } },

  // GROWTH — expansion, gain, abundance
  grow:       { category:"growth",   base:{ display:"inline-block", transform:"scale(1.12)", transformOrigin:"center" } },
  grew:       { category:"growth",   base:{ display:"inline-block", transform:"scale(1.10)", transformOrigin:"center" } },
  growing:    { category:"growth",   base:{ display:"inline-block", transform:"scale(1.11)", transformOrigin:"center" } },
  expand:     { category:"growth",   base:{ display:"inline-block", transform:"scaleX(1.14)", letterSpacing:"0.06em" } },
  expanded:   { category:"growth",   base:{ display:"inline-block", transform:"scaleX(1.12)", letterSpacing:"0.05em" } },
  swell:      { category:"growth",   base:{ display:"inline-block", transform:"scale(1.10) scaleY(1.06)"       } },
  swelled:    { category:"growth",   base:{ display:"inline-block", transform:"scale(1.08) scaleY(1.04)"       } },
  gain:       { category:"growth",   base:{ display:"inline-block", transform:"scale(1.09)", fontWeight:600     } },
  gained:     { category:"growth",   base:{ display:"inline-block", transform:"scale(1.07)"                    } },
  vast:       { category:"growth",   base:{ display:"inline-block", letterSpacing:"0.25em", transform:"scaleX(1.14)" } },
  endless:    { category:"growth",   base:{ display:"inline-block", letterSpacing:"0.18em", transform:"scaleX(1.10)" } },
  wide:       { category:"growth",   base:{ display:"inline-block", letterSpacing:"0.2em"                      } },
  infinite:   { category:"growth",   base:{ display:"inline-block", letterSpacing:"0.22em", opacity:0.88       } },
  abundance:  { category:"growth",   base:{ display:"inline-block", transform:"scaleX(1.1) scaleY(1.05)"       } },
  filled:     { category:"growth",   base:{ display:"inline-block", transform:"scale(1.06)", fontWeight:500    } },

  // COMPRESSION — squeeze, crush, burden
  squeeze:    { category:"compression", base:{ display:"inline-block", transform:"scaleX(0.62)", letterSpacing:"-0.06em", transformOrigin:"center" } },
  squeezed:   { category:"compression", base:{ display:"inline-block", transform:"scaleX(0.65)", letterSpacing:"-0.05em" } },
  compressed: { category:"compression", base:{ display:"inline-block", transform:"scaleX(0.70)", letterSpacing:"-0.04em" } },
  crushed:    { category:"compression", base:{ display:"inline-block", transform:"scaleX(0.55) scaleY(0.88)", letterSpacing:"-0.07em" } },
  shrink:     { category:"compression", base:{ display:"inline-block", transform:"scale(0.82)", opacity:0.85   } },
  shrank:     { category:"compression", base:{ display:"inline-block", transform:"scale(0.84)", opacity:0.87   } },
  wither:     { category:"compression", base:{ display:"inline-block", transform:"scaleX(0.78) scaleY(0.94)", opacity:0.75 } },
  withered:   { category:"compression", base:{ display:"inline-block", transform:"scaleX(0.76) scaleY(0.92)", opacity:0.72 } },
  heavy:      { category:"compression", base:{ display:"inline-block", fontWeight:700, transform:"scaleY(0.93)", textShadow:"0 2px 4px rgba(0,0,0,0.6)" } },
  weight:     { category:"compression", base:{ display:"inline-block", fontWeight:700, transform:"scaleY(0.92)", textShadow:"0 2px 6px rgba(0,0,0,0.5)" } },
  burden:     { category:"compression", base:{ display:"inline-block", transform:"translateY(3px) scaleY(0.92)", fontWeight:600 } },

  // SHADOW / OBSCURITY
  shadow:     { category:"shadow",   base:{ display:"inline-block", textShadow:"2px 2px 4px rgba(0,0,0,0.7)",  opacity:0.85 } },
  shadows:    { category:"shadow",   base:{ display:"inline-block", textShadow:"2px 2px 4px rgba(0,0,0,0.7)",  opacity:0.85 } },
  darkness:   { category:"shadow",   base:{ display:"inline-block", opacity:0.50, textShadow:"0 0 8px rgba(0,0,0,0.9)"  } },
  dark:       { category:"shadow",   base:{ display:"inline-block", opacity:0.55  } },
  hidden:     { category:"shadow",   base:{ display:"inline-block", opacity:0.38, filter:"blur(0.6px)"          } },
  dim:        { category:"shadow",   base:{ display:"inline-block", opacity:0.42, filter:"blur(0.4px)"          } },
  dimming:    { category:"shadow",   base:{ display:"inline-block", opacity:0.40  } },

  // BLUR / OBSCURITY
  blurry:     { category:"blur",     base:{ display:"inline-block", filter:"blur(1.8px)", opacity:0.78 } },
  blur:       { category:"blur",     base:{ display:"inline-block", filter:"blur(1.4px)", opacity:0.80 } },
  blurred:    { category:"blur",     base:{ display:"inline-block", filter:"blur(1.6px)", opacity:0.78 } },

  // LIGHT / ILLUMINATION
  light:      { category:"light",    base:{ display:"inline-block", textShadow:"0 0 12px rgba(255,240,180,0.65)", color:"#f5e8b0" } },
  shining:    { category:"light",    base:{ display:"inline-block", textShadow:"0 0 14px rgba(255,235,150,0.70)", color:"#f5e8b0" } },
  glowing:    { category:"light",    base:{ display:"inline-block", textShadow:"0 0 10px rgba(201,169,110,0.80)", color:"#e8d08a" } },
  bright:     { category:"light",    base:{ display:"inline-block", textShadow:"0 0 10px rgba(255,240,160,0.55)", color:"#f0dfa0" } },
  flame:      { category:"light",    base:{ display:"inline-block", textShadow:"0 0 8px rgba(255,100,30,0.70)",  color:"#f07030" } },
  fire:       { category:"light",    base:{ display:"inline-block", textShadow:"0 0 10px rgba(255,80,20,0.65)",  color:"#f06020" } },
  burning:    { category:"light",    base:{ display:"inline-block", textShadow:"0 0 10px rgba(255,80,20,0.60)",  color:"#e85820" } },
  radiant:    { category:"light",    base:{ display:"inline-block", textShadow:"0 0 16px rgba(255,240,180,0.75)", color:"#f5e8b0" } },

  // SACRED / TRANSCENDENT
  holy:       { category:"sacred",   base:{ display:"inline-block", letterSpacing:"0.14em", textShadow:"0 0 14px rgba(220,200,150,0.55)", color:"#e8d49a" } },
  sacred:     { category:"sacred",   base:{ display:"inline-block", letterSpacing:"0.12em", textShadow:"0 0 12px rgba(220,200,140,0.50)", color:"#e8d090" } },
  glory:      { category:"sacred",   base:{ display:"inline-block", letterSpacing:"0.16em", textShadow:"0 0 16px rgba(240,210,130,0.65)", color:"#f0d888" } },
  divine:     { category:"sacred",   base:{ display:"inline-block", letterSpacing:"0.12em", fontStyle:"italic", color:"#e8d49a" } },
  eternal:    { category:"sacred",   base:{ display:"inline-block", letterSpacing:"0.16em", opacity:0.92, color:"#d4c080" } },
  blessed:    { category:"sacred",   base:{ display:"inline-block", letterSpacing:"0.10em", textShadow:"0 0 10px rgba(220,200,140,0.45)", color:"#e8d49a" } },

  // SILENCE / STILLNESS
  silence:    { category:"silence",  base:{ display:"inline-block", letterSpacing:"0.28em", opacity:0.56 } },
  silent:     { category:"silence",  base:{ display:"inline-block", letterSpacing:"0.22em", opacity:0.54 } },
  still:      { category:"silence",  base:{ display:"inline-block", letterSpacing:"0.12em", opacity:0.65 } },
  stillness:  { category:"silence",  base:{ display:"inline-block", letterSpacing:"0.26em", opacity:0.54 } },
  quiet:      { category:"silence",  base:{ display:"inline-block", letterSpacing:"0.14em", opacity:0.62 } },
  whisper:    { category:"silence",  base:{ display:"inline-block", fontSize:"0.86em",      opacity:0.68, letterSpacing:"0.08em" } },
  whispered:  { category:"silence",  base:{ display:"inline-block", fontSize:"0.84em",      opacity:0.65 } },
  empty:      { category:"silence",  base:{ display:"inline-block", letterSpacing:"0.18em", opacity:0.50 } },
  hollow:     { category:"silence",  base:{ display:"inline-block", letterSpacing:"0.20em", opacity:0.52, fontStyle:"italic" } },

  // VIOLENCE / FRACTURE / TREMBLING
  shattered:  { category:"violence", base:{ display:"inline-block", letterSpacing:"0.16em", transform:"skewX(-3.5deg) scaleX(0.94)", opacity:0.82 } },
  broken:     { category:"violence", base:{ display:"inline-block", transform:"skewX(-2.5deg)", opacity:0.80 } },
  torn:       { category:"violence", base:{ display:"inline-block", transform:"skewX(-4deg) scaleX(0.91)", opacity:0.78 } },
  trembling:  { category:"violence", base:{ display:"inline-block", transform:"skewX(2.5deg)", opacity:0.86 } },
  shaking:    { category:"violence", base:{ display:"inline-block", transform:"skewX(2deg)" } },
  fracture:   { category:"violence", base:{ display:"inline-block", letterSpacing:"0.12em", transform:"skewX(-3deg) scaleX(0.93)", opacity:0.80 } },

  // LATERAL MOTION — drift, slide, scatter
  slide:      { category:"motion_lateral", base:{ display:"inline-block", transform:"translateX(5px)",           fontStyle:"italic" } },
  sliding:    { category:"motion_lateral", base:{ display:"inline-block", transform:"translateX(4px)",           fontStyle:"italic" } },
  slid:       { category:"motion_lateral", base:{ display:"inline-block", transform:"translateX(3px)",           fontStyle:"italic" } },
  drift:      { category:"motion_lateral", base:{ display:"inline-block", transform:"translateX(6px) rotate(0.8deg)", opacity:0.88 } },
  drifting:   { category:"motion_lateral", base:{ display:"inline-block", transform:"translateX(4px) rotate(0.6deg)", opacity:0.88 } },
  drifted:    { category:"motion_lateral", base:{ display:"inline-block", transform:"translateX(3px) rotate(0.5deg)", opacity:0.85 } },
  scatter:    { category:"motion_lateral", base:{ display:"inline-block", letterSpacing:"0.20em", transform:"scaleX(1.12)" } },
  scattered:  { category:"motion_lateral", base:{ display:"inline-block", letterSpacing:"0.16em" } },

  // ROTATION / SPIN / TWIST
  spin:       { category:"rotation", base:{ display:"inline-block", transform:"rotate(9deg)",  transformOrigin:"center" } },
  spinning:   { category:"rotation", base:{ display:"inline-block", transform:"rotate(7deg)"   } },
  spiral:     { category:"rotation", base:{ display:"inline-block", transform:"rotate(5deg) scaleX(0.92)" } },
  whirl:      { category:"rotation", base:{ display:"inline-block", transform:"rotate(12deg)", letterSpacing:"0.04em" } },
  twisted:    { category:"rotation", base:{ display:"inline-block", transform:"rotate(-5.5deg) scaleX(0.94)" } },
  turning:    { category:"rotation", base:{ display:"inline-block", transform:"rotate(4.5deg)" } },
};

// Pressure axis each category responds to from paragraph weights/dualisms
function getPressure(
  cat: KineticCategory,
  w: Record<string, number>,
  d: Record<string, number>
): number {
  const s = (k: Record<string, number>, key: string) => Math.min(1, k[key] || 0);
  switch (cat) {
    case "descent":       return Math.min(1, s(d,"descent") + s(d,"fall")    + s(w,"shadow") * 0.3);
    case "ascent":        return Math.min(1, s(d,"ascent")  + s(d,"rise")    + s(w,"anima")  * 0.3);
    case "growth":        return Math.min(1, s(w,"self")    + s(d,"ascent")  * 0.4);
    case "compression":   return Math.min(1, s(w,"shadow")  + s(d,"descent") * 0.5);
    case "shadow":        return s(w,"shadow");
    case "blur":          return Math.min(1, s(w,"shadow")  + s(w,"anima")   * 0.4);
    case "light":         return Math.min(1, s(w,"self")    + s(d,"ascent")  * 0.5);
    case "sacred":        return Math.min(1, s(w,"self")    * 1.4);
    case "silence":       return Math.min(1, s(w,"persona") * 1.3);
    case "violence":      return Math.min(1, s(d,"tension") + s(d,"conflict") + s(w,"shadow") * 0.5);
    case "motion_lateral":return s(w,"anima");
    case "rotation":      return Math.min(1, s(w,"anima")   + s(d,"tension") * 0.4);
    default:              return 0;
  }
}

// Scales numeric pixel/degree/em values inside a CSS transform string
function scaleTransform(t: string, factor: number): string {
  return t.replace(/([-\d.]+)(px|deg)/g, (_, n, unit) =>
    `${(parseFloat(n) * factor).toFixed(2)}${unit}`
  );
}

export type KineticEffect = {
  style: React.CSSProperties;
  category: KineticCategory;
};

// Plain lookup — base effect only, no pressure
export function getKineticEffect(word: string): KineticEffect | null {
  const k = KINETIC[word.toLowerCase().replace(/[^a-z]/g, "")];
  if (!k) return null;
  return { style: k.base, category: k.category };
}

// Pressure-amplified lookup — use this in ManuscriptCore.
// Paragraph weights/dualisms from Supabase modulate the intensity:
// a "fall" in a high-descent paragraph falls farther than in a neutral one.
export function getKineticEffectWithPressure(
  word: string,
  weights: Record<string, number>,
  dualisms: Record<string, number>
): React.CSSProperties | null {
  const k = KINETIC[word.toLowerCase().replace(/[^a-z]/g, "")];
  if (!k) return null;

  const pressure = getPressure(k.category, weights, dualisms);
  // Minimum 60% intensity so the effect is always visible; pressure adds up to 60% more
  const scale = 0.6 + pressure * 0.6;
  if (Math.abs(scale - 1) < 0.05) return k.base;

  const style: React.CSSProperties = { ...k.base };
  if (style.transform) style.transform = scaleTransform(String(style.transform), scale);
  return style;
}

export function hasKineticEffect(word: string): boolean {
  return word.toLowerCase().replace(/[^a-z]/g, "") in KINETIC;
}
