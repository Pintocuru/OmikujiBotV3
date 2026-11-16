// src/ui/LuckyDraw/composables/pickRandom.ts

type Random = () => number

/**
 * 配列から、重複なしで count 個をランダムに選ぶ(元の配列は変更しない)。
 * count が配列より多いときは、全員を(ランダムな順で)返す。
 */
export const pickRandom = <T>(items: readonly T[], count: number, random: Random = Math.random): T[] => {
  const pool = [...items]
  const n = Math.max(0, Math.min(Math.floor(count), pool.length))
  // 先頭 n 個だけ確定させる Fisher-Yates
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(random() * (pool.length - i))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}
