// src/types/OmikujiData/assets/ScenarioStepSchema.ts
import { z } from 'zod'
import { normalizedRecord } from '@/types/core/ParsedDefault'
import { WeightValuesArraySchema } from '@/types/OmikujiData/assets/PlaceholderSchema'
import { soundKeys } from '@/types/OmikujiData/assets/SoundKey'
import { UiKindSchema } from '@/types/OmikujiData/ui/UiSettingsSchema'

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
  delaySeconds: z.number().min(0).default(0).catch(0),
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
  characterKey: z.string().default('').catch(''), // 空文字はキャラなし
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
  scriptKey: z.string().default('').catch(''), // 実行するゲームスクリプトのキー(GameScriptKey)
  characterKey: z.string().default('').catch(''), // 空文字はキャラなし
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
 * 保存データ(assets.scenarios[*].steps)用のステップ: 実行時の ScenarioStepType に id を足したもの
 * - id は保存・編集の識別専用。実行時の steps(配列)や games が組み立てる ScenarioStepType には持たせない
 * - id が欠けていても除外しない(ScenarioStepRecordSchema が Record のキーで補う)
 */
export const ScenarioStepWithIdSchema = ScenarioStepSchema.and(z.object({ id: z.string().default('') }))
export type ScenarioStepWithIdType = z.infer<typeof ScenarioStepWithIdSchema>

/**
 * ScenarioStepRecord: Record<stepId, ScenarioStepType & { id }>
 * - 不正な要素だけ除外する(issues に記録)
 * - key と id が食い違う場合は key を正とする
 * - 表示・実行の順序は保存順に依存しない(sortedStepsFromRecord で delaySeconds 昇順にする)
 */
export const ScenarioStepRecordSchema = normalizedRecord(ScenarioStepWithIdSchema, 'assets.scenarios.steps').transform(
  (record): Record<string, ScenarioStepWithIdType> =>
    Object.fromEntries(
      Object.entries(record).map(([key, step]) => [key, step.id === key ? step : { ...step, id: key }])
    )
)
export type ScenarioStepRecordType = Record<string, ScenarioStepWithIdType>

/**
 * Record から delaySeconds 昇順の配列を取り出す
 * 同値の順序は Array.sort の安定性により、Record の挿入順を保つ
 */
export const sortedStepsFromRecord = (record: ScenarioStepRecordType): ScenarioStepWithIdType[] =>
  Object.values(record).sort((a, b) => a.delaySeconds - b.delaySeconds)

/**
 * id 付きステップの配列から Record を作る
 */
export const stepsToRecord = (steps: readonly ScenarioStepWithIdType[]): ScenarioStepRecordType =>
  Object.fromEntries(steps.map((step) => [step.id, step]))
