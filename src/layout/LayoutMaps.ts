// src/layout/LayoutMaps.ts
import { UiLayoutType } from '@/types/OmikujiData'

export const LAYOUT_LOADER: Record<UiLayoutType, () => Promise<any>> = {
  commentBubble: () => import('./CommentBubble/CommentBubble.vue'),
  gameRanking: () => import('./GameRanking/GameRanking.vue'),
}
