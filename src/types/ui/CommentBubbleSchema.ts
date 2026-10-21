// src/ui/types/CommentBubbleSchema.ts
import { z } from 'zod'
import { enterMotions } from '@/types/OmikujiData/assets/EnterMotionSchema'

/**
 * フキダシ・キャラクター
 */
// ランキングコンポーネントの選択肢
export const bubbleComponentMap = {
  standard: {
    label: 'スタンダード',
  },
  smart: {
    label: 'スマート(シンプル)',
  },
} as const
const bubbleComponentsEnum = Object.keys(bubbleComponentMap) as BubbleComponent[]
export type BubbleComponent = keyof typeof bubbleComponentMap

export const CommentBubbleSchema = z.object({
  component: z.enum(bubbleComponentsEnum).default('standard').catch('standard'),
  persistentCharacter: z.string().catch(''), // 常時表示キャラ(空ならコメントが来るまで非表示)
  characterSize: z.number().default(128).catch(128), // キャラクターの横幅
  bubbleMotion: z.enum(enterMotions).default('slideUp').catch('slideUp'), // フキダシのアニメーション
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>
