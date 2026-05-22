/**
 * Feature 15: HTML Tokenizer Engine
 * Client-side utility that splits plain string blocks into individual nested words 
 * wrapped in <span> tags with physics bindings.
 * 
 * Feature 12: Hebrew Typography Rendering
 * Wrap biblical proper nouns and Hebrew terms in <span class="font-hebrew">.
 */
const BIBLICAL_NOUNS = [
  "Hebron", "Hermon", "Mamre", "Beelzebub", "Megiddo", "Sak", 
  "Aviel", "Dan", "Kasha", "Dagon", "Dahl", "Rafa"
];

export function tokenize(text: string): string {
  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/\s+/.test(token)) {
        return token;
      }
      
      const cleanToken = token.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const isBiblical = BIBLICAL_NOUNS.some(n => cleanToken.toLowerCase() === n.toLowerCase());
      
      const classes = [
        "kinetic-word",
        "transition-all",
        "duration-700",
        "hover:text-[var(--accent-gold)]",
        isBiblical ? "font-hebrew text-[var(--accent-gold)]" : ""
      ].filter(Boolean).join(" ");

      return `<span class="${classes}">${token}</span>`;
    })
    .join('');
}
