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

type NarrativeMeta = {
  chapterCounts: Map<number, number>;
  offsets: Map<number, number>;
  averageParagraphs: number;
  totalParagraphs: number;
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

let narrativeMeta: NarrativeMeta = {
  chapterCounts: new Map(),
  offsets: new Map(),
  averageParagraphs: 18,
  totalParagraphs: 25 * 18,
};

async function loadNarrativeMeta(): Promise<NarrativeMeta> {
  const chaptersResponse = await fetch("/api/chapters", { cache: "no-store" });
  if (!chaptersResponse.ok) {
    throw new Error(`chapter metadata request failed: ${chaptersResponse.status}`);
  }

  const chapters = await chaptersResponse.json();
  const chapterRows = Array.isArray(chapters) ? chapters : [];
  const chapterNumbers = chapterRows
    .map((row: any) => Number(row?.chapter_number))
    .filter((value: number) => Number.isInteger(value) && value > 0)
    .sort((a: number, b: number) => a - b);

  const countEntries = await Promise.all(
    chapterNumbers.map(async (chapterNumber) => {
      try {
        const response = await fetch(`/api/manuscript?chapterNumber=${chapterNumber}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          return [chapterNumber, 0] as const;
        }

        const payload = await response.json();
        const paragraphs = Array.isArray(payload?.paragraphs) ? payload.paragraphs : [];
        return [chapterNumber, paragraphs.length] as const;
      } catch {
        return [chapterNumber, 0] as const;
      }
    })
  );

  const chapterCounts = new Map<number, number>();
  countEntries.forEach(([chapterNumber, count]) => {
    chapterCounts.set(chapterNumber, count);
  });

  const totalParagraphs = countEntries.reduce((sum, [, count]) => sum + Math.max(count, 0), 0);
  const averageParagraphs = countEntries.length > 0
    ? Math.max(1, totalParagraphs / countEntries.length)
    : 18;

  const offsets = new Map<number, number>();
  let runningOffset = 0;
  chapterNumbers.forEach((chapterNumber) => {
    offsets.set(chapterNumber, runningOffset);
    runningOffset += chapterCounts.get(chapterNumber) || Math.round(averageParagraphs);
  });

  return {
    chapterCounts,
    offsets,
    averageParagraphs,
    totalParagraphs: Math.max(runningOffset, totalParagraphs, 1),
  };
}

function resolveNarrativePosition(chapterNumber: number, paragraphOrder: number) {
  const safeChapterNumber = Number.isInteger(chapterNumber) && chapterNumber > 0 ? chapterNumber : 1;
  const safeParagraphOrder = Number.isFinite(paragraphOrder) ? Math.max(0, paragraphOrder) : 0;
  const fallbackOffset = (safeChapterNumber - 1) * narrativeMeta.averageParagraphs;
  const chapterOffset = narrativeMeta.offsets.get(safeChapterNumber) ?? fallbackOffset;
  const rawPosition = chapterOffset + safeParagraphOrder;
  return Math.max(0, Math.min(1, rawPosition / Math.max(1, narrativeMeta.totalParagraphs - 1)));
}

// Compute kinetic physics from archetypal weights if available,
// otherwise fall back to full-arc position heuristic.
function computePhysics(
  narrativePosition: number,
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

  const inDescent = narrativePosition >= 0.55;
  const inThePit = narrativePosition >= 0.42 && narrativePosition <= 0.72;
  const atDreamBorder = narrativePosition <= 0.14;
  const transitionDistance = Math.min(
    Math.abs(narrativePosition - 0.28),
    Math.abs(narrativePosition - 0.5),
    Math.abs(narrativePosition - 0.8)
  );
  const transitionStrength = Math.max(0, 1 - transitionDistance / 0.08);

  return {
    mass: inDescent ? Math.min(0.9, (narrativePosition - 0.55) / 0.45) : 0,
    tension: inThePit
      ? Math.sin(((narrativePosition - 0.42) / 0.3) * Math.PI) * 0.78
      : 0,
    blur: atDreamBorder ? ((0.14 - narrativePosition) / 0.14) * 0.45 : 0,
    drift: transitionStrength * 0.55,
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
  loadNarrativeMeta()
    .then((meta) => {
      narrativeMeta = meta;
    })
    .catch((error) => {
      console.warn("Failed to preload narrative metadata for distortion listener:", error);
    });

  // Position-based physics — fires on every scroll:focus
  const unsubScroll = bus.on("scroll:focus", (data: any) => {
    const index = Number.parseInt(String(data?.paraIndex ?? 0), 10) || 0;
    const paragraphOrder = Number.parseInt(String(data?.paragraphOrder ?? index), 10) || index;
    const chapterNumber = Number.parseInt(String(data?.chapterNumber ?? data?.chapterSlug ?? 1), 10) || 1;
    const weights = data?.weights as ArchetypalWeights | undefined;
    const narrativePosition = resolveNarrativePosition(chapterNumber, paragraphOrder);
    const physics = computePhysics(narrativePosition, weights);

    applySmooth(physics, reduced);
    bus.emit("distortion:update", {
      ...physics,
      paraIndex: index,
      paragraphOrder,
      chapterNumber,
      narrativePosition,
    });
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
