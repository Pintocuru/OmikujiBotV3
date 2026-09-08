// src/types/OmikujiData/events/EventSchema.ts
import { z } from 'zod'
import { CommentTriggerSchema } from './CommentTriggerSchema'
import { ServiceTriggerSchema } from './ServiceTriggerSchema'
import { normalizedObject } from '../ParsedDefault'
import { ReactionTriggerSchema } from './ReactionTriggerSchema'
import { BaseRecordSchema } from '../../core/BaseSchema'

/**
 * おみくじ制限設定のスキーマ
 */
export const OmikujiLimitsSchema = z.object({
  // 重複制限
  cooldownSeconds: z.number().min(0).max(300).catch(3), // 処理クールダウン時間（秒）、0で無効
  cooldownMessage: z.string().nullish().default(null).catch(null),

  // 連投制限
  isRepeatAllowed: z.number().default(0).catch(0),
  repeatMessage: z.string().nullish().default(null).catch(null),
})
export type OmikujiLimitsType = z.infer<typeof OmikujiLimitsSchema>

/**
 * Events のカテゴリ定数セット
 */
export const eventCategoryLabel = ['comments', 'timers', 'metas', 'reactions'] as const
export type EventCategoryType = (typeof eventCategoryLabel)[number]

/**
 * Events 共通部分のスキーマ
 */
export const BaseEventSchema = BaseRecordSchema.extend({
  omikujiId: z.string().default('').catch(''),
})

/**
 * comments スキーマ
 */
export const CommentEventSchema = BaseEventSchema.extend({
  kind: z.literal('comments').default('comments'),
  trigger: normalizedObject(CommentTriggerSchema),
  limits: normalizedObject(OmikujiLimitsSchema),
})
export type CommentEventType = z.infer<typeof CommentEventSchema>

/**
 * timers スキーマ
 */
export const TimerEventSchema = BaseEventSchema.extend({
  kind: z.literal('timers').default('timers'), // イベントタイプ（タイマー）
  mode: z.enum(['interval', 'onStart']).default('interval'), // モード

  // 間隔時間（秒）
  intervalSeconds: z
    .number()
    .min(30)
    .max(60 * 60)
    .default(60 * 5)
    .catch(60 * 5),
  isBaseZero: z.boolean().default(false).catch(false), // 0時0分を基準にするか
})
export type TimerEventType = z.infer<typeof TimerEventSchema>

/**
 * Services(metas) スキーマ
 */
export const ServiceEventSchema = BaseEventSchema.extend({
  kind: z.literal('metas').default('metas'),
  trigger: normalizedObject(ServiceTriggerSchema),
})
export type ServiceEventType = z.infer<typeof ServiceEventSchema>

/**
 * reaction スキーマ
 */
export const ReactionEventSchema = BaseEventSchema.extend({
  kind: z.literal('reaction').default('reaction'),
  trigger: normalizedObject(ReactionTriggerSchema),
})
export type ReactionEventType = z.infer<typeof ReactionEventSchema>

/**
 * 型
 */
export type EventType = CommentEventType | TimerEventType | ServiceEventType | ReactionEventType
