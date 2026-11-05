// src/ui/CommentBubble/components/standard/register.ts
import type { BubbleComponentOf } from '@/types/ui'
import { registerCommentBubbleComponents, type CommentBubbleComponent } from '../../CommentBubbleRegistry'

/**
 * CommentBubble 標準セット
 * (キャラなしは standard で再現できる: persistentCharacter 未設定 + キャラ画像なし)
 */
const standardComponents = {
  standard: { label: 'スタンダード', hasCharacter: true, loader: () => import('./Standard.vue') },
  left: { label: 'レフト(キャラ左・吹き出し右)', hasCharacter: true, loader: () => import('./Left.vue') },
  right: { label: 'ライト(キャラ右・吹き出し左)', hasCharacter: true, loader: () => import('./Right.vue') },
} satisfies Record<BubbleComponentOf<'standard'>, CommentBubbleComponent>

export const registerStandardBubbleComponents = () => registerCommentBubbleComponents({ standard: standardComponents })
