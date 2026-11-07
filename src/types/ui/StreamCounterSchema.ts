// src/types/ui/StreamCounterSchema.ts
import { z } from 'zod'
import { idSchema } from '../core'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'

/**
 * StreamCounter のコンポーネントセット
 */
export const streamComponentSets = {
  standard: ['pixelBadge'],
} as const

export type StreamComponentSets = typeof streamComponentSets
export type StreamComponentSet = keyof StreamComponentSets

// セット別の ID 型
export type StreamComponentOf<S extends StreamComponentSet> = StreamComponentSets[S][number]

// 全 ID
export type StreamComponent = StreamComponentOf<StreamComponentSet>

export const streamDefaultKeyLabels = [
  'syoken',
  'commenter',
  'lc',
  'totalComments',
  'upVote',
  'viewer',
  'totalPrice',
  'follower',
  'reaction',
] as const
export type StreamDefaultKey = (typeof streamDefaultKeyLabels)[number]

export const StreamCounterVariablesSchema = z.object({
  id: idSchema,
  type: z.literal('variable').default('variable'),
  target: z.string(),
  label: z.string(),
})
export type StreamCounterVariable = z.infer<typeof StreamCounterVariablesSchema>

/**
 * ライバーカウンターv2 StreamCounter
 */

const defaultColors = () => [CharacterColorSchema.parse({})]

export const StreamCounterSchema = z.object({
  component: z.string().min(1).default('pixelBadge').catch('pixelBadge'), // 保存データは文字列(未同梱の ID も保持する。空文字は pixelBadge に戻す)
  color: z.array(CharacterColorSchema).min(1).max(8).default(defaultColors).catch(defaultColors), // カウンターの順に割り当てる配色(name / text / background / accent)。足りない分は先頭から繰り返す
  defaultCounters: z
    .array(z.enum(streamDefaultKeyLabels))
    .default(['syoken', 'commenter', 'upVote', 'viewer'])
    .catch(['upVote']), // デフォルトカウンター（6種から選ぶ、順序なし）
  variableCounters: z.array(StreamCounterVariablesSchema).default([]),
})
export type StreamCounterType = z.infer<typeof StreamCounterSchema>
