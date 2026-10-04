// src/types/OmikujiData/assets/MikujiBoxSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { OmikujiItemSchema } from './OmikujiItemSchema'

/**
 * みくじ items
 */
export const MikujiItemsSchema = z.array(OmikujiItemSchema).default([]).catch([])
export type MikujiItemsType = z.infer<typeof MikujiItemsSchema>

/**
 * みくじ箱
 */
export const MikujiBoxSchema = BaseRecordSchema.extend({
  omikuji: MikujiItemsSchema,
})
export type MikujiBoxType = z.infer<typeof MikujiBoxSchema>
