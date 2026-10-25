// src/common/LucideIcon/DisplayMetaLucide.ts
import type { DisplayMeta } from '@/types/core'
import type { LucideIconName } from './useLucideIcon'

export type DisplayMetaLucide = DisplayMeta & {
  icon: LucideIconName
}
