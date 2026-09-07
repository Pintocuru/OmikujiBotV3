//
import { z } from 'zod'

/**
 * CharacterEmotion 感情ラベル
 */
export const characterEmotions = ['default', 'happy', 'surprised', 'sad', 'angry', 'thinking'] as const

// スキーマと型の定義
export const CharacterEmotionSchema = z.enum(characterEmotions).default('default').catch('default')
export type CharacterEmotionType = z.infer<typeof CharacterEmotionSchema>

// Map定義
export const characterEmotionMap: Record<CharacterEmotionType, { label: string; description: string }> = {
  default: {
    label: 'デフォルト',
    description: '標準の表情',
  },
  happy: {
    label: '嬉しい',
    description: '喜んでいる表情',
  },
  surprised: {
    label: '驚き',
    description: '驚いている表情',
  },
  sad: {
    label: '悲しみ',
    description: '悲しんでいる表情',
  },
  angry: {
    label: '怒り',
    description: '怒っている表情',
  },
  thinking: {
    label: '考え中',
    description: '思案している表情',
  },
}
