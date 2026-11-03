// src/maps/OmikujiData/CategoryMap.ts
import { CategoryType } from '@/types/OmikujiData'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

// カテゴリのアイコン。
// ラベル・説明は i18n の categories.{category}.label|description を使う
// TODO: categoryMapIcons という名称のほうがいいのでは。
export const categoryMap: Record<CategoryType, { icon: LucideIconName }> = {
  jsonMerge: { icon: 'Layers' },
  comments: { icon: 'MessageSquare' },
  timers: { icon: 'Timer' },
  services: { icon: 'ThumbsUp' },
  reactions: { icon: 'Smile' },
  pads: { icon: 'LayoutGrid' },
  mikuji: { icon: 'Package' },
  scenarios: { icon: 'Zap' },
  placeholders: { icon: 'Brackets' },
  characters: { icon: 'Users' },
  ui: { icon: 'LayoutGrid' },
  dataPacks: { icon: 'Download' },
  orphans: { icon: 'Search' },
  cooldown: { icon: 'Timer' },
  appInfo: { icon: 'Settings' },
}
