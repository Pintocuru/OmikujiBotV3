// src/types/OmikujiData/events/ReactionTriggerSchema.ts
import { z } from 'zod'

/**
 * YouTubeリアクションの種類
 */
export const youtubeReactionKeys = ['heart', 'smile', 'celebrate', 'surprise', 'praise'] as const

// スキーマと型
export const YoutubeReactionSchema = z.enum(youtubeReactionKeys)
export type YoutubeReactionType = z.infer<typeof YoutubeReactionSchema>

/**
 * リアクションマップ（プラットフォーム別）
 */
export const reactionKeys = youtubeReactionKeys
export type ReactionReaction = YoutubeReactionType

/**
 * ReactionTrigger
 * 現在はYoutubeのみを対象としている
 */
/**
 * 比較条件のUI表示情報（label + description）Reaction
 */
export const reactionConditions = ['milestone', 'burstSustain', 'equal', 'burstReach', 'burstDrop'] as const

// スキーマと型の定義
export const ReactionConditionSchema = z.enum(reactionConditions)
export type ReactionConditionType = z.infer<typeof ReactionConditionSchema>

/**
 * 条件タイプのラベル
 */
export const ReactionTriggerSchema = z.object({
  platform: z.enum(['youtube']).default('youtube'),
  reactions: z.array(z.enum(reactionKeys)).default([]), // 押された対象(配列、nullで対象なし)
  comparison: z.enum(reactionConditions).default('milestone').catch('milestone'), // 条件種別
  value: z.number().min(1).default(1).catch(1), // 閾値（burstSustain: n回ごと、等）
  triggerLevel: z.number().min(0).max(3).default(0).catch(0), // burstReach/burstSustain で使用: このレベル以上で有効
})
export type ReactionTriggerType = z.infer<typeof ReactionTriggerSchema>
