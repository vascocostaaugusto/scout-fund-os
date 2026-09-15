// Deterministic seeded PRNG (mulberry32) so mock data is stable across
// server/client renders and across reloads — no hydration drift, no
// re-randomizing on every request.
export function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed: number) {
  const rand = mulberry32(seed);
  return {
    next: rand,
    int(min: number, max: number) {
      return Math.floor(rand() * (max - min + 1)) + min;
    },
    float(min: number, max: number, decimals = 1) {
      const v = rand() * (max - min) + min;
      const p = 10 ** decimals;
      return Math.round(v * p) / p;
    },
    pick<T>(arr: readonly T[]): T {
      return arr[Math.floor(rand() * arr.length)];
    },
    weighted<T>(items: readonly (readonly [T, number])[]): T {
      const total = items.reduce((s, [, w]) => s + w, 0);
      let r = rand() * total;
      for (const [item, w] of items) {
        r -= w;
        if (r <= 0) return item;
      }
      return items[items.length - 1][0];
    },
    bool(pTrue = 0.5) {
      return rand() < pTrue;
    },
  };
}
