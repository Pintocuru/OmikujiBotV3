// src/types/ui/ToastWidgetsSchema.ts
import { z } from 'zod'

/**
 * トースト・サムネイル ToastWidgets
 */
// コンポーネントの選択肢(表示名は src/maps/ui/ToastWidgetsMap.ts)
export const toastComponents = ['standard', 'simple', 'card'] as const
export type ToastComponent = (typeof toastComponents)[number]

export const ToastWidgetsSchema = z.object({
  component: z.enum(toastComponents).default('standard').catch('standard'), // トーストのレイアウト
  showToastsOnRight: z.boolean().default(false).catch(false), // トースト・サムネイルを右側に表示するか(falseで左側)
  showToastsCharacter: z.boolean().default(false).catch(false), // トースト表示時、キャラクターを表示するか
  showThumbnail: z.array(z.string()).default([]).catch([]), // サムネイルとして表示したいキャラクターのkeyを並べる(新設)
})
export type ToastWidgetsType = z.infer<typeof ToastWidgetsSchema>
