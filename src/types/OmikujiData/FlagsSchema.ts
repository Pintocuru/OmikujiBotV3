// src/types/OmikujiData/FlagsSchema.ts
import { z } from 'zod'
import { normalizedObject } from './ParsedDefault'

/**
 * 通常表示設定
 */
export const FlagsUsageSchema = z.object({
  events: z.object({
    comments: z.boolean().default(true).catch(true),
    timers: z.boolean().default(true).catch(true),
    metas: z.boolean().default(true).catch(true),
    reactions: z.boolean().default(true).catch(true),
  }),
  assets: z.object({
    box: z.boolean().default(true).catch(true),
    actionSets: z.boolean().default(true).catch(true),
    placeholders: z.boolean().default(true).catch(true),
    characters: z.boolean().default(true).catch(true),
  }),
})
export type FlagsUsageType = z.infer<typeof FlagsUsageSchema>

/**
 * 管理者用表示設定 GOD MODE でのみ設定可能(通常は不可視)
 */
export const FlagsDeveloperSchema = z.object({
  // TODO:不要
  licenseVisible: z.boolean().default(true).catch(true),
  // TODO:これはDevのみ表示でよい
  jsonMergeSettings: z.boolean().default(true).catch(true),
  // TODO:不要
  itemSlotEnabled: z.boolean().default(true).catch(true),
})
export type FlagsDeveloperType = z.infer<typeof FlagsDeveloperSchema>

/**
 * FeatureUsageSchema
 * TODO:表示設定になるので settings に移動したい
 */
export const FlagsSchema = z.object({
  // TODO:events と assets をここへ入れたい
  usage: normalizedObject(FlagsUsageSchema),
  developer: normalizedObject(FlagsDeveloperSchema),
})

export type FlagsType = z.infer<typeof FlagsSchema>
