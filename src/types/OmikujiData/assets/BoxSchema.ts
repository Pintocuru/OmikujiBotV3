// src/types/OmikujiData/assets/BoxSchema.ts
import { z } from 'zod'
import { OmikujiItemSchema } from './OmikujiItemSchema'
import { BaseRecordSchema } from '../../core/BaseSchema'

/**
 * みくじ箱 OmikujiBoxSchema
 */
export const BoxSchema = BaseRecordSchema.extend({
  omikuji: z.array(OmikujiItemSchema).default([]).catch([]),
})
export type BoxType = z.infer<typeof BoxSchema>
