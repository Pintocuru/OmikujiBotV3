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

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = PackageJsonSchema.extend({
  // rules -> events
  events: z.object({
    comments: normalizedArray(CommentEventSchema),
    timers: normalizedArray(TimerEventSchema),
    services: normalizedArray(ServiceEventSchema),
    reactions: normalizedArray(ReactionEventSchema),
    // queues: normalizedArray(QueueEventSchema),
  }),

  assets: z.object({
    box: normalizedRecord(OmikujiBoxSchema),
    actions: normalizedRecord(ActionSetSchema),
    placeholders: normalizedRecord(PlaceholderSchema),
    characters: normalizedRecord(CharacterSchema),
  }),

  ui: normalizedObject(UiSchema),
  // TODO:廃止予定
  flags: normalizedObject(FlagsSchema),
  jsonMerge: JsonMergeSchema.catch([]),
  settings: normalizedObject(SettingsSchema),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
