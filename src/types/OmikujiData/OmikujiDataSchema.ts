// src/types/OmikujiData/OmikujiDataSchema.ts
import { z } from 'zod'
import { PlaceholderSchema } from './PlaceholderSchema'
import { CharacterSchema } from './CharacterSchema'
import { CommentEventSchema, ReactionEventSchema, ServiceEventSchema, TimerEventSchema } from './EventSchema'

import { JsonMergeSchema } from './JsonMergeType'
import { UiSchema } from './UiSchema'
import { FlagsSchema } from './FlagsSchema'
import { SettingsSchema } from './SettingsSchema'
import { normalizedRecord, normalizedObject, normalizedArray } from './ParsedDefault'
import { PackageJsonSchema } from '../core/MetaDataSchema'
import { OmikujiBoxSchema } from './OmikujiBoxSchema'
import { ActionSetSchema } from './ActionSet'

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
  flags: normalizedObject(FlagsSchema),
  jsonMerge: JsonMergeSchema.catch([]),
  settings: normalizedObject(SettingsSchema),
})
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>
