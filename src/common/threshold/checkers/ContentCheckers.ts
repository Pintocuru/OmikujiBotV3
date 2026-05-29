// shared/utils/threshold/checkers/ContentCheckers.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { GiftCondition, CountConditionType } from '../../../types/Threshold/'
import { getCommentMeta, convertToJPY, getGiftTier, compareValue } from '../ThresholdHelpers'

/**
 * ギフト条件チェック
 */
export function checkGift(comment: Comment, gift: GiftCondition[] = []): boolean {
  if (!gift.length) return true

  const { hasGift, price, unit } = comment.data as {
    hasGift: boolean
    price?: number
    unit?: string
  }

  // ギフトなしの場合でも、ギフト条件が空配列なら通す
  if (!hasGift) return false

  // all が含まれていれば、hasGift が true の時点で true
  if (gift.includes('all')) return true

  const priceInJPY = convertToJPY(price, unit)
  const tier = getGiftTier(priceInJPY)
  return gift.includes(tier)
}

/**
 * 数値条件チェック
 */
export function checkCount(comment: Comment, count: CountConditionType): boolean {
  if (!count) return true

  const meta = getCommentMeta(comment.meta)
  const unitValue = meta[count.unit]

  if (unitValue === undefined || (unitValue === 0 && count.comparison === 'loop')) {
    return false
  }
  return compareValue(unitValue, count)
}

/**
 * コメント文字列パターンチェック
 */
export function checkComment(comment: string, patterns: string[] = []): boolean {
  if (!comment) return false

  const normalize = (s: string) =>
    s
      .normalize('NFKC') // Unicode正規化
      .replace(/\u3000/g, ' ') // 全角スペース → 半角
      .replace(/\s+/g, ' ') // 連続空白圧縮
      .trim()

  const normalizedComment = normalize(comment)

  const validPatterns = patterns.map((p) => normalize(p)).filter(Boolean)

  if (validPatterns.length === 0) return false

  for (const pattern of validPatterns) {
    try {
      const regex = new RegExp(pattern, 'i')
      if (regex.test(normalizedComment)) {
        return true
      }
    } catch (e) {
      console.warn(`Invalid regex pattern: ${pattern}`, e)
    }
  }

  return false
}
