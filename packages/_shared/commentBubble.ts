// packages/_shared/commentBubble.ts
import { registerLayout, registerUi } from '@/ui/uiRegistry'

const commentBubbleLayout = () => import('@/layout/CommentBubble/CommentBubble.vue')

/**
 * レイアウトの登録
 * - UI(commentBubble)と、レイアウト(ui.layout: commentBubble)の両方に同じコンポーネントを登録する
 */
export const registerCommentBubble = () => {
  registerUi({ commentBubble: commentBubbleLayout })
  registerLayout({ commentBubble: commentBubbleLayout })
}
