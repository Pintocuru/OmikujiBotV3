// src/editor/maps/category/CategoryIconMap.ts
import type { CategoryType } from '@/types/OmikujiData'
import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

/**
 * カテゴリごとのアイコン
 * (エディター画面の import を持たない末端のマップ。画面から参照されるアイコンはここに置き、
 *  CategoryContentMap と画面の間で循環参照を作らない)
 */
export const categoryIconMap: Record<CategoryType, LucideIconName> = {
  jsonMerge: 'Layers',

  // events
  comments: 'MessageSquare',
  timers: 'Timer',
  services: 'ThumbsUp',
  reactions: 'Smile',
  pads: 'LayoutGrid',

  // assets
  mikuji: 'Package',
  scenarios: 'Zap',
  placeholders: 'Brackets',
  characters: 'Users',

  // UI
  ui: 'LayoutGrid',

  // settings
  dataPacks: 'Download',
  orphans: 'Search',
  cooldown: 'Timer',
  appInfo: 'Settings',
}
