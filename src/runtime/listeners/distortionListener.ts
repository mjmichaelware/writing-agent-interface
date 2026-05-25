import { bus } from "@/core/runtimeEngine";

type ArchetypalWeights = {
  shadow: number;
  persona: number;
  anima: number;
  self: number;
};

type PhysicsState = {
  mass: number;
  tension: number;
  blur: number;
  drift: number;
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Compute kinetic physics from archetypal weights if available,
// otherwise fall back to position-based heuristic
function computePhysics(
  paraIndex: number,
  weights?: ArchetypalWeights
): PhysicsState {
  if (weights) {
    // Embedding-driven: shadow drives mass, persona drives drift,
    // anima drives blur (dreamlike), low self = high tension
    return {
      mass:    Math.min(1, weights.shadow  * 0.85),
      tension: Math.min(1, (1 - weights.self) * 0.7),
      blur:    Math.min(1, weights.anima   * 0.4),
      drift:   Math.min(1, weights.persona * 0.5),
    };
  }

  // Narrative position heuristic until embedding pipeline is live
  const inDescent     = paraIndex >= 13;
  const inThePit      = paraIndex >= 10 && paraIndex <= 18;
  const atDreamBorder = paraIndex <= 4;
  const isTransition  = [6, 12, 19].includes(paraIndex);

  return {
    mass:    inDescent    ? Math.min(0.9, (paraIndex - 13) / 20)         : 0,
    tension: inThePit     ? Math.sin(((paraIndex - 10) / 8) * Math.PI) * 0.78 : 0,
    blur:    atDreamBorder ? ((4 - paraIndex) / 4) * 0.45               : 0,
    drift:   isTransition  ? 0.55                                        : 0,
  };
}

let current: PhysicsState = { mass: 0, tension: 0, blur: 0, drift: 0 };
let physicsRafId: number | null = null;

function applySmooth(target: PhysicsState, reduced: boolean) {
  if (physicsRafId) cancelAnimationFrame(physicsRafId);

  if (reduced) {
    current = { ...target };
    const root = document.documentElement;
    root.style.setProperty("--arc-mass",    target.mass.toFixed(4));
    root.style.setProperty("--arc-tension", target.tension.toFixed(4));
    root.style.setProperty("--arc-blur",    target.blur.toFixed(4));
    root.style.setProperty("--arc-drift",   target.drift.toFixed(4));
    return;
  }

  const animate = () => {
    current.mass    = lerp(current.mass,    target.mass,    0.06);
    current.tension = lerp(current.tension, target.tension, 0.06);
    current.blur    = lerp(current.blur,    target.blur,    0.06);
    current.drift   = lerp(current.drift,   target.drift,   0.06);

    const root = document.documentElement;
    root.style.setProperty("--arc-mass",    current.mass.toFixed(4));
    root.style.setProperty("--arc-tension", current.tension.toFixed(4));
    root.style.setProperty("--arc-blur",    current.blur.toFixed(4));
    root.style.setProperty("--arc-drift",   current.drift.toFixed(4));

    const settled =
      Math.abs(current.mass    - target.mass)    < 0.001 &&
      Math.abs(current.tension - target.tension) < 0.001 &&
      Math.abs(current.blur    - target.blur)    < 0.001 &&
      Math.abs(current.drift   - target.drift)   < 0.001;

    if (!settled) {
      physicsRafId = requestAnimationFrame(animate);
    } else {
      physicsRafId = null;
    }
  };

  physicsRafId = requestAnimationFrame(animate);
}

export function initDistortionListener() {
  if (typeof window === "undefined") return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Position-based physics — fires on every scroll:focus
  const unsubScroll = bus.on("scroll:focus", (data: any) => {
    const index   = Number.parseInt(String(data?.paraIndex ?? 0), 10) || 0;
    const weights = data?.archetypal_weights as ArchetypalWeights | undefined;
    const physics = computePhysics(index, weights);

    applySmooth(physics, reduced);
    bus.emit("distortion:update", { ...physics, paraIndex: index });
  });

  // Embedding pipeline override — fires when semantic parse is live
  const unsubSemantic = bus.on("engine:semantic_parse", (data: any) => {
    const dualism   = Number(data?.dualism   ?? 0);
    const archetype = Number(data?.archetype ?? 0);
    document.documentElement.style.setProperty("--arc-dualism",  String(dualism   / 100));
    document.documentElement.style.setProperty("--arc-tension",  String(archetype / 100));
  });

  return () => {
    unsubScroll();
    unsubSemantic();
    if (physicsRafId) cancelAnimationFrame(physicsRafId);
  };
}
