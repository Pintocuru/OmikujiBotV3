// src/types/ui/bot/ToastWidgetsSchema.ts
import { z } from 'zod'

/**
 * トースト ToastWidgets
 */
// ToastWidgets のコンポーネントセット
export const toastComponentSets = {
  standard: ['standard', 'simple', 'card'],
} as const

export type ToastComponentSets = typeof toastComponentSets
export type ToastComponentSet = keyof ToastComponentSets

// セット別の ID 型
export type ToastComponentOf<S extends ToastComponentSet> = ToastComponentSets[S][number]

// 全 ID
export type ToastComponent = ToastComponentOf<ToastComponentSet>

// fallbackCharacter の特別値(空文字=補わない)。登録済みキャラのうち画像を持つ者からランダムに選ぶ
export const TOAST_CHARACTER_RANDOM = 'random'

export const ToastWidgetsSchema = z.object({
  component: z.string().min(1).default('standard').catch('standard'), // トーストのレイアウト(保存データは文字列。未同梱の ID も保持する。空文字は standard に戻す)
  showToastsOnRight: z.boolean().default(false).catch(false), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  fallbackCharacter: z.string().default('').catch(''), // メッセージにキャラが未指定のとき補うキャラ('' = 補わない / 'random' = ランダム / それ以外 = characterKey)
})
export type ToastWidgetsType = z.infer<typeof ToastWidgetsSchema>
