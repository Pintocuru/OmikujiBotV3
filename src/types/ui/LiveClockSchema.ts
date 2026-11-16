// src/types/ui/LiveClockSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../core'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'

/**
 * ライブクロック LiveClock
 */
// LiveClock のコンポーネントセット
export const clockComponentSets = {
  standard: ['morning', 'soundPlayer', 'clearGlass', 'steampunk', 'disco'],
} as const

export type ClockComponentSets = typeof clockComponentSets
export type ClockComponentSet = keyof ClockComponentSets

// セット別の ID 型
export type ClockComponentOf<S extends ClockComponentSet> = ClockComponentSets[S][number]

// 全 ID
export type ClockComponent = ClockComponentOf<ClockComponentSet>

export const LiveClockSchema = z.object({
  component: z.string().min(1).default('morning').catch('morning'), // 保存データは文字列(未同梱の ID も保持する。空文字は morning に戻す)
  color: normalizedObject(CharacterColorSchema, 'ui.LiveClock.color'), // キャラクター配色 (name / text / background / accent)
  isSecond: z.boolean().default(false).catch(false), // 秒数を入れるか
  isDate: z.boolean().default(false).catch(false), // 日付をいれるか
})
export type LiveClockType = z.infer<typeof LiveClockSchema>
