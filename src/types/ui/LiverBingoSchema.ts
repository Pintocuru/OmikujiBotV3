// src/types/ui/LiverBingoSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../core'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'

/** カードの一辺のマス数(3〜10) */
export const LIVER_BINGO_CARD_SIZES = [3, 4, 5, 6, 7, 8, 9, 10] as const
export type LiverBingoCardSize = (typeof LIVER_BINGO_CARD_SIZES)[number]

/** 数値表示の単位(目標値・進捗にこの値を掛けて表示する) */
export const LIVER_BINGO_UNITS = [1, 10, 100, 1000] as const
export type LiverBingoUnit = (typeof LIVER_BINGO_UNITS)[number]

/**
 * ビンゴのお題 1 件
 * - title: お題(空なら未設定として扱う)
 * - weight: ランダム項目での出現の重み(固定項目では使わない)
 * - target: 達成に必要な回数
 * - unit: 表示の単位(進捗 × unit を表示)
 */
export const LiverBingoItemSchema = z.object({
  title: z.string().default('').catch(''),
  weight: z.number().min(0).default(1).catch(1),
  target: z.number().min(0).default(1).catch(1),
  unit: z
    .union([z.literal(1), z.literal(10), z.literal(100), z.literal(1000)])
    .default(1)
    .catch(1),
})
export type LiverBingoItemType = z.infer<typeof LiverBingoItemSchema>

/**
 * 固定項目 1 件(お題 + マスの位置)
 * - row / col: マスの位置(0 始まり。左上が 0, 0)。カードサイズより外の位置は使われない
 */
export const LiverBingoSeedSchema = LiverBingoItemSchema.extend({
  row: z.number().int().min(0).default(0).catch(0),
  col: z.number().int().min(0).default(0).catch(0),
})
export type LiverBingoSeedType = z.infer<typeof LiverBingoSeedSchema>

/**
 * ライバービンゴ(実験枠)
 * - cardSize: カードの一辺のマス数
 * - color: 配色(name: ラインが成立したマスの文字 / text: マスの文字 / background: マスの地 / accent: 達成・進捗の色)
 * - seeds: 固定項目(位置を決めたお題。既定は空。固定されていないマスはランダム項目から選ばれる)
 * - randomSeeds: ランダム項目(固定されていないマスに、重み付きで割り当てる)
 */
export const LiverBingoSchema = z.object({
  cardSize: z
    .union([
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
      z.literal(7),
      z.literal(8),
      z.literal(9),
      z.literal(10),
    ])
    .default(3)
    .catch(3),
  color: normalizedObject(CharacterColorSchema, 'ui.LiverBingo.color'),
  seeds: z.array(LiverBingoSeedSchema).default([]).catch([]),
  randomSeeds: z.array(LiverBingoItemSchema).default([]).catch([]),
})
export type LiverBingoType = z.infer<typeof LiverBingoSchema>
