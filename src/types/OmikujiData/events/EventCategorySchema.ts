// src/types/OmikujiData/events/EventCategorySchema.ts
import { z } from 'zod'
import { normalizedArray } from '../../core/ParsedDefault'
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

export type EventCategoryDataMap = {
  comments: z.infer<typeof CommentEventSchema>
  timers: z.infer<typeof TimerEventSchema>
  services: z.infer<typeof ServiceEventSchema>
  reactions: z.infer<typeof ReactionEventSchema>
  pads: z.infer<typeof PadEventSchema>
}

export const EventCategorySchemaMap = {
  comments: CommentEventSchema,
  timers: TimerEventSchema,
  services: ServiceEventSchema,
  reactions: ReactionEventSchema,
  pads: PadEventSchema,
} as const

export const EventCategorySchema = z.object({
  comments: normalizedArray(CommentEventSchema, 'events.comments'),
  timers: normalizedArray(TimerEventSchema, 'events.timers'),
  services: normalizedArray(ServiceEventSchema, 'events.services'),
  reactions: normalizedArray(ReactionEventSchema, 'events.reactions'),
  pads: normalizedArray(PadEventSchema, 'events.pads'),
})
export type OmikujiDataEventType = z.infer<typeof EventCategorySchema>
