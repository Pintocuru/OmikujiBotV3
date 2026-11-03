// src/registerRuntime.ts
import { registerLayout, type UiLoader } from '@/ui/uiRegistry'
import type { UiLayoutType } from '@/types/OmikujiData'

// Layout
export const registerAllLayouts = () =>
  registerLayout({
    commentBubble: () => import('@/layout/CommentBubble/CommentBubble.vue'),
    gameRanking: () => import('@/layout/GameRanking/GameRanking.vue'),
    sesupinTest: () => import('@/layout/SesupinTest/SesupinTest.vue'),
  } satisfies Record<UiLayoutType, UiLoader>)
