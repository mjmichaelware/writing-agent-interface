/**
 * Feature 15: HTML Tokenizer Engine
 * Client-side utility that splits plain string blocks into individual nested words 
 * wrapped in <span> tags with physics bindings.
 */
export function tokenize(text: string): string {
  // Split by whitespace but keep the whitespace as tokens if needed
  // For simplicity, we split by words and wrap them.
  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/\s+/.test(token)) {
        return token;
      }
      return `<span class="kinetic-word transition-all duration-700 hover:text-[var(--accent-gold)]">${token}</span>`;
    })
    .join('');
}
