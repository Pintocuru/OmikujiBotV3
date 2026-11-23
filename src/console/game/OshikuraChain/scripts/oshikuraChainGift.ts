// src/console/game/OshikuraChain/scripts/oshikuraChainGift.ts
// ギフト効果の純粋関数 (金額 → 保護時間・冷却量・表示色)
import { GIFT_COOL_PRICE_UNIT, GIFT_PROTECT_TIERS } from './oshikuraChainConstants'

/** 金額に応じたワード保護秒数 */
export const giftProtectSecondsOf = (price: number): number => {
  for (const tier of GIFT_PROTECT_TIERS) {
    if (price >= tier.minPrice) return tier.seconds
  }
  return 0
}

/** 金額に応じた倍率引き下げ量 (1000円で ×1.0 低下) */
export const giftCoolAmountOf = (price: number): number => {
  return Math.max(0, price) / GIFT_COOL_PRICE_UNIT
}

/** 金額帯の色 (YouTube のスーパーチャットの色に合わせる) */
const COLOR_TIERS: readonly { minPrice: number; background: string; text: string }[] = [
  { minPrice: 0, background: '#1E88E5', text: '#ffffff' },
  { minPrice: 200, background: '#00B8D4', text: '#000000' },
  { minPrice: 500, background: '#1DE9B6', text: '#000000' },
  { minPrice: 1000, background: '#FFCA28', text: '#000000' },
  { minPrice: 2000, background: '#F57C00', text: '#ffffff' },
  { minPrice: 5000, background: '#E91E63', text: '#ffffff' },
  { minPrice: 10000, background: '#E62117', text: '#ffffff' },
]

export const giftColorOf = (price: number): { background: string; text: string } => {
  let color = COLOR_TIERS[0]
  for (const tier of COLOR_TIERS) if (price >= tier.minPrice) color = tier
  return { background: color.background, text: color.text }
}

/** ギフトの金額表示 */
export const formatGiftPrice = (price: number): string => `¥${Math.round(price).toLocaleString('ja-JP')}`
