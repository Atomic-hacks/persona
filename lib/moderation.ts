const BANNED_WORDS = ["slur", "hate", "harass", "abuse", "dox"]; // small starter list

export function containsBannedWords(input: string) {
  const lowered = input.toLowerCase();
  return BANNED_WORDS.some((word) => lowered.includes(word));
}

export function findBannedWord(input: string) {
  const lowered = input.toLowerCase();
  return BANNED_WORDS.find((word) => lowered.includes(word));
}

export { BANNED_WORDS };
