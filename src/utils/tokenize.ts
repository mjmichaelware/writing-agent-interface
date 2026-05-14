export const tokenize = (text: string): string[] => {
  const regex = /[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*|[^\p{L}\p{M}\s]+|\s+/gu;
  return text.match(regex) || [];
};
export const isWordToken = (token: string): boolean => /[\p{L}\p{M}]/u.test(token);
