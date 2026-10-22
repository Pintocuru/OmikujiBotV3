// src/maps/ui/CommentBubbleMap.ts
import type { BubbleComponent } from '@/types/ui'

/**
 * フキダシ・キャラクター CommentBubble
 */

export const bubbleComponentMap: Record<BubbleComponent, { label: string }> = {
  standard: {
    label: 'スタンダード',
  },
  smart: {
    label: 'スマート(シンプル)',
  },
}
