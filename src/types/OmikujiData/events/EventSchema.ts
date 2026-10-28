// src/types/OmikujiData/events/EventSchema.ts
import { z } from 'zod'
import { CommentTriggerSchema } from './CommentTriggerSchema'
import { ServiceTriggerSchema } from './ServiceTriggerSchema'
import { normalizedObject } from '../../core/ParsedDefault'
import { ReactionTriggerSchema } from './ReactionTriggerSchema'
import { PadTriggerSchema } from './PadTriggerSchema'
import { BaseRecordSchema } from '@/types/core'

/**
 * Events 共通部分のスキーマ
 */
export const BaseEventSchema = BaseRecordSchema.extend({
  omikujiKey: z.string().default('').catch(''),
})
export type BaseEventType = z.infer<typeof BaseEventSchema>

/**
 * comments スキーマ
 */
export const CommentEventSchema = BaseEventSchema.extend({
  kind: z.literal('comments').default('comments'),
  trigger: normalizedObject(CommentTriggerSchema),
})
export type CommentEventType = z.infer<typeof CommentEventSchema>

/**
 * timers スキーマ
 */
export const TimerEventSchema = BaseEventSchema.extend({
  kind: z.literal('timers').default('timers'), // イベントタイプ（タイマー）
  // モード: interval=一定間隔 / onStart=開始時に1回 / range=ランジ(最短〜最長のランダム間隔)
  mode: z.enum(['interval', 'onStart', 'range']).default('interval'),

  // 間隔時間（秒）
  intervalSeconds: z
    .number()
    .min(30)
    .max(60 * 60)
    .default(60 * 5)
    .catch(60 * 5),
  isBaseZero: z.boolean().default(false).catch(false), // 0時0分を基準にするか (range では無視)

  // ランジ (mode === 'range' のとき使用)。0.5秒刻み、最大60秒
  // 大小関係 (min > max) はスキーマでは見ず、TimerProcessor 側で入れ替えて扱う
  rangeMinSeconds: z.number().min(1).max(60).multipleOf(0.5).default(5).catch(5),
  rangeMaxSeconds: z.number().min(1).max(60).multipleOf(0.5).default(60).catch(60),

  // 動作条件 (評価ブロック)。空なら条件なし = 常に動作。全モード共通
  expression: z.string().default('').catch(''),
})
export type TimerEventType = z.infer<typeof TimerEventSchema>

/**
 * Services スキーマ
 */
export const ServiceEventSchema = BaseEventSchema.extend({
  kind: z.literal('services').default('services'),
  trigger: normalizedObject(ServiceTriggerSchema),
})
export type ServiceEventType = z.infer<typeof ServiceEventSchema>

/**
 * reaction スキーマ
 */
export const ReactionEventSchema = BaseEventSchema.extend({
  // 旧データは 'reaction' (単数) だった。item が1つ不正だと配列ごと空になるため、catch で 'reactions' に直して読む
  kind: z.literal('reactions').default('reactions').catch('reactions'),
  trigger: normalizedObject(ReactionTriggerSchema),
})
export type ReactionEventType = z.infer<typeof ReactionEventSchema>

/**
 * pads スキーマ (ポン出し: LiveConsole のボタンが押されたとき)
 */
export const PadEventSchema = BaseEventSchema.extend({
  kind: z.literal('pads').default('pads'),
  trigger: normalizedObject(PadTriggerSchema),
})
export type PadEventType = z.infer<typeof PadEventSchema>

/**
 * 型
 */
export type EventType = CommentEventType | TimerEventType | ServiceEventType | ReactionEventType | PadEventType
