// src/registerAll.ts
import type { UiKind } from '@/types'
import { registerUi, registerLayout, type UiLoader } from '@/ui/uiRegistry'

const allUi: Record<UiKind, UiLoader> = {
  commentBubble: () => import('@/ui/CommentBubble/generator/CommentBubble.vue'),
}

const layoutFiles = import.meta.glob('/packages/**/layout/*.vue')

export const registerAll = () => {
  registerUi(allUi)
  registerLayout(
    Object.fromEntries(
      Object.entries(layoutFiles).map(([path, loader]) => [path.split('/').pop()!.replace('.vue', ''), loader])
    )
  )
}
