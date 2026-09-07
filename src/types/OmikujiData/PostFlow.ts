// src/types/OmikujiData/ActionSet.ts
import { z } from 'zod'
import { WeightValuesArraySchema } from './PlaceholderSchema'
import { soundKeys } from './SoundKey'

/**
 * PostFlow タイプのUI表示情報
 */
export const PostFlowKindMaps = {
  message: { label: 'メッセージ', icon: 'MessageSquare' },
  sound: { label: 'サウンド', icon: 'Volume2' },
  wordParty: { label: 'WordParty', icon: 'PartyPopper' },
  variable: { label: '評価ブロック', icon: 'Brackets' },
  bot: { label: 'BOTちゃん', icon: 'Bot' },
  flowCall: { label: 'アクションセット', icon: 'MessagesSquare' },
} as const

// アクションタイプの定義
export type PostFlowKind = keyof typeof PostFlowKindMaps

/**
 * PostFlow
 */
// PostFlow delaySeconds
const PostFlowBaseSchema = z.object({
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

// PostFlow Message
export const PostFlowMessageSchema = PostFlowBaseSchema.extend({
  kind: z.literal('message').default('message'),
  characterKey: z.string().nullable().default(null).catch(null),
  iconKey: z.string().default('default').catch('default'),
  ...SoundMixin,
  message: z.string().catch(''),
})
export type PostFlowMessageType = z.infer<typeof PostFlowMessageSchema>

// PostFlow sound
export const PostFlowSoundSchema = PostFlowBaseSchema.extend({
  kind: z.literal('sound').default('sound'),
  ...SoundMixin,
})
export type PostFlowSoundType = z.infer<typeof PostFlowSoundSchema>

// PostFlow WordParty
export const PostFlowWordPartySchema = PostFlowBaseSchema.extend({
  kind: z.literal('wordParty').default('wordParty'),
  wordPartyId: z.string().catch(''),
  repeat: z
    .union([z.number().int().min(1), z.enum(['viewer', 'upVote'])])
    .default(1)
    .catch(1),
})
export type PostFlowWordPartyType = z.infer<typeof PostFlowWordPartySchema>

// PostFlow Variable 評価ブロック
export const PostFlowVariableSchema = PostFlowBaseSchema.extend({
  kind: z.literal('variable').default('variable'),
  message: z.string().catch(''),
})
export type PostFlowVariableType = z.infer<typeof PostFlowVariableSchema>

// PostFlow bot BOTちゃん
export const PostFlowBotSchema = PostFlowBaseSchema.extend({
  kind: z.literal('bot').default('bot'),
  botName: z.string().default('').catch(''),
  message: z.string().catch(''),
})
export type PostFlowBotType = z.infer<typeof PostFlowBotSchema>

// PostFlow flowCall アクションセット
export const PostFlowCallSchema = PostFlowBaseSchema.extend({
  kind: z.literal('flowCall').default('flowCall'),
  callKeys: WeightValuesArraySchema,
})
export type PostFlowCallType = z.infer<typeof PostFlowCallSchema>

// PostFlow gameScript
export const PostFlowGameSchema = PostFlowBaseSchema.extend({
  kind: z.literal('gameScript'),
  scriptId: z.string().default('').catch(''),
  characterKey: z.string().default('').catch(''),
  queryString: z.string().default('').catch(''),
})
export type PostFlowGameType = z.infer<typeof PostFlowGameSchema>

/**
 * message プロパティを持つ PostFlow のユニオン型
 */
export type PostFlowWithMessageType = PostFlowMessageType | PostFlowVariableType | PostFlowBotType

/**
 * 与えられた PostFlow が message プロパティを保持しているか判定する
 */
export const hasPostFlowMessage = (flow: PostFlowType): flow is PostFlowWithMessageType => {
  return flow.kind === 'message' || flow.kind === 'variable' || flow.kind === 'bot'
}

// PostFlow わんコメ・BOTちゃんに投稿する型定義
export const PostFlowSchema = z.discriminatedUnion('kind', [
  PostFlowMessageSchema,
  PostFlowSoundSchema,
  PostFlowWordPartySchema,
  PostFlowVariableSchema,
  PostFlowBotSchema,
  PostFlowCallSchema,
  PostFlowGameSchema,
])
export type PostFlowType = z.infer<typeof PostFlowSchema>

/**
 * PostActionArray わんコメ・BOTちゃんに投稿する型定義
 */
export const PostFlowArraySchema = z
  .array(PostFlowSchema)
  .default([])
  .catch([])
  .transform((actions) => {
    // delaySecondsが小さい順に並べ替え
    return actions.sort((a, b) => a.delaySeconds - b.delaySeconds)
  })
