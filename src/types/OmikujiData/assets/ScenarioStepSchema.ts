// src/types/OmikujiData/assets/PostFlowSchema.ts
import { z } from 'zod'
import { WeightValuesArraySchema } from './PlaceholderSchema'
import { soundKeys } from './SoundKey'
import { UiKindSchema } from '../ui/UiSettingsSchema'

/**
 * シナリオステップの kind
 */
export const scenarioStepKinds = ['message', 'sound', 'wordParty', 'variable', 'gameScript', 'scenarioCall'] as const
export const ScenarioStepKindSchema = z.enum(scenarioStepKinds).default('message').catch('message')
export type ScenarioStepKind = z.infer<typeof ScenarioStepKindSchema>

/**
 * シナリオステップ
 */
// シナリオステップ delaySeconds
const ScenarioStepBaseSchema = z.object({
  delaySeconds: z.number().default(0).catch(0),
})

// sound
const SoundMixin = {
  sound: z
    .union([z.enum(soundKeys), z.literal('')])
    .default('')
    .catch(''),
  soundPath: z.string().default('').catch(''),
}

// ScenarioStep Message
export const ScenarioStepMessageSchema = ScenarioStepBaseSchema.extend({
  kind: z.literal('message').default('message'),
  uiKey: UiKindSchema.default('commentBubble').catch('commentBubble'), // 表示先の UI
  slots: z.record(z.string(), z.string()).default({}).catch({}), // slotN の値 (UiMessageSpecs の map で意味が決まる)
  characterKey: z.string().nullable().default(null).catch(null),
  iconKey: z.string().default('default').catch('default'),
  ...SoundMixin,
  message: z.string().catch(''),
})
export type ScenarioStepMessageType = z.infer<typeof ScenarioStepMessageSchema>

// ScenarioStep sound
export const ScenarioStepSoundSchema = ScenarioStepBaseSchema.extend({
  kind: z.literal('sound'),
  ...SoundMixin,
})
export type ScenarioStepSoundType = z.infer<typeof ScenarioStepSoundSchema>

// ScenarioStep WordParty
export const ScenarioStepWordPartySchema = ScenarioStepBaseSchema.extend({
  kind: z.literal('wordParty'),
  wordPartyId: z.string().catch(''),
  repeat: z
    .union([z.number().int().min(1), z.enum(['viewer', 'upVote'])])
    .default(1)
    .catch(1),
})
export type ScenarioStepWordPartyType = z.infer<typeof ScenarioStepWordPartySchema>

// ScenarioStep Variable 評価ブロック
export const ScenarioStepVariableSchema = ScenarioStepBaseSchema.extend({
  kind: z.literal('variable'),
  message: z.string().catch(''),
})
export type ScenarioStepVariableType = z.infer<typeof ScenarioStepVariableSchema>

// ScenarioStep scenarioCall シナリオ
export const ScenarioStepCallSchema = ScenarioStepBaseSchema.extend({
  kind: z.literal('scenarioCall'),
  callKeys: WeightValuesArraySchema,
})
export type ScenarioStepCallType = z.infer<typeof ScenarioStepCallSchema>

// ScenarioStep gameScript
export const ScenarioStepGameScriptSchema = ScenarioStepBaseSchema.extend({
  kind: z.literal('gameScript'),
  scriptId: z.string().default('').catch(''),
  characterKey: z.string().default('').catch(''),
  queryString: z.string().default('').catch(''),
})
export type ScenarioStepGameScriptType = z.infer<typeof ScenarioStepGameScriptSchema>

/**
 * message プロパティを持つ ScenarioStep のユニオン型
 */
export type ScenarioStepWithMessageType = ScenarioStepMessageType | ScenarioStepVariableType

/**
 * 与えられた ScenarioStep が message プロパティを保持しているか判定する
 */
export const hasScenarioStepMessage = (flow: ScenarioStepType): flow is ScenarioStepWithMessageType => {
  return flow.kind === 'message' || flow.kind === 'variable'
}

// ScenarioStep わんコメ・BOTちゃんに投稿する型定義
export const ScenarioStepSchema = z.discriminatedUnion('kind', [
  ScenarioStepMessageSchema,
  ScenarioStepSoundSchema,
  ScenarioStepWordPartySchema,
  ScenarioStepVariableSchema,
  ScenarioStepCallSchema,
  ScenarioStepGameScriptSchema,
])
export type ScenarioStepType = z.infer<typeof ScenarioStepSchema>

/**
 * ScenarioStepArray わんコメ・BOTちゃんに投稿する型定義
 */
export const ScenarioStepArraySchema = z
  .array(ScenarioStepSchema)
  .default([])
  .catch([])
  .transform((actions) => {
    // delaySecondsが小さい順に並べ替え
    return actions.sort((a, b) => a.delaySeconds - b.delaySeconds)
  })
