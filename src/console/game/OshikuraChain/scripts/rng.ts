// src/console/game/OshikuraChain/scripts/rng.ts
// 種から作る乱数と、文字列のハッシュ (純粋関数。同じ入力なら同じ値になる)

export type Rng = () => number

/** 種から作る乱数 (mulberry32)。UserRace の createRng と同じ。ゲーム同士で依存しないよう、ここに持つ */
export const createRng = (seed: number): Rng => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 文字列の 32bit ハッシュ (FNV-1a)。userId から、邪魔者の性質を決める種を作る */
export const hashString = (text: string): number => {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}
