// src/types/OmikujiData/OmikujiDataSchema.ts
import { z } from 'zod'
import { PlaceholderSchema, CharacterSchema, OmikujiBoxSchema, ActionSetSchema } from './assets'
import { CommentEventSchema, ReactionEventSchema, ServiceEventSchema, TimerEventSchema } from './events'
import { UiSchema } from './ui'
import { JsonMergeSchema } from './JsonMergeType'
import { FlagsSchema } from './FlagsSchema'
import { SettingsSchema } from './SettingsSchema'
import { normalizedRecord, normalizedObject, normalizedArray } from './ParsedDefault'
import { PackageJsonSchema } from '../core/MetaDataSchema'
import { RecordCategoryType } from './CategoryType'

/**
 * assetCategory
 */
export const assetCategory = ['box', 'actions', 'placeholders', 'characters'] as const
export type AssetCategoryType = (typeof assetCategory)[number]

export type EventCategoryDataMap = {
  [K in EventCategoryType]: OmikujiDataEventType[K]
}

/**
 * eventCategory
 */
export const eventCategory = ['comments', 'timers', 'services', 'reactions'] as const
export type EventCategoryType = (typeof eventCategory)[number]

export type RecordCategoryDataMap = {
  [K in RecordCategoryType]: OmikujiDataAssetsType[K]
}

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataEventSchema = z.object({
  comments: normalizedArray(CommentEventSchema),
  timers: normalizedArray(TimerEventSchema),
  services: normalizedArray(ServiceEventSchema),
  reactions: normalizedArray(ReactionEventSchema),
  // queues: normalizedArray(QueueEventSchema),
})
export type OmikujiDataEventType = z.infer<typeof OmikujiDataEventSchema>

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataAssetsSchema = z.object({
  box: normalizedRecord(OmikujiBoxSchema),
  actions: normalizedRecord(ActionSetSchema),
  placeholders: normalizedRecord(PlaceholderSchema),
  characters: normalizedRecord(CharacterSchema),
})
export type OmikujiDataAssetsType = z.infer<typeof OmikujiDataAssetsSchema>

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = PackageJsonSchema.extend({
  events: OmikujiDataEventSchema,
  assets: OmikujiDataAssetsSchema,

  ui: normalizedObject(UiSchema),
  // TODO:廃止予定
  flags: normalizedObject(FlagsSchema),
  jsonMerge: JsonMergeSchema.catch([]),
  settings: normalizedObject(SettingsSchema),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
