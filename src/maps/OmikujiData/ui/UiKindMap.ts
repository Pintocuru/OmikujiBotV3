// src/maps/OmikujiData/ui/UiKindMap.ts
import type { UiKind } from '@/types/OmikujiData'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

export const uiKindIcons: Record<UiKind, LucideIconName> = {
  characterStage: 'UserSquare',
  commentBubble: 'MessageSquare',
  gameRanking: 'Trophy',
  cookieCounter: 'Cookie',
  deadAir: 'Bomb',
  flightSeat: 'Armchair',
  kujibikiPanel: 'Sparkles',
  labelMaker: 'Tags',
  liveClock: 'Clock',
  flashBanner: 'Megaphone',
  streamCounter: 'Hash',
  toastWidgets: 'Bell',
  userBoard: 'Users',
  lifeHourglass: 'Hourglass',
  liverBingo: 'LayoutGrid',
  snipeTimer: 'Timer',
}
