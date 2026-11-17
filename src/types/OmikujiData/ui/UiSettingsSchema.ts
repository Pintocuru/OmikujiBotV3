// src/types/OmikujiData/ui/UiSettingsSchema.ts
import { z } from 'zod'
import {
  botUiSchemas,
  commentUiSchemas,
  counterUiSchemas,
  gameUiSchemas,
  userUiSchemas,
} from './schemas'

/** UI 種別(カテゴリ別スキーマのキーから導出) */
const uiSchemas = {
  ...botUiSchemas,
  ...commentUiSchemas,
  ...counterUiSchemas,
  ...gameUiSchemas,
  ...userUiSchemas,
} as const

export type UiKind = keyof typeof uiSchemas
export const uiKinds = Object.keys(uiSchemas) as [UiKind, ...UiKind[]]
export const UiKindSchema = z.enum(uiKinds)

/** UI設定 */
const UiSettingsShapeSchema = z.object(uiSchemas).partial()
export type UiSettingsType = z.infer<typeof UiSettingsShapeSchema>
export const UiSettingsSchema = UiSettingsShapeSchema.loose()
