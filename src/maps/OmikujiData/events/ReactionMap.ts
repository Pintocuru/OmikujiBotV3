// src/maps/OmikujiData/events/ReactionMap.ts
import { YoutubeReactionType } from '@/types/OmikujiData'

/**
 * リアクションマップ（プラットフォーム別）
 * platform: ReactionTriggerSchema の z.enum(['youtube'])
 * キー: reactionKeys（youtubeReactionKeys と同一）
 */
export const reactionMap: Record<'youtube', Record<YoutubeReactionType, string>> = {
  youtube: {
    heart: '🧡',
    smile: '😄',
    celebrate: '🎉',
    surprise: '😳',
    praise: '💯',
  },
}
