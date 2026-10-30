// src/types/OmikujiData/assets/MikujiBoxSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { normalizedArray } from '@/types/core/ParsedDefault'
import { OmikujiItemSchema } from './OmikujiItemSchema'

/**
 * みくじ items
 */
export const MikujiItemsSchema = normalizedArray(OmikujiItemSchema, 'assets.mikuji.items')
export type MikujiItemsType = z.infer<typeof MikujiItemsSchema>

/**
 * みくじ箱
 */
export const MikujiBoxSchema = BaseRecordSchema.extend({
  omikuji: MikujiItemsSchema,
})
export type MikujiBoxType = z.infer<typeof MikujiBoxSchema>
