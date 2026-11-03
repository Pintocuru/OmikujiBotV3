// packages/_shared/commentBubble.ts
import { registerLayout, registerUi } from '@/ui/uiRegistry'
import { registerStandardBubbleComponents } from '@/ui/CommentBubble/components/standard/register'

const commentBubbleLayout = () => import('@/layout/CommentBubble/CommentBubble.vue')

/**
 * レイアウトの登録
 * - UI(commentBubble)と、レイアウト(ui.layout: commentBubble)の両方に同じコンポーネントを登録する
 * - 表示コンポーネント(standard セット)も一緒に登録する
 */
export const registerCommentBubble = () => {
  registerUi({ commentBubble: commentBubbleLayout })
  registerLayout({ commentBubble: commentBubbleLayout })
  registerStandardBubbleComponents()
}
