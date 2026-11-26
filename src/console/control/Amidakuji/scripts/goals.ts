// src/console/control/Amidakuji/scripts/goals.ts
// ゴール(当たり・はずれ)の生成・シャッフル・検証

import { DEFAULT_LOSE_LABEL } from './amidakujiConstants'

export type PrizeInput = {
  id: string
  name: string
  count: number
}

export type GoalItem = {
  id: string
  name: string
  isHit: boolean
}

/** 個数を 0 以上の整数にそろえる (空欄・NaN・小数・負数の入力対策) */
export const normalizeCount = (count: unknown): number => {
  const n = Number(count)
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0
}

/**
 * 当たりの合計個数を計算
 */
export const countTotalPrizes = (prizes: readonly PrizeInput[]): number => {
  return prizes.reduce((sum, p) => sum + normalizeCount(p.count), 0)
}

/**
 * 当たりリストとはずれ設定から、参加者数に合わせたゴールの配列を生成し、シャッフルする。
 * 当たり合計 > 参加者数の場合はエラーをスロー。
 */
export const generateShuffledGoals = (
  prizes: readonly PrizeInput[],
  colCount: number,
  loseLabel: string = DEFAULT_LOSE_LABEL,
  rng: () => number = Math.random
): GoalItem[] => {
  const totalPrizes = countTotalPrizes(prizes)
  if (totalPrizes > colCount) {
    throw new Error(`当たりの数(${totalPrizes})が参加者数(${colCount})を超えています`)
  }

  const goals: GoalItem[] = []
  let seq = 1

  // 当たりを追加
  for (const prize of prizes) {
    const validCount = normalizeCount(prize.count)
    for (let i = 0; i < validCount; i++) {
      goals.push({
        id: `prize-${prize.id}-${i}-${seq++}`,
        name: prize.name.trim() || '当たり',
        isHit: true,
      })
    }
  }

  // はずれを追加
  const loseCount = colCount - totalPrizes
  const actualLoseLabel = loseLabel.trim() || DEFAULT_LOSE_LABEL
  for (let i = 0; i < loseCount; i++) {
    goals.push({
      id: `lose-${i}-${seq++}`,
      name: actualLoseLabel,
      isHit: false,
    })
  }

  // Fisher-Yates でシャッフル
  for (let i = goals.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const temp = goals[i]
    goals[i] = goals[j]
    goals[j] = temp
  }

  return goals
}
