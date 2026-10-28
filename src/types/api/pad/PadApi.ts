// src/types/api/pad/PadApi.ts
import { z } from 'zod'
import { PadIdSchema } from '@/types/OmikujiData'

/**
 * trigger-pad: リクエスト
 * 押されたボタンの識別子。発火時刻はサーバが付ける (操作する側と受け取る側で時計がずれても、since で取りこぼさないため)
 */
export const PadTriggerRequestSchema = z.object({
  padId: PadIdSchema,
})
export type PadTriggerRequestType = z.infer<typeof PadTriggerRequestSchema>

/**
 * trigger-pad: レスポンス
 */
export const PadTriggerResponseSchema = z.object({
  padId: PadIdSchema,
  firedAt: z.number(),
})
export type PadTriggerResponseType = z.infer<typeof PadTriggerResponseSchema>

/**
 * load-pad-status: レスポンス
 * - hasNew: since より新しい発火があるか。since 未指定のときは常に false (受け取り側が lastSeen を決めるための問い合わせ)
 * - firedAt: サーバが保持している、最後の発火時刻 (まだ発火がなければ 0)。受け取り側はこれを次の since にする
 * - padId: hasNew のときだけ入る
 */
export const PadStatusResponseSchema = z.object({
  hasNew: z.boolean(),
  firedAt: z.number(),
  padId: PadIdSchema.nullable(),
})
export type PadStatusResponseType = z.infer<typeof PadStatusResponseSchema>
