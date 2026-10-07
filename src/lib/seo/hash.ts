/** Deterministic hash for stable mock data across refreshes */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededFloat(seed: number, min = 0, max = 1): number {
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return min + frac * (max - min);
}

export function seededInt(seed: number, min: number, max: number): number {
  return Math.floor(seededFloat(seed, min, max + 1));
}
