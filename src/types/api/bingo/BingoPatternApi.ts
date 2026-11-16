// src/types/api/bingo/BingoPatternApi.ts
import { z } from 'zod'
import {
  LiverBingoPatternIdSchema,
  LiverBingoPatternInfoSchema,
  LiverBingoPatternInputSchema,
  LiverBingoPatternSchema,
} from '@/types/ui'

/**
 * ライバービンゴの保存パターン (server/bingo-patterns/<id>.json) の API
 */

/** list-bingo-patterns: レスポンス(更新日時の新しい順) */
export const ListBingoPatternsResponseSchema = z.array(LiverBingoPatternInfoSchema)
export type ListBingoPatternsResponseType = z.infer<typeof ListBingoPatternsResponseSchema>

/** load-bingo-pattern: リクエスト(クエリ)・レスポンス */
export const LoadBingoPatternRequestSchema = z.object({ id: LiverBingoPatternIdSchema })
export const LoadBingoPatternResponseSchema = LiverBingoPatternSchema
export type LoadBingoPatternResponseType = z.infer<typeof LoadBingoPatternResponseSchema>

/** save-bingo-pattern: リクエスト(同じ id なら上書き) */
export const SaveBingoPatternRequestSchema = z.object({ pattern: LiverBingoPatternInputSchema })
export type SaveBingoPatternRequestType = z.infer<typeof SaveBingoPatternRequestSchema>

/** save-bingo-pattern: レスポンス(updatedAt はサーバーが付ける) */
export const SaveBingoPatternResponseSchema = z.object({ id: LiverBingoPatternIdSchema, updatedAt: z.number() })
export type SaveBingoPatternResponseType = z.infer<typeof SaveBingoPatternResponseSchema>
