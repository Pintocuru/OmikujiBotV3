// src/types/ui/counter/CookieCounterSchema.ts
import { z } from 'zod'

import { idSchema } from '../../core'
import { CharacterColorSchema } from '../../OmikujiData/assets/CharacterSchema'

/**
 * ライバーカウンター CookieCounter
 */

// CookieCounter のコンポーネントセット
export const cookieComponentSets = {
  standard: ['pixelBadge'],
  cookie: ['sakura', 'block3d'],
  mini: ['miniColumn', 'miniRow'],
} as const

export type CookieComponentSets = typeof cookieComponentSets
export type CookieComponentSet = keyof CookieComponentSets

// セット別の ID 型
export type CookieComponentOf<S extends CookieComponentSet> = CookieComponentSets[S][number]

// 全 ID
export type CookieComponent = CookieComponentOf<CookieComponentSet>

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

// カウントする対象
export const CookieCounterCountersSchema = z.discriminatedUnion('type', [
  z.object({
    id: idSchema,
    type: z.literal('default').default('default'),
    target: z.enum(streamDefaultKeyLabels).default('syoken'),
  }),
  z.object({
    id: idSchema,
    type: z.literal('variable').default('variable'),
    target: z.string(),
    label: z.string(),
  }),
])
export type CookieCounterCounter = z.infer<typeof CookieCounterCountersSchema>

// 表示するキャラクター(キャラクターと表情。アニメーションは表情のデータに従う)
export const CookieCounterCharacterSchema = z.object({
  characterKey: z.string().default('').catch(''),
  iconKey: z.string().default('default').catch('default'),
})
export type CookieCounterCharacterType = z.infer<typeof CookieCounterCharacterSchema>

const defaultColors = () => [CharacterColorSchema.parse({})]

export const CookieCounterSchema = z.object({
  component: z.string().min(1).default('sakura').catch('sakura'), // カウンタースタイル(保存データは文字列。未同梱の ID も保持する。空文字は sakura に戻す)
  color: z.array(CharacterColorSchema).min(1).max(8).default(defaultColors).catch(defaultColors), // カウンターの順に割り当てる配色(name / text / background / accent)。足りない分は先頭から繰り返す
  counters: z.array(CookieCounterCountersSchema).max(8).default([]), // 任意のカウンター
  characters: z.array(CookieCounterCharacterSchema).max(8).default([]), // 表示するキャラクター(何番目を何に使うかは component が決める)
})
export type CookieCounterType = z.infer<typeof CookieCounterSchema>
