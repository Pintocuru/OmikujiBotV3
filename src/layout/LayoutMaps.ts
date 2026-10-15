// src/layout/LayoutMaps.ts
import { UiLayoutType } from '@/types/OmikujiData'

export const LAYOUT_LOADER: Record<UiLayoutType, () => Promise<any>> = {
  CommentBubble: () => import('./CommentBubble/CommentBubble.vue'),
}
