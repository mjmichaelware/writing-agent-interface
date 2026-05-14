export const tokenize = (text: string): string[] => {
  const regex = /[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*|[^\p{L}\p{M}\s]+|\s+/gu;
  return text.match(regex) || [];
};
