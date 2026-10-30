// src/common/LucideIcon/DisplayMetaLucide.ts
import type { DisplayMeta } from '@/types/core'
import type { LucideIconName } from './useLucideIcon'

// ! 廃止(i18n と造反するため)
export type DisplayMetaLucide = DisplayMeta & {
  icon: LucideIconName
}
