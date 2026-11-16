// src/types/ui/LuckyDrawSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../core'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'
import { enterMotions } from '../OmikujiData/assets/EnterMotionSchema'

// LuckyDraw のコンポーネントセット
export const luckyDrawComponentSets = {
  standard: ['valentineCoupling', 'topStars'],
} as const

export type LuckyDrawComponentSets = typeof luckyDrawComponentSets
export type LuckyDrawComponentSet = keyof LuckyDrawComponentSets

// セット別の ID 型
export type LuckyDrawComponentOf<S extends LuckyDrawComponentSet> = LuckyDrawComponentSets[S][number]

// 全 ID
export type LuckyDrawComponent = LuckyDrawComponentOf<LuckyDrawComponentSet>

/** 当選人数の範囲 */
export const LUCKY_DRAW_COUNT = { min: 1, max: 10, default: 2 } as const

/** 表示秒数の範囲(0 は表示し続ける) */
export const LUCKY_DRAW_DISPLAY_SECONDS = { min: 0, max: 600, default: 30 } as const

/**
 * 抽選 LuckyDraw(実験枠。旧 WinnerGroup)
 * - component: 表示タイプ(保存データは文字列。未同梱の ID も保持する)
 * - color: 配色 (name / text / background / accent)
 * - animation: 登場・退場のアニメーション
 * - label: 見出し(空なら見出しなし)
 * - count: 当選人数(メッセージの slot で上書きできる)
 * - clearOnDraw: true なら、抽選のたびに参加者をリセットする
 * - displaySeconds: 抽選結果を表示する秒数(0 は表示し続ける)
 * - showHistory: 履歴ボタン(最新 10 件)を出すか
 */
export const LuckyDrawSchema = z.object({
  component: z.string().min(1).default('valentineCoupling').catch('valentineCoupling'),
  color: normalizedObject(CharacterColorSchema, 'ui.LuckyDraw.color'),
  animation: z.enum(enterMotions).default('fade').catch('fade'),
  label: z.string().default('').catch(''),
  count: z
    .number()
    .int()
    .min(LUCKY_DRAW_COUNT.min)
    .max(LUCKY_DRAW_COUNT.max)
    .default(LUCKY_DRAW_COUNT.default)
    .catch(LUCKY_DRAW_COUNT.default),
  clearOnDraw: z.boolean().default(true).catch(true),
  displaySeconds: z
    .number()
    .min(LUCKY_DRAW_DISPLAY_SECONDS.min)
    .max(LUCKY_DRAW_DISPLAY_SECONDS.max)
    .default(LUCKY_DRAW_DISPLAY_SECONDS.default)
    .catch(LUCKY_DRAW_DISPLAY_SECONDS.default),
  showHistory: z.boolean().default(true).catch(true),
})
export type LuckyDrawType = z.infer<typeof LuckyDrawSchema>
