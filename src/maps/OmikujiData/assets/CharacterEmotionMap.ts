// src/maps/OmikujiData/assets/CharacterEmotionMap.ts
import type { CharacterEmotionType } from '@/types/OmikujiData'

/**
 * CharacterEmotion の感情キー一覧
 */
export const characterEmotionMap: Record<CharacterEmotionType, true> = {
  default: true,
  happy: true,
  surprised: true,
  sad: true,
  angry: true,
  thinking: true,
}
