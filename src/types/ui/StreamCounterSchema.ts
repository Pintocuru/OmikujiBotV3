// src/types/ui/StreamCounterSchema.ts
import { z } from 'zod'
import { daisyUIColor, themes, idSchema } from '../core'

/**
 * ライバーカウンターの選択肢(表示名は src/maps/ui/StreamCounterMap.ts)
 */
export interface StreamComponentConfig {
  label: string
  layout: 'horizontal' | 'vertical'
}
export const streamComponents = [
  'basicCirclePlain',
  'basicCircle',
  'pixelBadgePlain',
  'pixelBadge',
  'magicalStone',
  'starBurst',
  'hexGrid',
  'badge',
] as const
export type LiverComponent = (typeof streamComponents)[number]

export const labelStyles = ['lucide', 'emoji', 'text'] as const
export type LiverLabelStyle = (typeof labelStyles)[number]

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

export const StreamCounterSchema = z.object({
  component: z.enum(streamComponents).default('basicCircle').catch('basicCircle'), // カウンタースタイル
  color: z.enum(themes).default('lofi').catch('lofi'), // DaisyUiテーマ
  colorCycle: z
    .array(z.enum(daisyUIColor))
    .default(['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'])
    .catch([]), // 任意color
  labelStyle: z.enum(labelStyles).default('lucide').catch('lucide'), // ラベルスタイル
  defaultCounters: z
    .array(z.enum(streamDefaultKeyLabels))
    .default(['syoken', 'commenter', 'upVote', 'viewer'])
    .catch(['upVote']), // デフォルトカウンター（6種から選ぶ、順序なし）
  eventCounters: z.array(z.string()).max(16).default([]).catch([]), // event カウンター CommentRuleSchema.key
  variableCounters: z.array(StreamCounterVariablesSchema).default([]),
})
export type StreamCounterType = z.infer<typeof StreamCounterSchema>
