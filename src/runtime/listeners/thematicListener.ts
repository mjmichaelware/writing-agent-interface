import { bus } from "@/core/runtimeEngine";

type Tone = "sacred" | "descent" | "neutral";

type ArchetypalWeights = {
  shadow: number;
  persona: number;
  anima: number;
  self: number;
};

// Tone detection — embedding-driven if weights available,
// otherwise narrative position heuristic
function detectTone(
  paraIndex: number,
  weights?: ArchetypalWeights
): Tone {
  if (weights) {
    if (weights.shadow > 0.6) return "descent";
    if (weights.anima  > 0.5 || weights.self > 0.6) return "sacred";
    return "neutral";
  }

  // Position heuristic — The Pit and beyond = descent
  // Dreamwalker threshold and select sacred beats = sacred
  if (paraIndex >= 13) return "descent";
  if (paraIndex <= 2 || paraIndex === 7 || paraIndex === 14) return "sacred";
  return "neutral";
}

function clearAllTones() {
  document.querySelectorAll("p[data-tone]").forEach((el) => {
    (el as HTMLElement).dataset.tone = "";
  });
}

function applyToneToDOM(index: number, tone: Tone) {
  clearAllTones();

  const el = document.querySelector(
    `p[data-index="${index}"]`
  ) as HTMLElement | null;

  if (el && tone !== "neutral") {
    el.dataset.tone = tone;
  }

  // CSS var for global tone state
  document.documentElement.style.setProperty("--theme-tone", tone);

  // RGB decomposed for CSS interpolation
  const toneRgb =
    tone === "sacred"  ? "232, 212, 160" :   // var(--sacred)  #e8d4a0
    tone === "descent" ? "107,  44,  44" :   // var(--descent) #6b2c2c
                         "232, 228, 220";    // var(--text-body) #e8e4dc

  document.documentElement.style.setProperty("--active-tone-rgb", toneRgb);
}

let toneRafId: number | null = null;
let lastTone: Tone | null = null;

export function initThematicListener() {
  if (typeof window === "undefined") return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return bus.on("scroll:focus", (data: any) => {
    const index   = Number.parseInt(String(data?.paraIndex ?? 0), 10) || 0;
    const weights = data?.archetypal_weights as ArchetypalWeights | undefined;
    const tone    = detectTone(index, weights);

    // Warmth: builds from dreamwalker coolness into descent warmth
    const warmth = Math.min(1, 0.25 + (index % 12) / 24);
    document.documentElement.style.setProperty("--theme-warmth", String(warmth));

    // Batch DOM tone writes with paint cycle
    if (toneRafId) cancelAnimationFrame(toneRafId);

    if (reduced) {
      applyToneToDOM(index, tone);
    } else {
      toneRafId = requestAnimationFrame(() => {
        applyToneToDOM(index, tone);
        toneRafId = null;
      });
    }

    if (
      tone !== lastTone &&
      (tone === "sacred" || tone === "descent") &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(10);
    }

    lastTone = tone;

    // Emit for other systems (Layer2Cinema, ArchetypesDirectory, etc.)
    bus.emit("theme:tone",    { tone, paraIndex: index, warmth });
    bus.emit("theme:warmth",  { warmth, paraIndex: index });
  });
}
