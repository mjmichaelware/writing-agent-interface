export type KineticEffect = {
  style?: React.CSSProperties;
  className?: string;
};

// Deterministic word-level narrative transforms.
// Keys are lowercase. Matching is whole-word, case-insensitive.
const KINETIC: Record<string, KineticEffect> = {
  // Physical compression / weight
  squeeze:    { style: { display: "inline-block", transform: "scaleX(0.62)", letterSpacing: "-0.06em", transformOrigin: "center" } },
  compressed: { style: { display: "inline-block", transform: "scaleX(0.7)", letterSpacing: "-0.04em" } },
  crushed:    { style: { display: "inline-block", transform: "scaleX(0.55) scaleY(0.88)", letterSpacing: "-0.07em" } },
  heavy:      { style: { display: "inline-block", fontWeight: 700, textShadow: "0 2px 4px rgba(0,0,0,0.6)" } },
  weight:     { style: { display: "inline-block", fontWeight: 700, textShadow: "0 2px 6px rgba(0,0,0,0.5)" } },
  burden:     { style: { display: "inline-block", transform: "translateY(3px) scaleY(0.92)", fontWeight: 600 } },

  // Falling / descent
  fall:       { style: { display: "inline-block", transform: "translateY(6px) rotate(-2deg)", opacity: 0.82 } },
  falling:    { style: { display: "inline-block", transform: "translateY(5px) rotate(-1.5deg)", opacity: 0.78 } },
  fell:       { style: { display: "inline-block", transform: "translateY(4px) rotate(-1deg)", opacity: 0.8 } },
  descent:    { style: { display: "inline-block", transform: "translateY(5px)", opacity: 0.8 } },
  descend:    { style: { display: "inline-block", transform: "translateY(4px)", opacity: 0.82 } },
  sank:       { style: { display: "inline-block", transform: "translateY(5px) scaleY(0.94)", opacity: 0.75 } },
  sinking:    { style: { display: "inline-block", transform: "translateY(4px) scaleY(0.92)", opacity: 0.78 } },
  collapsed:  { style: { display: "inline-block", transform: "translateY(6px) scaleX(0.88) scaleY(0.88)", opacity: 0.7 } },

  // Rising / ascent
  rise:       { style: { display: "inline-block", transform: "translateY(-4px)", opacity: 0.95 } },
  rising:     { style: { display: "inline-block", transform: "translateY(-5px)", opacity: 0.95 } },
  ascend:     { style: { display: "inline-block", transform: "translateY(-4px) scaleY(1.06)" } },
  ascent:     { style: { display: "inline-block", transform: "translateY(-5px) scaleY(1.08)" } },
  lifted:     { style: { display: "inline-block", transform: "translateY(-3px)" } },
  soared:     { style: { display: "inline-block", transform: "translateY(-6px) scaleY(1.1)" } },

  // Motion / sliding
  slide:      { style: { display: "inline-block", transform: "translateX(4px)", fontStyle: "italic" } },
  sliding:    { style: { display: "inline-block", transform: "translateX(3px)", fontStyle: "italic" } },
  slid:       { style: { display: "inline-block", transform: "translateX(3px)", fontStyle: "italic" } },
  drift:      { style: { display: "inline-block", transform: "translateX(5px) rotate(0.8deg)", opacity: 0.88 } },
  drifting:   { style: { display: "inline-block", transform: "translateX(4px) rotate(0.6deg)", opacity: 0.88 } },
  drifted:    { style: { display: "inline-block", transform: "translateX(3px) rotate(0.5deg)", opacity: 0.85 } },
  scatter:    { style: { display: "inline-block", letterSpacing: "0.18em", transform: "scaleX(1.1)" } },
  scattered:  { style: { display: "inline-block", letterSpacing: "0.14em" } },

  // Rotation / spin
  spin:       { style: { display: "inline-block", transform: "rotate(8deg)", transformOrigin: "center" } },
  spinning:   { style: { display: "inline-block", transform: "rotate(6deg)" } },
  spiral:     { style: { display: "inline-block", transform: "rotate(5deg) scaleX(0.92)" } },
  whirl:      { style: { display: "inline-block", transform: "rotate(10deg)", letterSpacing: "0.04em" } },
  twisted:    { style: { display: "inline-block", transform: "rotate(-5deg) scaleX(0.95)" } },
  turning:    { style: { display: "inline-block", transform: "rotate(4deg)" } },

  // Blur / obscurity
  blurry:     { style: { display: "inline-block", filter: "blur(1.8px)", opacity: 0.78 } },
  blur:       { style: { display: "inline-block", filter: "blur(1.4px)", opacity: 0.8 } },
  blurred:    { style: { display: "inline-block", filter: "blur(1.6px)", opacity: 0.78 } },
  dim:        { style: { display: "inline-block", opacity: 0.45, filter: "blur(0.4px)" } },
  dimming:    { style: { display: "inline-block", opacity: 0.42 } },
  shadow:     { style: { display: "inline-block", textShadow: "2px 2px 4px rgba(0,0,0,0.7)", opacity: 0.85 } },
  shadows:    { style: { display: "inline-block", textShadow: "2px 2px 4px rgba(0,0,0,0.7)", opacity: 0.85 } },
  darkness:   { style: { display: "inline-block", opacity: 0.55, textShadow: "0 0 8px rgba(0,0,0,0.9)" } },
  dark:       { style: { display: "inline-block", opacity: 0.6 } },

  // Light / illumination
  light:      { style: { display: "inline-block", textShadow: "0 0 12px rgba(255,240,180,0.65)", color: "#f5e8b0" } },
  shining:    { style: { display: "inline-block", textShadow: "0 0 14px rgba(255,235,150,0.7)", color: "#f5e8b0" } },
  glowing:    { style: { display: "inline-block", textShadow: "0 0 10px rgba(201,169,110,0.8)", color: "#e8d08a" } },
  bright:     { style: { display: "inline-block", textShadow: "0 0 10px rgba(255,240,160,0.55)", color: "#f0dfa0" } },
  flame:      { style: { display: "inline-block", textShadow: "0 0 8px rgba(255,100,30,0.7)", color: "#f07030" } },
  fire:       { style: { display: "inline-block", textShadow: "0 0 10px rgba(255,80,20,0.65)", color: "#f06020" } },
  burning:    { style: { display: "inline-block", textShadow: "0 0 10px rgba(255,80,20,0.6)", color: "#e85820" } },

  // Sacred / transcendent
  holy:       { style: { display: "inline-block", letterSpacing: "0.12em", textShadow: "0 0 14px rgba(220,200,150,0.55)", color: "#e8d49a" } },
  sacred:     { style: { display: "inline-block", letterSpacing: "0.1em", textShadow: "0 0 12px rgba(220,200,140,0.5)", color: "#e8d090" } },
  glory:      { style: { display: "inline-block", letterSpacing: "0.14em", textShadow: "0 0 16px rgba(240,210,130,0.65)", color: "#f0d888" } },
  divine:     { style: { display: "inline-block", letterSpacing: "0.1em", fontStyle: "italic", color: "#e8d49a" } },
  eternal:    { style: { display: "inline-block", letterSpacing: "0.14em", opacity: 0.92, color: "#d4c080" } },

  // Silence / stillness
  silence:    { style: { display: "inline-block", letterSpacing: "0.22em", opacity: 0.62 } },
  silent:     { style: { display: "inline-block", letterSpacing: "0.18em", opacity: 0.6 } },
  still:      { style: { display: "inline-block", letterSpacing: "0.1em", opacity: 0.7 } },
  stillness:  { style: { display: "inline-block", letterSpacing: "0.2em", opacity: 0.6 } },
  quiet:      { style: { display: "inline-block", letterSpacing: "0.12em", opacity: 0.65 } },
  whisper:    { style: { display: "inline-block", fontSize: "0.88em", opacity: 0.72, letterSpacing: "0.06em" } },
  whispered:  { style: { display: "inline-block", fontSize: "0.86em", opacity: 0.7 } },

  // Expansion / stretch
  vast:       { style: { display: "inline-block", letterSpacing: "0.25em", transform: "scaleX(1.12)" } },
  endless:    { style: { display: "inline-block", letterSpacing: "0.18em", transform: "scaleX(1.08)" } },
  wide:       { style: { display: "inline-block", letterSpacing: "0.2em" } },
  infinite:   { style: { display: "inline-block", letterSpacing: "0.22em", opacity: 0.88 } },

  // Pain / violence
  shattered:  { style: { display: "inline-block", letterSpacing: "0.14em", transform: "skewX(-3deg) scaleX(0.96)", opacity: 0.85 } },
  broken:     { style: { display: "inline-block", transform: "skewX(-2deg)", opacity: 0.82 } },
  torn:       { style: { display: "inline-block", transform: "skewX(-4deg) scaleX(0.92)", opacity: 0.8 } },
  trembling:  { style: { display: "inline-block", transform: "skewX(2deg)", opacity: 0.88 } },
  shaking:    { style: { display: "inline-block", transform: "skewX(1.5deg)" } },
};

export function getKineticEffect(word: string): KineticEffect | null {
  return KINETIC[word.toLowerCase().replace(/[^a-z]/g, "")] ?? null;
}

export function hasKineticEffect(word: string): boolean {
  return word.toLowerCase().replace(/[^a-z]/g, "") in KINETIC;
}
