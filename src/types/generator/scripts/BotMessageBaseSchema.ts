// src/types/generator/scripts/BotMessageBaseSchema.ts
import { OmikenCommentSchema } from '@/types/OmikenComment'
import { idSchema } from '@/types/core'
import { z } from 'zod'

/**
 * BotMessageBaseSchema
 * すべての BotMessage に共通する項目
 */
export const BotMessageBaseSchema = z.object({
  id: idSchema,
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
  origin: OmikenCommentSchema.optional(),
})
export type BotMessageBaseType = z.infer<typeof BotMessageBaseSchema>
