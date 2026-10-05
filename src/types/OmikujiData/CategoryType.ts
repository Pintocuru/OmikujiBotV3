// src/types/OmikujiData/CategoryType.ts
import { z } from 'zod'
import { assetCategory } from './assets'
import { eventCategory } from './events'

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
