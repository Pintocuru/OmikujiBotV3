// packages/_shared/commentBubbleEditor.ts
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'

export const registerCommentBubbleEditor = () =>
  registerUiEditor({ commentBubble: () => import('@/ui/bot/CommentBubble/editor/CommentBubbleEditor.vue') })
