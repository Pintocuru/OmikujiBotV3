// src/types/OmikujiData/JsonMergeType.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { normalizedArray } from '@/types/core/ParsedDefault'

export const JsonMergeRemapSchema = z.object({
  fromCharacterKey: z.string().default('').catch(''),
  toCharacterKey: z.string().default('').catch(''),
  fromIconKey: z.string().default('').catch(''),
  toIconKey: z.string().default('').catch(''),
})

export const JsonMergeItemSchema = BaseRecordSchema.extend({
  sourceFile: z.string().default('').catch(''),
  keySuffix: z.string().default('').catch(''),
  remaps: normalizedArray(JsonMergeRemapSchema, 'jsonMerge.remaps'),
})

// 不正な要素だけ除外して記録する(配列全体は消さない)
export const JsonMergeSchema = normalizedArray(JsonMergeItemSchema, 'jsonMerge')

export type JsonMergeType = z.infer<typeof JsonMergeSchema>
export type JsonMergeItemType = z.infer<typeof JsonMergeItemSchema>
export type JsonMergeRemapType = z.infer<typeof JsonMergeRemapSchema>
