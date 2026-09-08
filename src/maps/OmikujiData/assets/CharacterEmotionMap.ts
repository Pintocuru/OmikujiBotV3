// src/maps/OmikujiData/assets/CharacterEmotionMap.ts
import { CharacterEmotionType } from '@/types/OmikujiData'

/**
 * CharacterEmotion ジェネレーター用画像設定
 */
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
