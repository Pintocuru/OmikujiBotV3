// src/types/OmikujiData/CategoryType.ts
import { z } from 'zod'
import { assetCategory } from '@/types/OmikujiData/assets'
import type { AssetCategoryType } from '@/types/OmikujiData/assets'
import { eventCategory } from '@/types/OmikujiData/events'
import type { EventCategoryType } from '@/types/OmikujiData/events'

/**
 * settingsCategory
 */
export const settingsCategoryLabel = ['jsonMerge', 'ui', 'dataPacks', 'orphans', 'cooldown', 'appInfo'] as const
export type SettingsCategoryType = (typeof settingsCategoryLabel)[number]

/**
 * CategoryType
 */
export const categories = [...eventCategory, ...assetCategory, ...settingsCategoryLabel] as const

export const CategorySchema = z.enum(categories)
export type CategoryType = z.infer<typeof CategorySchema>

/**
 * DataCategoryType: 実データ（アイテム）を持つカテゴリ = Events + Assets
 */
export type DataCategoryType = EventCategoryType | AssetCategoryType
