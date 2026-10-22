// src/types/generator/scripts/BotMessageBaseSchema.ts
import { OmikenCommentSchema } from '@/types/OmikenComment'
import { eventCategory } from '@/types/OmikujiData'
import { idSchema } from '@/types/core'
import { z } from 'zod'

/**
 * BotMessageBaseSchema
 * すべての BotMessage(comment / extra / ranking / empty)に共通する項目
 */
export const BotMessageBaseSchema = z.object({
  id: idSchema,
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
  source: z
    .object({
      category: z.enum(eventCategory).optional(),
      eventKey: z.string().optional(),
      omikujiKey: z.string().optional(),
    })
    .optional(),
  origin: OmikenCommentSchema.optional(),
})
export type BotMessageBaseType = z.infer<typeof BotMessageBaseSchema>
