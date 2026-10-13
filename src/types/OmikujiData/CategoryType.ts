// src/types/OmikujiData/CategoryType.ts
import { z } from 'zod'
import { AssetCategoryType, assetCategory } from './assets'
import { EventCategoryType, eventCategory } from './events'

/**
 * settingsCategory
 */
export const settingsCategoryLabel = ['jsonMerge', 'ui', 'appInfo'] as const
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
