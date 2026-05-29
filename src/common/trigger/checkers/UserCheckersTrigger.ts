// shared/utils/trigger/checkers/UserCheckersTrigger.ts
import { OmikenCommentType } from '../../../types/OmikenComment/OmikenCommentSchema'
import { GiftCondition, SyokenCondition } from '../../../types/Threshold'
import { AccessConditionTrigger } from '../../../types/trigger'
import { CountConditionTriggerType } from '../../../types/trigger/CountConditionTrigger'
import { compareValue, getGiftTier } from '../../../utils/threshold/ThresholdHelpers'

/**
 * 初見・久しぶりのチェック
 */
export function checkSyokenTrigger(omiken: OmikenCommentType, syoken: SyokenCondition[] = []): boolean {
  if (!syoken.length) return true
  const { no, tc, isAgain } = omiken.meta

  const isSyoken = tc === 1
  const isFirstVisit = !isSyoken && !isAgain && no === 1

  const conditions = { syoken: isSyoken, again: isAgain, firstVisit: isFirstVisit }
  return syoken.some((condition) => conditions[condition] ?? false)
}

/**
 * ユーザー役職チェック
 */
export function checkAccessTrigger(omiken: OmikenCommentType, access: AccessConditionTrigger[] = []): boolean {
  if (!access.length) return true
  const { accessLevel } = omiken
  return access.some((required) => accessLevel.includes(required))
}

/**
 * 数値条件チェック
 */
export function checkCountTrigger(omiken: OmikenCommentType, count?: CountConditionTriggerType): boolean {
  if (!count) return true
  const unitValue = count.unit === 'draws' ? (omiken.omikuji?.draws ?? 0) : (omiken.meta[count.unit] ?? 0)
  if (unitValue === 0 && count.comparison === 'loop') return false
  return compareValue(unitValue, count)
}

/**
 * ギフト条件チェック
 */
export function checkGiftTrigger(omiken: OmikenCommentType, gift: GiftCondition[] = []): boolean {
  if (!gift.length) return true

  const { giftPrice } = omiken

  // ギフトなしの場合でも、ギフト条件が空配列なら通す
  if (!giftPrice) return false

  // all が含まれていれば、hasGift が true の時点で true
  if (gift.includes('all')) return true

  const tier = getGiftTier(giftPrice)
  return gift.includes(tier)
}
