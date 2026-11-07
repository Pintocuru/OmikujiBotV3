// src/generator/scripts/trigger/checkers/TriggerHelpers.ts
import { CountComparisonCondition, GiftConditionType } from '@/types/engine'

/**
 * ギフトの金額の段階(YouTube基準)。有料ギフトの金額に対して使う
 */
export const getGiftTier = (price: number): GiftConditionType => {
  const ranges: [number, GiftConditionType][] = [
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
