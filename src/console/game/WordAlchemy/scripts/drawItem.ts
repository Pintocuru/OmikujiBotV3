// src/console/game/WordAlchemy/scripts/drawItem.ts
// 分類・色 → アイテムの抽選 (純粋関数)。分類で絞る → 色で絞る → 該当がなければ分類だけで、重み付きで抽選する
import type { AlchemyCategory, AlchemyColor, Rng } from '../ai/alchemyTypes'
import type { ItemDefinition } from '../maps/WordAlchemyItemMap'

/** 該当するアイテムがなければ null (その分類のアイテムが 1 つもない) */
export const drawItem = (
  items: readonly ItemDefinition[],
  category: AlchemyCategory,
  color: AlchemyColor,
  rng: Rng = Math.random
): ItemDefinition | null => {
  const inCategory = items.filter((item) => item.category === category && item.weight > 0)
  const sameColor = inCategory.filter((item) => item.color === color)
  const candidates = sameColor.length ? sameColor : inCategory
  const total = candidates.reduce((sum, item) => sum + item.weight, 0)
  if (total <= 0) return null
  let point = rng() * total
  for (const item of candidates) {
    point -= item.weight
    if (point < 0) return item
  }
  return candidates[candidates.length - 1]
}
