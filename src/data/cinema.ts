// Layer 2 — Cinematic Asset Registry
// Assets are selected by CONTENT ANALYSIS of the active paragraph,
// not by hardcoded paragraph index numbers.
// When the cognitive engines are live, archetypal_weights from the
// database replace this keyword layer entirely.

export type ThematicAssetRule = {
  keywords: string[];
  asset: string;
  priority: number; // higher = checked first
};

// Per-chapter thematic rules — bound to narrative content
export const THEMATIC_RULES: Record<string, ThematicAssetRule[]> = {
  "7": [
    {
      priority: 10,
      keywords: [
        "flies", "beelzebub", "swarm", "buzzing", "hum",
        "insect", "cloud of", "baal", "lord of flies"
      ],
      asset: "/assets/flies.jpg",
    },
    {
      priority: 9,
      keywords: [
        "megiddo", "pit", "the pit", "gates of", "abyss",
        "fell into", "descent", "plunged", "bottom", "below",
        "deep", "darkness swallowed", "valley"
      ],
      asset: "/assets/megiddo1.jpg",
    },
    {
      priority: 8,
      keywords: [
        "megiddo walls", "fortress", "stone wall", "gate tower",
        "ancient city", "city gate", "rampart"
      ],
      asset: "/assets/megiddo2.jpg",
    },
    {
      priority: 1,
      keywords: [], // default for chapter 7
      asset: "/assets/bg.png",
    },
  ],
  "6": [
    {
      priority: 10,
      keywords: [
        "flies", "beelzebub", "baal-zebub", "swarm", "buzzing",
        "lord of flies", "insect"
      ],
      asset: "/assets/flies.jpg",
    },
    {
      priority: 1,
      keywords: [],
      asset: "/assets/bg.png",
    },
  ],
};

// Default fallback for all chapters without specific rules
export const DEFAULT_ASSET = "/assets/bg.png";

// How many paragraphs before forcing a re-evaluation
// even if content signal hasn't changed
export const CINEMA_PARAGRAPHS_PER_IMAGE = 6;

// Resolve which asset to show for a given paragraph's text content
export function resolveAsset(content: string, chapterSlug: string): string {
  const rules = THEMATIC_RULES[chapterSlug];
  if (!rules) return DEFAULT_ASSET;

  const normalized = content.toLowerCase();

  // Sort by priority descending, check keywords
  const sorted = [...rules].sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    // Rules with no keywords are defaults — skip until end
    if (rule.keywords.length === 0) continue;
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.asset;
    }
  }

  // Return default rule (keywords: [])
  const defaultRule = sorted.find((r) => r.keywords.length === 0);
  return defaultRule?.asset || DEFAULT_ASSET;
}
