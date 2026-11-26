// src/console/game/WordAlchemy/scripts/drawItem.ts
// 分類・色 → アイテムの抽選 (純粋関数)。分類と色の両方に一致するものから、一様なランダムで選ぶ
import type { AlchemyCategory, AlchemyColor, Rng } from '../ai/alchemyTypes'
import type { ItemDefinition } from '../maps/WordAlchemyItemMap'

/** 両方に一致するアイテムがなければ null (抽選エラー。アイテムは生成しない)。1 種だけなら、抽選は発生しない (乱数も使わない) */
export const drawItem = (
  items: readonly ItemDefinition[],
  category: AlchemyCategory,
  color: AlchemyColor,
  rng: Rng = Math.random
): ItemDefinition | null => {
  const candidates = items.filter((item) => item.category === category && item.color === color)
  if (candidates.length <= 1) return candidates[0] ?? null
  return candidates[Math.min(candidates.length - 1, Math.floor(rng() * candidates.length))]
}
