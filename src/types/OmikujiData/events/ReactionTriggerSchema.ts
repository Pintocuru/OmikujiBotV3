// src/types/OmikujiData/events/ReactionTriggerSchema.ts
import { z } from 'zod'
import { normalizedArray } from '@/types/core/ParsedDefault'

/**
 * YouTubeリアクションの種類
 */
export const youtubeReactionKeys = ['heart', 'smile', 'celebrate', 'surprise', 'praise'] as const

// スキーマと型
export const YoutubeReactionSchema = z.enum(youtubeReactionKeys)
export type YoutubeReactionType = z.infer<typeof YoutubeReactionSchema>

/**
 * リアクションのキー(現在は YouTube のみ。プラットフォームが増えたらここで束ねる)
 */
export const reactionKeys = youtubeReactionKeys
export type ReactionKeyType = YoutubeReactionType

/**
 * 比較条件の種類(Reaction)
 */
export const reactionConditions = ['milestone', 'burstSustain', 'equal', 'burstReach', 'burstDrop'] as const

// スキーマと型の定義
export const ReactionConditionSchema = z.enum(reactionConditions)
export type ReactionConditionType = z.infer<typeof ReactionConditionSchema>

/**
 * ReactionTrigger
 * 現在はYoutubeのみを対象としている
 */
export const ReactionTriggerSchema = z.object({
  platform: z.enum(['youtube']).default('youtube'),
  reactions: normalizedArray(YoutubeReactionSchema, 'events.reactions.trigger.reactions'), // 押された対象(空配列は対象なし)
  comparison: ReactionConditionSchema.default('milestone').catch('milestone'), // 条件種別
  value: z.number().int().min(0).default(1).catch(1), // 閾値（burstSustain: 0/1は毎回発火、等）
  triggerLevel: z.number().int().min(0).max(3).default(0).catch(0), // burstReach/burstSustain で使用: このレベル以上で有効
})
export type ReactionTriggerType = z.infer<typeof ReactionTriggerSchema>
