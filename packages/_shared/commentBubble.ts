// packages/_shared/commentBubble.ts
import { registerLayout, registerUi } from '@/ui/uiRegistry'
import { registerBubbleBubbleComponents } from '@/ui/CommentBubble/components/bubble/register'
import { registerMessageBoardBubbleComponents } from '@/ui/CommentBubble/components/messageBoard/register'

const commentBubbleLayout = () => import('@/layout/common/CommentBubble/CommentBubble.vue')

/**
 * レイアウトの登録
 * - UI(commentBubble)と、レイアウト(ui.layout: commentBubble)の両方に同じコンポーネントを登録する
 * - 表示コンポーネント(bubble / messageBoard セット)も一緒に登録する
 */
export const registerCommentBubble = () => {
  registerUi({ commentBubble: commentBubbleLayout })
  registerLayout({ commentBubble: commentBubbleLayout })
  registerBubbleBubbleComponents()
  registerMessageBoardBubbleComponents()
}
