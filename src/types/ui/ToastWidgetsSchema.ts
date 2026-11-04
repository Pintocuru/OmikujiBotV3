// src/types/ui/ToastWidgetsSchema.ts
import { z } from 'zod'

/**
 * トースト・サムネイル ToastWidgets
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

export const ToastWidgetsSchema = z.object({
  component: z.string().min(1).default('standard').catch('standard'), // トーストのレイアウト(保存データは文字列。未同梱の ID も保持する。空文字は standard に戻す)
  showToastsOnRight: z.boolean().default(false).catch(false), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type ToastWidgetsType = z.infer<typeof ToastWidgetsSchema>
