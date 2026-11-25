// src/maps/OmikujiData/ui/UiKindMap.ts
import type { UiKind } from '@/types/OmikujiData'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

export const uiKindIcons: Record<UiKind, LucideIconName> = {
  characterStage: 'UserSquare',
  commentBubble: 'MessageSquare',
  gameRanking: 'Trophy',
  cookieCounter: 'Hash',
  deadAir: 'Bomb',
  flightSeat: 'Armchair',
  kujibikiPanel: 'Sparkles',
  labelMaker: 'Tags',
  liveClock: 'Clock',
  flashBanner: 'Megaphone',
  toastWidgets: 'Bell',
  userBoard: 'Users',
  userComment: 'MessagesSquare',
  lifeHourglass: 'Hourglass',
  liverBingo: 'LayoutGrid',
  luckyDraw: 'Gift',
  snipeTimer: 'Timer',
}
