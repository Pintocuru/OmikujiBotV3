// src/types/OmikujiData/assets/AssetCategorySchema.ts
import { z } from 'zod'
import { normalizedRecord } from '../ParsedDefault'
import { ActionSetSchema } from './ActionSetSchema'
import { CharacterSchema } from './CharacterSchema'
import { MikujiBoxSchema } from './MikujiBoxSchema'
import { PlaceholderSchema } from './PlaceholderSchema'

/**
 * assetCategory
 */
export const assetCategory = ['box', 'actions', 'placeholders', 'characters'] as const
export type AssetCategoryType = (typeof assetCategory)[number]

// カテゴリごとのアセットアイテム型
export type AssetCategoryDataMap = {
  box: z.infer<typeof MikujiBoxSchema>
  actions: z.infer<typeof ActionSetSchema>
  placeholders: z.infer<typeof PlaceholderSchema>
  characters: z.infer<typeof CharacterSchema>
}

// カテゴリごとのスキーマ
export const AssetCategorySchemaMap = {
  box: MikujiBoxSchema,
  actions: ActionSetSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const

// Asset データ全体
export const AssetCategorySchema = z.object({
  box: normalizedRecord(MikujiBoxSchema),
  actions: normalizedRecord(ActionSetSchema),
  placeholders: normalizedRecord(PlaceholderSchema),
  characters: normalizedRecord(CharacterSchema),
})
export type OmikujiDataAssetsType = z.infer<typeof AssetCategorySchema>
