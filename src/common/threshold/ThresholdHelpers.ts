// shared/utils/threshold/ThresholdHelpers.ts
import { GiftCondition } from '../../types/Threshold/'
import { CountComparisonCondition } from '../../types/trigger/CountConditionTrigger'
import { BaseCommentMeta, Comment } from '@onecomme.com/onesdk/types/Comment'

/**
 * コメントテスター判定
 */
export const isCommentTester = (comment: Comment): boolean => comment.id === 'COMMENT_TESTER'

/**
 * デフォルトメタデータ提供
 */
export const getCommentMeta = (meta?: BaseCommentMeta): Required<BaseCommentMeta> => ({
  no: meta?.no ?? 2,
  tc: meta?.tc ?? 10,
  lc: meta?.lc ?? 2,
  interval: meta?.interval ?? 30000,
  free: meta?.free ?? true,
  moderation: 'low', // ? これはなに？
  sentiment: 0, // ? これはなに？
})

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
 * 単位が NT$ や $ の場合、数値を掛け算する
 * ドルなら100倍、NT$なら5倍
 */
export function convertToJPY(price: number | undefined, unit?: string | undefined): number {
  if (!price || price <= 0) return 0

  const UnitRates: Record<string, number> = {
    '¥': 1,
    $: 100,
    NT$: 5,
  }

  return price * (UnitRates[unit ?? '¥'] ?? 1)
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
