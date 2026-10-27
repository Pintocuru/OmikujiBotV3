// src/engine/DrawOmikuji/DrawOmikuji.ts
import { HighQualityRandom } from './HighQualityRandom'

export interface OmikujiWeightItem {
  isPriority?: boolean
  weight?: number
  weightPercent?: number | '---'
  [key: string]: unknown
}
type WithWeightPercent<T> = T & {
  weightPercent: number | '---'
}

/**
 * 配列の有効性チェック
 */
function isValidItems(items: any[]): boolean {
  return Array.isArray(items) && items.length > 0
}

// グローバルな高品質乱数生成器インスタンス
const globalRandom = new HighQualityRandom()

/**
 * おみくじ抽選
 */
export function drawOmikuji<T extends OmikujiWeightItem | string>(items: T[]): T | null {
  if (!isValidItems(items)) return null

  // 文字列配列を正規化
  const normalizedItems: OmikujiWeightItem[] =
    typeof items[0] === 'string'
      ? (items as string[]).map((comment) => ({
          comment,
          weight: 1,
          isPriority: false,
        }))
      : (items as OmikujiWeightItem[])

  // priority があれば抽選せず先頭を返す
  const priorityIndex = normalizedItems.findIndex((item) => item.isPriority === true)
  if (priorityIndex !== -1) return items[priorityIndex]

  // 重みを取得し、総重量を計算
  const weights = normalizedItems.map((item) => Math.max(item.weight ?? 1, 0.001))
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  if (totalWeight <= 0) return null

  // 高品質乱数で抽選
  const randomValue = globalRandom.nextFloat(0, totalWeight)
  let currentWeight = 0

  for (let i = 0; i < normalizedItems.length; i++) {
    currentWeight += weights[i]
    if (randomValue < currentWeight) {
      return items[i]
    }
  }

  return items[globalRandom.nextInt(items.length)]
}

/**
 * おみくじアイテムに weightPercent を付与
 * （既存の機能を保持）
 */
export function addWeightPercentages<T extends OmikujiWeightItem>(items: T[]): WithWeightPercent<T>[] {
  if (!Array.isArray(items) || items.length === 0) return []

  // priority でないアイテムのみを対象にする
  const normalItems = items.filter((item) => item.isPriority !== true)

  const totalWeight = normalItems.reduce((sum, item) => sum + Math.max(item.weight ?? 1, 0.001), 0)

  return items.map((item) => {
    // priority は抽選外
    if (item.isPriority === true) {
      return { ...item, weightPercent: '---' }
    }

    const weight = Math.max(item.weight ?? 1, 0.001)
    const percent = totalWeight > 0 ? (weight / totalWeight) * 100 : 0

    return {
      ...item,
      weightPercent: parseFloat(percent.toFixed(2)),
    }
  })
}
