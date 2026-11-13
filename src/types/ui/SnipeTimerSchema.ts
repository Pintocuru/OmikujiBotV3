// src/types/ui/SnipeTimerSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../core'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'
import { enterMotions } from '../OmikujiData/assets/EnterMotionSchema'

// SnipeTimer のコンポーネントセット
export const snipeTimerComponentSets = {
  standard: ['simpleWhite', 'simplePink'],
} as const

export type SnipeTimerComponentSets = typeof snipeTimerComponentSets
export type SnipeTimerComponentSet = keyof SnipeTimerComponentSets

// セット別の ID 型
export type SnipeTimerComponentOf<S extends SnipeTimerComponentSet> = SnipeTimerComponentSets[S][number]

// 全 ID
export type SnipeTimerComponent = SnipeTimerComponentOf<SnipeTimerComponentSet>

/** クリックで開始するときの秒数の範囲 */
export const SNIPE_TIMER_INITIAL_SECONDS = { min: 10, max: 300, default: 30 } as const

/** 秒数を丸める単位(クリックで開始するときの目標時刻をそろえる) */
export const SNIPE_TIMER_SECOND_ADJUSTS = [10, 15, 20, 30] as const

/**
 * スナイプタイマー SnipeTimer(実験枠。旧 NextTimer)
 * - component: 表示タイプ(保存データは文字列。未同梱の ID も保持する)
 * - color: 配色 (name / text / background / accent)
 * - animation: 登場・退場のアニメーション
 * - initialSeconds: クリックで開始するときの秒数
 * - secondAdjust: クリックで開始するとき、目標時刻の秒をこの単位に切り上げる
 * - alwaysVisible: true なら常に表示する(false はカウント中と終了後だけ表示)
 * - afterShowSeconds: 終了後に表示を続ける秒数(alwaysVisible=false のとき)
 */
export const SnipeTimerSchema = z.object({
  component: z.string().min(1).default('simpleWhite').catch('simpleWhite'),
  color: normalizedObject(CharacterColorSchema, 'ui.SnipeTimer.color'),
  animation: z.enum(enterMotions).default('fade').catch('fade'),
  initialSeconds: z
    .number()
    .int()
    .min(SNIPE_TIMER_INITIAL_SECONDS.min)
    .max(SNIPE_TIMER_INITIAL_SECONDS.max)
    .default(SNIPE_TIMER_INITIAL_SECONDS.default)
    .catch(SNIPE_TIMER_INITIAL_SECONDS.default),
  secondAdjust: z
    .union([z.literal(10), z.literal(15), z.literal(20), z.literal(30)])
    .default(10)
    .catch(10),
  alwaysVisible: z.boolean().default(false).catch(false),
  afterShowSeconds: z.number().min(0).max(60).default(5).catch(5),
})
export type SnipeTimerType = z.infer<typeof SnipeTimerSchema>
