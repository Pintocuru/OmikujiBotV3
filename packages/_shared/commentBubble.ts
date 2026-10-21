// packages/_shared/commentBubble.ts
import { registerUi } from '@/ui/uiRegistry'

/**
 * レイアウトの登録
 */
export const registerCommentBubble = () =>
  registerUi({ commentBubble: () => import('@/layout/CommentBubble/CommentBubble.vue') })
