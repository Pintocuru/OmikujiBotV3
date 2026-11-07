// src/types/OmikujiData/events/EventCategorySchema.ts
import { z } from 'zod'
import { normalizedArray } from '@/types/core/ParsedDefault'
import {
  CommentEventSchema,
  PadEventSchema,
  ReactionEventSchema,
  ServiceEventSchema,
  TimerEventSchema,
} from './EventSchema'

/**
 * eventCategory
 */
export const eventCategory = ['comments', 'timers', 'services', 'reactions', 'pads'] as const
export type EventCategoryType = (typeof eventCategory)[number]

// カテゴリごとのスキーマ(eventCategory に足し忘れ・書き忘れがあると型エラーになる)
export const EventCategorySchemaMap = {
  comments: CommentEventSchema,
  timers: TimerEventSchema,
  services: ServiceEventSchema,
  reactions: ReactionEventSchema,
  pads: PadEventSchema,
} as const satisfies Record<EventCategoryType, z.ZodType>

// カテゴリごとのイベント型(EventCategorySchemaMap から導出)
export type EventCategoryDataMap = {
  [K in EventCategoryType]: z.infer<(typeof EventCategorySchemaMap)[K]>
}

// イベントデータ全体(eventCategory と同じキーであることを型で保証する)
const eventCategoryShape = {
  comments: normalizedArray(CommentEventSchema, 'events.comments'),
  timers: normalizedArray(TimerEventSchema, 'events.timers'),
  services: normalizedArray(ServiceEventSchema, 'events.services'),
  reactions: normalizedArray(ReactionEventSchema, 'events.reactions'),
  pads: normalizedArray(PadEventSchema, 'events.pads'),
} satisfies Record<EventCategoryType, z.ZodType>

export const EventCategorySchema = z.object(eventCategoryShape)
export type OmikujiDataEventType = z.infer<typeof EventCategorySchema>
