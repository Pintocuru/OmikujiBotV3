// src/generator/scripts/trigger/checkers/UserCheckersTrigger.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import {
  AccessConditionType,
  CountConditionType,
  GiftConditionType,
  GiftKindType,
  SyokenConditionType,
} from '@/types/engine'
import { compareValue, getGiftTier } from './TriggerHelpers'

/**
 * 初見・久しぶりのチェック
 */
export function checkSyoken(omiken: OmikenCommentType, syoken: SyokenConditionType[] = []): boolean {
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
export function checkAccess(omiken: OmikenCommentType, access: AccessConditionType[] = []): boolean {
  if (!access.length) return true
  const { accessLevel } = omiken
  return access.some((required) => accessLevel.includes(required))
}

/**
 * 数値条件チェック
 */
export function checkCount(omiken: OmikenCommentType, count?: CountConditionType): boolean {
  if (!count) return true
  const unitValue = omiken.meta[count.unit] ?? 0
  if (unitValue === 0 && count.comparison === 'loop') return false
  return compareValue(unitValue, count)
}

/**
 * ギフト条件チェック
 * - gift: 金額の段階(有料ギフトにだけ効く) / kinds: ギフトの種類(空 = 種類を問わない)
 */
export function checkGift(
  omiken: OmikenCommentType,
  gift: GiftConditionType[] = [],
  kinds: GiftKindType[] = []
): boolean {
  // どちらも空なら、ギフトでないコメントも通す
  if (!gift.length && !kinds.length) return true

  const { giftKind, giftPrice } = omiken

  // ギフトでなければ通さない
  if (giftKind === null) return false

  // 種類の指定があれば、含まれている種類だけ通す
  if (kinds.length && !kinds.includes(giftKind)) return false

  // 種類だけの指定なら通す
  if (!gift.length) return true

  // all なら金額を問わず通す(無料・メンバー/サブスクも通る)
  if (gift.includes('all')) return true

  // 金額の段階は有料ギフトにだけ効く
  if (giftKind !== 'paid') return false
  return gift.includes(getGiftTier(giftPrice ?? 0))
}
