// src/types/OmikujiData/ui/UiSettingsSchema.ts
import { z } from 'zod'
import { botUiSchemas, gameUiSchemas } from './schemas'

/** Public に残す UI 種別 */
export const knownUiKinds = [
  'characterStage',
  'commentBubble',
  'kujibikiPanel',
  'gameRanking',
] as const

export type KnownUiKind = (typeof knownUiKinds)[number]
export type UiKind = KnownUiKind | (string & {})
export const uiKinds = knownUiKinds
export const UiKindSchema = z.string()

/** Public に残す UI スキーマ */
const knownUiSchemas = {
  characterStage: botUiSchemas.characterStage,
  commentBubble: botUiSchemas.commentBubble,
  kujibikiPanel: botUiSchemas.kujibikiPanel,
  gameRanking: gameUiSchemas.gameRanking,
} as const

/** UI設定 (未知のキーは loose で通す) */
const UiSettingsShapeSchema = z.object(knownUiSchemas).partial()
export type UiSettingsType = z.infer<typeof UiSettingsShapeSchema> & Record<string, unknown>
export const UiSettingsSchema = UiSettingsShapeSchema.loose()
