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
  timestamp: z.number().default(() => Date.now()),
  delaySeconds: z.number().min(0).default(0).catch(0),
  origin: OmikenCommentSchema.optional(),
})
export type BotMessageBaseType = z.infer<typeof BotMessageBaseSchema>
