// src/types/OmikujiData/OmikujiSchema.ts
import { z } from 'zod'
import { OmikujiItemSchema } from './OmikujiItemSchema'
import { BaseRecordSchema } from '../../core/BaseSchema'

/**
 * みくじ箱 OmikujiBoxSchema
 */
export const OmikujiBoxSchema = BaseRecordSchema.extend({
  omikuji: z.array(OmikujiItemSchema).default([]).catch([]),
})
export type OmikujiBoxType = z.infer<typeof OmikujiBoxSchema>
