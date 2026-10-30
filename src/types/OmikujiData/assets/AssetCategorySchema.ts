// src/types/OmikujiData/assets/AssetCategorySchema.ts
import { z } from 'zod'
import { normalizedRecord } from '../../core/ParsedDefault'
import { ScenarioSchema } from './ScenarioSchema'
import { CharacterSchema } from './CharacterSchema'
import { MikujiBoxSchema } from './MikujiBoxSchema'
import { PlaceholderSchema } from './PlaceholderSchema'

/**
 * assetCategory
 */
export const assetCategory = ['mikuji', 'scenarios', 'placeholders', 'characters'] as const
export type AssetCategoryType = (typeof assetCategory)[number]

// カテゴリごとのアセットアイテム型
export type AssetCategoryDataMap = {
  mikuji: z.infer<typeof MikujiBoxSchema>
  scenarios: z.infer<typeof ScenarioSchema>
  placeholders: z.infer<typeof PlaceholderSchema>
  characters: z.infer<typeof CharacterSchema>
}

// カテゴリごとのスキーマ
export const AssetCategorySchemaMap = {
  mikuji: MikujiBoxSchema,
  scenarios: ScenarioSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const

// Asset データ全体
export const AssetCategorySchema = z.object({
  mikuji: normalizedRecord(MikujiBoxSchema, 'assets.mikuji'),
  scenarios: normalizedRecord(ScenarioSchema, 'assets.scenarios'),
  placeholders: normalizedRecord(PlaceholderSchema, 'assets.placeholders'),
  characters: normalizedRecord(CharacterSchema, 'assets.characters'),
})
export type OmikujiDataAssetsType = z.infer<typeof AssetCategorySchema>
