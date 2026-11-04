// src/register/registerLayouts.ts
import { registerLayout, type UiLoader } from '@/ui/uiRegistry'
import type { UiLayoutType } from '@/types/OmikujiData'

// Layout
export const registerAllLayouts = () =>
  registerLayout({
    // common
    commentBubble: () => import('@/layout/CommentBubble/CommentBubble.vue'),
    gameRanking: () => import('@/layout/GameRanking/GameRanking.vue'),

    // 2026-Q4
    lifeHourglass: () => import('@/layout/2026-Q4/LifeHourglass/CommentBubble.vue'),

    // 管理者用
    sesupinTest: () => import('@/layout/SesupinTest/SesupinTest.vue'),
  } satisfies Record<UiLayoutType, UiLoader>)
