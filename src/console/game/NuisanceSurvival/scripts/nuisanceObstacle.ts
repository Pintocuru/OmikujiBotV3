// src/console/game/NuisanceSurvival/scripts/nuisanceObstacle.ts
// ギフト障害物の純粋関数 (金額 → 大きさ・残る時間・色・表示)
import {
  OBSTACLE_SECONDS,
  OBSTACLE_SECONDS_FULL_PRICE,
  OBSTACLE_SECONDS_MAX,
  OBSTACLE_SIZE_TIERS,
} from './nuisanceConstants'

/** 金額から、障害物の一辺のマス数 (金額が大きいほど大きい) */
export const obstacleSizeOf = (price: number): number => {
  let size = OBSTACLE_SIZE_TIERS[0].size
  for (const tier of OBSTACLE_SIZE_TIERS) if (price >= tier.minPrice) size = tier.size
  return size
}

/** 金額から、障害物が残る時間 (秒)。金額に比例して伸び、上限がある */
export const obstacleSecondsOf = (price: number): number => {
  const ratio = Math.min(1, Math.max(0, price) / OBSTACLE_SECONDS_FULL_PRICE)
  return OBSTACLE_SECONDS + (OBSTACLE_SECONDS_MAX - OBSTACLE_SECONDS) * ratio
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

export const obstacleColorOf = (price: number): { background: string; text: string } => {
  let color = COLOR_TIERS[0]
  for (const tier of COLOR_TIERS) if (price >= tier.minPrice) color = tier
  return { background: color.background, text: color.text }
}

/** 障害物に表示する金額 */
export const formatObstaclePrice = (price: number): string => `¥${Math.round(price).toLocaleString('ja-JP')}`
