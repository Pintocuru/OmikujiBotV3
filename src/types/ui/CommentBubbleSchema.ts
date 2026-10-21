// src/types/ui/CommentBubbleSchema.ts
import { z } from 'zod'
import { CharacterAnimationType, enterMotions } from '../OmikujiData'

// レイアウトに渡す「現在表示するキャラクター」
export type ShownCharacter = {
  key: string
  layers: string[]
  animation?: CharacterAnimationType
}

/**
 * フキダシ・キャラクター
 */
// コンポーネントの選択肢(表示名は src/maps/ui/CommentBubbleMap.ts)
export const bubbleComponents = ['standard', 'smart'] as const
export type BubbleComponent = (typeof bubbleComponents)[number]

export const CommentBubbleSchema = z.object({
  component: z.enum(bubbleComponents).default('standard').catch('standard'),
  persistentCharacter: z.string().catch(''), // 常時表示キャラ(空ならコメントが来るまで非表示)
  characterSize: z.number().default(128).catch(128), // キャラクターの横幅
  bubbleMotion: z.enum(enterMotions).default('slideUp').catch('slideUp'), // フキダシのアニメーション
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>
