// src/types/OmikujiData/ui/UiSettingsSchema.ts
import { z } from 'zod'
import { stableUiSchemas } from './uiSchemas.stable'
import { experimentalUiSchemas } from './uiSchemas.experimental.ts'

const uiSchemas = {
  ...stableUiSchemas, // 安定版UI
  ...experimentalUiSchemas, // 未実装/実験用UI
} as const

/**
 * UI 種別(uiSchemas のキーから導出)
 */
export type UiKind = keyof typeof uiSchemas
export const uiKinds = Object.keys(uiSchemas) as [UiKind, ...UiKind[]]
export const UiKindSchema = z.enum(uiKinds)

export type StableUiKind = keyof typeof stableUiSchemas
export type ExperimentalUiKind = keyof typeof experimentalUiSchemas

/**
 * UI設定
 */
const UiSettingsShapeSchema = z.object(uiSchemas).partial()
export type UiSettingsType = z.infer<typeof UiSettingsShapeSchema>
export const UiSettingsSchema = UiSettingsShapeSchema.loose()
