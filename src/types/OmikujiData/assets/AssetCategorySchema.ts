// src/types/OmikujiData/assets/AssetCategorySchema.ts
import { z } from 'zod'
import { normalizedRecord } from '@/types/core/ParsedDefault'
import { ScenarioSchema } from './ScenarioSchema'
import { CharacterSchema } from './CharacterSchema'
import { MikujiBoxSchema } from './MikujiBoxSchema'
import { PlaceholderSchema } from './PlaceholderSchema'

/**
 * assetCategory
 */
export const assetCategory = ['mikuji', 'scenarios', 'placeholders', 'characters'] as const
export type AssetCategoryType = (typeof assetCategory)[number]

// カテゴリごとのスキーマ(assetCategory に足し忘れ・書き忘れがあると型エラーになる)
export const AssetCategorySchemaMap = {
  mikuji: MikujiBoxSchema,
  scenarios: ScenarioSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const satisfies Record<AssetCategoryType, z.ZodType>

// カテゴリごとのアセットアイテム型(AssetCategorySchemaMap から導出)
export type AssetCategoryDataMap = {
  [K in AssetCategoryType]: z.infer<(typeof AssetCategorySchemaMap)[K]>
}

// Asset データ全体(assetCategory と同じキーであることを型で保証する)
const assetCategoryShape = {
  mikuji: normalizedRecord(MikujiBoxSchema, 'assets.mikuji'),
  scenarios: normalizedRecord(ScenarioSchema, 'assets.scenarios'),
  placeholders: normalizedRecord(PlaceholderSchema, 'assets.placeholders'),
  characters: normalizedRecord(CharacterSchema, 'assets.characters'),
} satisfies Record<AssetCategoryType, z.ZodType>

export const AssetCategorySchema = z.object(assetCategoryShape)
export type OmikujiDataAssetsType = z.infer<typeof AssetCategorySchema>
