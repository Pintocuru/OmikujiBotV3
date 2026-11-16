// src/types/ui/LiverBingoPatternSchema.ts
import { z } from 'zod'
import { LiverBingoItemSchema, LiverBingoSchema, LiverBingoSeedSchema } from './LiverBingoSchema'

/**
 * ライバービンゴの保存パターン(名前を付けて残しておく、カードの設定のセット)
 * 保存するのは、カードサイズ・固定項目・ランダム項目だけ(配色は含めない)
 * 保存先は、サーバーに接続しているときはサーバー、していないときはこのブラウザ(localStorage)
 */

/** パターンの ID(ファイル名に使うので、英数字・_・- だけ) */
export const LiverBingoPatternIdSchema = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/)
export type LiverBingoPatternIdType = z.infer<typeof LiverBingoPatternIdSchema>

/** 固定項目・ランダム項目の最大数(保存データが際限なく大きくならないための上限) */
export const LIVER_BINGO_PATTERN_MAX_SEEDS = 100
export const LIVER_BINGO_PATTERN_MAX_RANDOM_SEEDS = 1000

/** パターンの中身(LiverBingoSchema から、保存する項目だけ) */
export const LiverBingoPatternContentSchema = z.object({
  cardSize: LiverBingoSchema.shape.cardSize,
  seeds: z.array(LiverBingoSeedSchema).max(LIVER_BINGO_PATTERN_MAX_SEEDS),
  randomSeeds: z.array(LiverBingoItemSchema).max(LIVER_BINGO_PATTERN_MAX_RANDOM_SEEDS),
})
export type LiverBingoPatternContentType = z.infer<typeof LiverBingoPatternContentSchema>

/** 保存するパターン(updatedAt は保存先が付ける) */
export const LiverBingoPatternInputSchema = LiverBingoPatternContentSchema.extend({
  id: LiverBingoPatternIdSchema,
  name: z.string().trim().min(1).max(100),
})
export type LiverBingoPatternInputType = z.infer<typeof LiverBingoPatternInputSchema>

/** 保存済みのパターン */
export const LiverBingoPatternSchema = LiverBingoPatternInputSchema.extend({
  updatedAt: z.number(),
})
export type LiverBingoPatternType = z.infer<typeof LiverBingoPatternSchema>

/** 一覧用の要約(中身を読み込まずに、選ぶための情報) */
export const LiverBingoPatternInfoSchema = z.object({
  id: LiverBingoPatternIdSchema,
  name: z.string(),
  updatedAt: z.number(),
  cardSize: z.number(),
  fixedCount: z.number(),
  randomCount: z.number(),
})
export type LiverBingoPatternInfoType = z.infer<typeof LiverBingoPatternInfoSchema>

/** 保存済みのパターンから、一覧用の要約を作る */
export const toLiverBingoPatternInfo = (pattern: LiverBingoPatternType): LiverBingoPatternInfoType => ({
  id: pattern.id,
  name: pattern.name,
  updatedAt: pattern.updatedAt,
  cardSize: pattern.cardSize,
  fixedCount: pattern.seeds.length,
  randomCount: pattern.randomSeeds.length,
})
