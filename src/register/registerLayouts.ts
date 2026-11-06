// src/register/registerLayouts.ts
import { registerLayout, type UiLoader } from '@/ui/uiRegistry'
import type { UiLayoutType } from '@/types/OmikujiData'

// Layout
export const registerAllLayouts = () =>
  registerLayout({
    // common
    commentBubble: () => import('@/layout/common/CommentBubble/CommentBubble.vue'),
    gameRanking: () => import('@/layout/common/GameRanking/GameRanking.vue'),

    // 2026-Q4
    lifeHourglass: () => import('@/layout/2026-Q4/LifeHourglass/LifeHourglass.vue'),

    // 管理者用
    sesupinTest: () => import('@/layout/common/SesupinTest/SesupinTest.vue'),
  } satisfies Record<UiLayoutType, UiLoader>)
