// src/ui/CommentBubble/components/standard/register.ts
import type { BubbleComponentOf } from '@/types/ui'
import { registerCommentBubbleComponents, type CommentBubbleComponent } from '../../CommentBubbleRegistry'

/**
 * CommentBubble 標準セット
 */
const standardComponents = {
  standard: { label: 'スタンダード', hasCharacter: true, loader: () => import('./Standard.vue') },
  smart: { label: 'スマート(シンプル)', hasCharacter: false, loader: () => import('./Smart.vue') },
} satisfies Record<BubbleComponentOf<'standard'>, CommentBubbleComponent>

export const registerStandardBubbleComponents = () => registerCommentBubbleComponents({ standard: standardComponents })
