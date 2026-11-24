// src/sdk/subscribe/OmikenComment/giftInfo.ts
import type { GiftKindType } from '@/types/engine'
import { convertToJPY } from './currencyRates'
import type { PlatformFields } from './platformFields'

/**
 * ギフト情報(OmikenComment の giftKind / giftPrice / giftCount)
 */
export type GiftInfo = { giftKind: GiftKindType | null; giftPrice: number | null; giftCount: number }

const NOT_GIFT: GiftInfo = { giftKind: null, giftPrice: null, giftCount: 0 }

/** 個数は 1 以上の整数。なければ 1 */
function toCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1
}

/**
 * ギフトの種類・金額・個数を判定する(上から順に判定)。
 * - 種類は「実際にお金が入るか」で分ける(paid: 金額あり / free: 無料 / member: メンバー・サブスク)
 * - 金額はプラットフォームの数値のまま扱う(円に概算。ジュエル・ビッツは数値そのまま)
 */
export function getGiftInfo(fields: PlatformFields): GiftInfo {
  const { giftType, hasGift, price, subType } = fields

  // YouTube: メンバーシップのギフト購入(贈った件数 = giftCount)
  if (giftType === 'sponsorgift') return { giftKind: 'member', giftPrice: 0, giftCount: toCount(fields.giftCount) }

  // YouTube: マイルストーン・ギフトの受け取りはギフトではない
  if (giftType === 'milestonechat' || giftType === 'giftreceived') return NOT_GIFT

  // YouTube: subscribe(仮: ギフトとして届いた場合だけ無料ギフト)
  // TODO: subscribe が何を指すか未確定
  if (giftType === 'subscribe') return hasGift ? { giftKind: 'free', giftPrice: 0, giftCount: 1 } : NOT_GIFT

  // YouTube: ジュエル。price は消費ジュエル数の合計(通貨なし)
  // 1 ジュエル = 1 円として扱う
  if (giftType === 'jewel') {
    return { giftKind: 'paid', giftPrice: convertToJPY(price), giftCount: toCount(fields.giftCount) }
  }

  // Twitch: サブスク(sub / resub / subgift / submysterygift など)。一括贈呈は贈った数、それ以外は 1
  if (subType) {
    return { giftKind: 'member', giftPrice: 0, giftCount: subType === 'submysterygift' ? toCount(fields.giftCount) : 1 }
  }

  // ギフトでなければ対象外
  if (!hasGift) return NOT_GIFT

  // ツイキャスの無料ギフト(お茶など)
  if (fields.isFreeGift) return { giftKind: 'free', giftPrice: 0, giftCount: toCount(fields.giftCount) }

  // 金額あり(通貨は円に概算)
  if (price && price > 0) {
    return {
      giftKind: 'paid',
      giftPrice: convertToJPY(price, fields.currency, fields.unit),
      giftCount: toCount(fields.giftCount),
    }
  }

  // 金額なしの Twitch ビッツ
  const bits = Number(fields.bits)
  if (Number.isFinite(bits) && bits > 0) return { giftKind: 'paid', giftPrice: bits, giftCount: 1 }

  // 上記以外の金額なしギフト
  return { giftKind: 'free', giftPrice: 0, giftCount: 1 }
}
