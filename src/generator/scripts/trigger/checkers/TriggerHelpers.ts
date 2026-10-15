// src/generator/scripts/trigger/checkers/TriggerHelpers.ts
import { CountComparisonCondition, GiftCondition } from '@/types/engine'

/**
 * ギフトティア計算（YouTube基準）
 */
export const getGiftTier = (price?: number | null): GiftCondition => {
  // 金額のないギフト（メンバーシップ、ステッカー、サブスク等）
  if (price === null || price === undefined || price <= 0) return 'special'

  const ranges: [number, GiftCondition][] = [
    [200, 'blue'],
    [500, 'lightBlue'],
    [1000, 'green'],
    [2000, 'yellow'],
    [5000, 'orange'],
    [10000, 'pink'],
    [20000, 'red'],
    [Infinity, 'purple'],
  ]

  return ranges.find(([threshold]) => price < threshold)?.[1] ?? 'purple'
}

/**
 * 数値比較ヘルパー関数
 */
export function compareValue(current: number, count: { comparison: CountComparisonCondition; value: number }): boolean {
  switch (count.comparison) {
    case 'lowerBound':
      return current >= count.value
    case 'upperBound':
      return current <= count.value
    case 'equal':
      return current === count.value
    case 'loop':
      return current % count.value === 0
    default:
      throw new Error('無効な比較演算子です: ' + count.comparison)
  }
}

/**
 * 時間範囲チェック（追加機能）
 */
export function checkTimeRange(startHour: number, endHour: number): boolean {
  const now = new Date()
  const currentHour = now.getHours()

  if (startHour <= endHour) {
    return currentHour >= startHour && currentHour < endHour
  } else {
    // 日をまたぐ場合（例: 23-7時）
    return currentHour >= startHour || currentHour < endHour
  }
}
