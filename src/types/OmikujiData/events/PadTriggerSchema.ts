// src/types/OmikujiData/events/PadTriggerSchema.ts
import { z } from 'zod'

/**
 * ポン出しボタンの識別子 (pad-1 〜 pad-16)
 * 2×2 / 3×3 / 4×4 のどの構成でも、左上から右へ、上から下へ pad-1, pad-2, … と振る
 */
export const padIds = [
  'pad-1',
  'pad-2',
  'pad-3',
  'pad-4',
  'pad-5',
  'pad-6',
  'pad-7',
  'pad-8',
  'pad-9',
  'pad-10',
  'pad-11',
  'pad-12',
  'pad-13',
  'pad-14',
  'pad-15',
  'pad-16',
] as const

export const PadIdSchema = z.enum(padIds)
export type PadIdType = z.infer<typeof PadIdSchema>

/**
 * ポン出しボタンの構成 (ボタンの個数)。4 = 2×2 / 9 = 3×3 / 16 = 4×4
 */
export const padLayouts = [4, 9, 16] as const
export type PadLayoutType = (typeof padLayouts)[number]

/** 構成ごとの 1辺のボタン数 */
export const padGridSize = { 4: 2, 9: 3, 16: 4 } as const satisfies Record<PadLayoutType, number>

/**
 * PadTrigger
 * ポン出しボタンが押されたとき、どのボタンに反応するか
 */
export const PadTriggerSchema = z.object({
  padId: PadIdSchema.default('pad-1').catch('pad-1'),
})
export type PadTriggerType = z.infer<typeof PadTriggerSchema>
