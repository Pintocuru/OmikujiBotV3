// src/register/registerLayouts.ts
import { registerLayout, type UiLoader } from '@/ui/uiRegistry'
import type { UiLayoutType } from '@/types/OmikujiData'

// Layout
export const registerAllLayouts = () =>
  registerLayout({
    // common
    commentBubble: () => import('@/layout/common/CommentBubble/CommentBubble.vue'),
    gameRanking: () => import('@/layout/common/GameRanking/GameRanking.vue'),
    kujibikiPanel: () => import('@/layout/common/KujibikiPanel/KujibikiPanel.vue'),
  } satisfies Partial<Record<UiLayoutType, UiLoader>>)
