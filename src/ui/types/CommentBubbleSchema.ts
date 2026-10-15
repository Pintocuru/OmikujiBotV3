// src/ui/types/CommentBubbleSchema.ts
import { z } from 'zod'
import { enterMotions } from '@/types/OmikujiData'

/**
 * フキダシ・キャラクター
 */
export const CommentBubbleSchema = z.object({
  persistentCharacter: z.string().catch(''), // 常時表示キャラ(空ならコメントが来るまで非表示)
  characterSize: z.number().default(48).catch(48), // キャラクターの横幅
  bubbleMotion: z.enum(enterMotions).default('slideUp').catch('slideUp'), // フキダシのアニメーション
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>
