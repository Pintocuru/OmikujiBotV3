// src/console/game/WordAlchemy/scripts/drawItem.ts
// 分類・色 → アイテムの抽選 (純粋関数)。分類と色の両方に一致するものから、レアリティの重みで抽選する
import type { AlchemyCategory, AlchemyColor, Rng } from '../ai/alchemyTypes'
import { RARITY_WEIGHT, type ItemDefinition } from '../maps/WordAlchemyItemMap'

/** 両方に一致するアイテムがなければ null (抽選エラー。アイテムは生成しない)。1 種だけなら、抽選は発生しない */
export const drawItem = (
  items: readonly ItemDefinition[],
  category: AlchemyCategory,
  color: AlchemyColor,
  rng: Rng = Math.random
): ItemDefinition | null => {
  const candidates = items.filter((item) => item.category === category && item.color === color)
  if (candidates.length <= 1) return candidates[0] ?? null
  const total = candidates.reduce((sum, item) => sum + RARITY_WEIGHT[item.rarity], 0)
  let point = rng() * total
  for (const item of candidates) {
    point -= RARITY_WEIGHT[item.rarity]
    if (point < 0) return item
  }
  return candidates[candidates.length - 1]
}
