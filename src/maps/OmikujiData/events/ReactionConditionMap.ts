// src/maps/OmikujiData/events/ReactionConditionMap.ts
import type { ReactionConditionType } from '@/types/OmikujiData'

/**
 * リアクション比較条件のキー一覧
 */
export const reactionConditionMap: Record<ReactionConditionType, true> = {
  milestone: true,
  burstSustain: true,
  equal: true,
  burstReach: true,
  burstDrop: true,
}
