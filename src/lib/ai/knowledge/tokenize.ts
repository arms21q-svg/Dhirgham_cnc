const AR_STOP = new Set(["في", "من", "على", "إلى", "عن", "هل", "ما", "هو", "هي", "ان", "أن", "the", "a", "an", "is", "are", "for", "with"]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !AR_STOP.has(t));
}
