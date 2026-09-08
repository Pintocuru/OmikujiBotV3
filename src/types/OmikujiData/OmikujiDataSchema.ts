// src/types/OmikujiData/OmikujiDataSchema.ts
import { z } from 'zod'
import { EventCategorySchema } from './events'
import { AssetCategorySchema } from './assets'
import { UiSchema } from './ui'
import { JsonMergeSchema } from './JsonMergeType'
import { FlagsSchema } from './FlagsSchema'
import { SettingsSchema } from './SettingsSchema'
import { normalizedObject } from './ParsedDefault'
import { PackageJsonSchema } from '../core'

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = PackageJsonSchema.extend({
  events: EventCategorySchema,
  assets: AssetCategorySchema,

  ui: normalizedObject(UiSchema),
  // TODO:廃止予定
  flags: normalizedObject(FlagsSchema),
  jsonMerge: JsonMergeSchema.catch([]),
  settings: normalizedObject(SettingsSchema),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
