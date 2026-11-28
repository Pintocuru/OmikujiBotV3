// src/maps/OmikujiData/ui/UiKindMap.ts
import type { UiKind } from '@/types/OmikujiData'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

export const uiKindIcons: Partial<Record<UiKind, LucideIconName>> = {
  characterStage: 'UserSquare',
  commentBubble: 'MessageSquare',
  gameRanking: 'Trophy',
  kujibikiPanel: 'Sparkles',
}

export const registerUiKindIcons = (icons: Partial<Record<UiKind, LucideIconName>>) => Object.assign(uiKindIcons, icons)
