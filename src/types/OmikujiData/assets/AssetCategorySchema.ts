//
import { z } from 'zod'
import { normalizedRecord } from '../ParsedDefault'
import { ActionSetSchema } from './ActionSet'
import { CharacterSchema } from './CharacterSchema'
import { OmikujiBoxSchema } from './OmikujiBoxSchema'
import { PlaceholderSchema } from './PlaceholderSchema'

/**
 * assetCategory
 */
export const assetCategory = ['box', 'actions', 'placeholders', 'characters'] as const
export type AssetCategoryType = (typeof assetCategory)[number]

export type AssetCategoryDataMap = {
  [K in AssetCategoryType]: OmikujiDataAssetsType[K]
}

export const AssetCategorySchemaMap = {
  box: OmikujiBoxSchema,
  actions: ActionSetSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const

export const AssetCategorySchema = z.object({
  box: normalizedRecord(OmikujiBoxSchema),
  actions: normalizedRecord(ActionSetSchema),
  placeholders: normalizedRecord(PlaceholderSchema),
  characters: normalizedRecord(CharacterSchema),
})
export type OmikujiDataAssetsType = z.infer<typeof AssetCategorySchema>
