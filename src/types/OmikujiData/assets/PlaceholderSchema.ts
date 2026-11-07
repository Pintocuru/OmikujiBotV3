// src/types/OmikujiData/assets/PlaceholderSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { normalizedArray } from '@/types/core/ParsedDefault'

/**
 * WeightValueSchema: 重み付きのコンテンツオブジェクト
 */
export const WeightValueSchema = z.object({
  weight: z.number().min(0).default(1).catch(1),
  content: z.string().default('').catch(''),
})
export type WeightValueType = z.infer<typeof WeightValueSchema>

/**
 * WeightValuesArraySchema: 配列の要素を処理
 * - weight が 1 のオブジェクトは string(content)に畳む(保存サイズを小さくするため)
 * - 不正な要素だけ除外して記録する(配列全体は消さない)
 * - 値が無いとき(undefined)は、空の1件から始める
 */
export const WeightValuesArraySchema = normalizedArray(
  z.union([WeightValueSchema, z.string()]).transform((value) => {
    // WeightValueSchema を通ったオブジェクトは weight / content だけを持つ
    if (typeof value === 'object' && value.weight === 1) return value.content
    return value
  }),
  'assets.weightValues'
).default(() => [WeightValueSchema.parse({})])
export type WeightValuesArrayType = z.infer<typeof WeightValuesArraySchema>

/**
 * PlaceholderSchema
 */
export const PlaceholderSchema = BaseRecordSchema.extend({
  values: WeightValuesArraySchema,
})
export type PlaceholderType = z.infer<typeof PlaceholderSchema>

/**
 * PlaceholderValueType に修正する関数
 */
export function handleNormalizedValues(values: WeightValuesArrayType): WeightValueType[] {
  return values.map((item) => {
    if (typeof item === 'string') return { content: item, weight: 1 }
    else return item
  })
}
