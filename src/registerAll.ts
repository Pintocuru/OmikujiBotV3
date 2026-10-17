// src/registerAll.ts
import { registerUi, registerLayout } from '@/ui/uiRegistry'
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'

const layoutFiles = import.meta.glob('/packages/**/layout/*.vue')

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
  registerLayout(
    Object.fromEntries(
      Object.entries(layoutFiles).map(([path, loader]) => [path.split('/').pop()!.replace('.vue', ''), loader])
    )
  )

  // TODO:gameScript もここで登録できるように
}
