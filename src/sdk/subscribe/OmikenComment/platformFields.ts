// src/sdk/subscribe/OmikenComment/platformFields.ts

/**
 * プラットフォームによって有無や型が異なるフィールドのうち、判定に使うもの。
 * Comment['data'] はプラットフォームごとのユニオンで、共通で持たないため、ここで任意項目として読む。
 */
export type PlatformFields = {
  isOwner?: boolean
  isModerator?: boolean
  isMember?: boolean
  subscriber?: string // Twitch など('1' ならサブスク)
  premium?: boolean
  anonymity?: boolean // 多くのサービスの匿名
  isAnonymous?: boolean // Twicas の匿名
  hasGift?: boolean
  isFreeGift?: boolean // Twicas の無料ギフト(お茶など)
  price?: number
  giftCount?: number // 個数(YouTube / Twitch / Mixch / BiliBili など)
  subType?: string // Twitch のサブスク種別(sub / resub / subgift / submysterygift など)
  bits?: string // Twitch のビッツ(数値の文字列)
  unit?: string // YouTube では非推奨。通貨記号
  currency?: string // YouTube の通貨コード(JPY / USD ...)
  giftType?: string | number // YouTube は文字列(jewel など)。TikTok / BiliBili は数値
}

export function platformFields(data: object): PlatformFields {
  return data as PlatformFields
}
