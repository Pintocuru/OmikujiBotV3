// src/types/OmikujiData/OmikujiDataSchema.ts
import { z } from 'zod'
import { EventCategorySchema } from './events'
import { AssetCategorySchema } from './assets'
import { UiSchema } from './ui'
import { JsonMergeSchema } from './JsonMergeType'
import { SettingsSchema } from './SettingsSchema'
import { normalizedObject } from '../core/ParsedDefault'
import { PackageJsonSchema } from '../core'

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = PackageJsonSchema.extend({
  events: normalizedObject(EventCategorySchema, 'events'),
  assets: normalizedObject(AssetCategorySchema, 'assets'),
  ui: normalizedObject(UiSchema, 'ui'),
  jsonMerge: JsonMergeSchema.catch([]),
  settings: normalizedObject(SettingsSchema, 'settings'),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
