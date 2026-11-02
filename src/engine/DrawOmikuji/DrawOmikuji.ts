// src/engine/DrawOmikuji/DrawOmikuji.ts
// 重み付き抽選。対象は次の 2 種類だけで、どちらも型で縛っている(汎用の any 的な入力は受け付けない)
// - おみくじアイテム: item.lottery に weight / isPriority を持つ  → drawOmikuji
// - 重み付きの値(プレースホルダー・シナリオ呼び出し): item.weight を持つ → drawByWeight
import type { LotteryType } from '@/types/OmikujiData/'
import { HighQualityRandom } from './HighQualityRandom'

/** 重み付きの値(WeightValueType など) */
export type WeightedItem = { weight: number }

/** おみくじアイテム(OmikujiItemType など)。重みと優先は lottery の中にある */
export type LotteryItem = { lottery: Pick<LotteryType, 'isPriority' | 'weight'> }

// weight が 0 でも抽選対象から外れないようにする下限
const MIN_WEIGHT = 0.001
const clampWeight = (weight: number): number => Math.max(weight, MIN_WEIGHT)

// グローバルな高品質乱数生成器インスタンス
const globalRandom = new HighQualityRandom()

/** 重みの配列から当選したインデックスを返す(空配列は -1) */
function pickIndex(weights: number[]): number {
  if (weights.length === 0) return -1
  const total = weights.reduce((sum, w) => sum + w, 0)
  const randomValue = globalRandom.nextFloat(0, total)

  let current = 0
  for (let i = 0; i < weights.length; i++) {
    current += weights[i]
    if (randomValue < current) return i
  }
  return weights.length - 1
}

/** 重みから出現確率(%, 小数 2 桁)を求める。null の要素は抽選外 */
function toPercentages(weights: (number | null)[]): (number | null)[] {
  const total = weights.reduce<number>((sum, w) => sum + (w ?? 0), 0)
  return weights.map((w) => (w === null || total <= 0 ? null : parseFloat(((w / total) * 100).toFixed(2))))
}

/**
 * 重み付きの値を抽選する(プレースホルダー・シナリオ呼び出し用)
 */
export function drawByWeight<T extends WeightedItem>(items: T[]): T | null {
  const index = pickIndex(items.map((item) => clampWeight(item.weight)))
  return index === -1 ? null : items[index]
}

/**
 * おみくじアイテムを抽選する
 * - isPriority のアイテムがあれば、抽選せず配列の先頭側の 1 件を返す
 * - なければ lottery.weight による重み付き抽選
 * criteria による絞り込みは呼び出し側で済ませてから渡すこと
 */
export function drawOmikuji<T extends LotteryItem>(items: T[]): T | null {
  const priority = items.find((item) => item.lottery.isPriority)
  if (priority) return priority

  const index = pickIndex(items.map((item) => clampWeight(item.lottery.weight)))
  return index === -1 ? null : items[index]
}

/**
 * 重み付きの値の出現確率(%)。items と同じ順
 */
export function calcWeightPercentages(items: WeightedItem[]): number[] {
  return toPercentages(items.map((item) => clampWeight(item.weight))).map((p) => p ?? 0)
}

/**
 * おみくじアイテムの出現確率(%)。items と同じ順
 * 優先アイテムは抽選外なので null
 */
export function calcOmikujiPercentages(items: LotteryItem[]): (number | null)[] {
  return toPercentages(items.map((item) => (item.lottery.isPriority ? null : clampWeight(item.lottery.weight))))
}
