// src/ui/CommentBubble/components/bubble/register.ts
import type { BubbleComponentOf } from '@/types/ui'
import { registerCommentBubbleComponents, type CommentBubbleComponent } from '../../CommentBubbleRegistry'

/**
 * CommentBubble フキダシセット
 * (キャラなしは standard で再現できる: persistentCharacter 未設定 + キャラ画像なし)
 */
const bubbleComponents = {
  standard: {
    labelKey: 'uiComponents.commentBubble.standard.label',
    hasCharacter: true,
    loader: () => import('./Standard.vue'),
  },
  left: { labelKey: 'uiComponents.commentBubble.left.label', hasCharacter: true, loader: () => import('./Left.vue') },
  right: {
    labelKey: 'uiComponents.commentBubble.right.label',
    hasCharacter: true,
    loader: () => import('./Right.vue'),
  },
} satisfies Record<BubbleComponentOf<'bubble'>, CommentBubbleComponent>

export const registerBubbleBubbleComponents = () => registerCommentBubbleComponents({ bubble: bubbleComponents })
