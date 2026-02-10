export function stringToSeed(input: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seedFromParts(...parts: Array<string | number | undefined>) {
  return stringToSeed(parts.filter(Boolean).join("|"));
}

export function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, list: T[]) {
  return list[Math.floor(rand() * list.length)];
}

export function pickMany<T>(rand: () => number, list: T[], count: number) {
  const copy = [...list];
  const out: T[] = [];
  for (let i = 0; i < count && copy.length; i += 1) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function range(rand: () => number, min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
