// src/registerAll.ts
import { registerUi, registerLayout } from '@/ui/uiRegistry'
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'
import { registerGameScript } from '@/games/gameScriptRegistry'

export const registerAll = () => {
  // UIの登録
  registerUi({
    commentBubble: () => import('@/ui/CommentBubble/generator/CommentBubble.vue'),
  })

  // エディターの登録
  registerUiEditor({
    commentBubble: () => import('@/ui/CommentBubble/editor/CommentBubbleEditor.vue'),
  })

  // レイアウトの登録
  registerLayout({
    commentBubble: () => import('@/layout/CommentBubble/CommentBubble.vue'),
  })

  // gameScriptの登録
  registerGameScript({
    GouseiSuika: () => import('@/games/scripts/GouseiSuika/execute'),
    BomberSpin: () => import('@/games/scripts/BomberSpin/execute'),
  })
}
