// src/maps/OmikujiData/ui/UiKindMap.ts
import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import type { UiKind } from '@/types/OmikujiData'

export const uiKindMap: Record<UiKind, { label: string; icon: LucideIconName; description: string }> = {
  commentBubble: {
    label: 'フキダシ',
    icon: 'MessageSquare',
    description: 'BOTの発言内容を吹き出し形式で表示します。',
  },
  gameRanking: {
    label: 'ゲームランキング',
    icon: 'Trophy',
    description: 'スイカゲーム等の結果をランキングボード形式で表示します。',
  },
}
