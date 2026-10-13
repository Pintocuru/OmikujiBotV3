// src/ui/types/CommentBubbleSchema.ts
import { z } from 'zod'
import { enterMotions } from '@/types/OmikujiData'

/**
 * フキダシ・キャラクター
 */
export const CommentBubbleSchema = z.object({
  character: z.string().catch(''), // キャラクター
  characterSize: z.number().default(48).catch(48), // キャラクターの横幅
  bubbleMotion: z.enum(enterMotions).default('slideUp').catch('slideUp'), // フキダシのアニメーション
})
export type CommentBubbleType = z.infer<typeof CommentBubbleSchema>
