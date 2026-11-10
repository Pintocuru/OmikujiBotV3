// src/ui/CommentBubble/components/messageBoard/register.ts
import type { BubbleComponentOf } from '@/types/ui'
import { registerCommentBubbleComponents, type CommentBubbleComponent } from '../../CommentBubbleRegistry'

/**
 * CommentBubble メッセージボードセット(常時表示)
 * ボードは常に表示し、コメントは板の上に並ぶ。ボードの形ごとにバリエーションを持つ
 */
const messageBoardComponents = {
  woodBoard: {
    labelKey: 'uiComponents.commentBubble.woodBoard.label',
    hasCharacter: true,
    loader: () => import('./WoodBoard.vue'),
  },
  chalkBoard: {
    labelKey: 'uiComponents.commentBubble.chalkBoard.label',
    hasCharacter: true,
    loader: () => import('./ChalkBoard.vue'),
  },
  rpgWindow: {
    labelKey: 'uiComponents.commentBubble.rpgWindow.label',
    hasCharacter: true,
    loader: () => import('./RpgWindow.vue'),
  },
} satisfies Record<BubbleComponentOf<'messageBoard'>, CommentBubbleComponent>

export const registerMessageBoardBubbleComponents = () =>
  registerCommentBubbleComponents({ messageBoard: messageBoardComponents })
