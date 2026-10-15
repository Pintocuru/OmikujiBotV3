// packages/_shared/commentBubble.ts
import { registerUi } from '@/ui/uiRegistry'

export const registerCommentBubble = () =>
  registerUi({ commentBubble: () => import('@/ui/CommentBubble/generator/CommentBubble.vue') })
