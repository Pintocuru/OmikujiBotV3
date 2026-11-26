// src/console/game/WordAlchemy/scripts/potRules.ts
// 鍋の規則 (純粋関数): 煮込みに使う鍋の決定
import { POT_KEYS, potMap, type PotKey } from '../maps/WordAlchemyPotMap'

/**
 * 煮込みに使う鍋を決める。闇鍋は、闇鍋自身を除く全ての鍋から 1 つ引く (煮込みごとに 1 回。再試行では同じ鍋を使い続ける)。
 * そのほかの鍋は、そのまま
 */
export const resolveBrewPot = (pot: PotKey, rng: () => number = Math.random): PotKey => {
  if (!potMap[pot].random) return pot
  const candidates = POT_KEYS.filter((key) => !potMap[key].random)
  return candidates[Math.floor(rng() * candidates.length)]
}
