// src/types/ui/CookieCounterSchema.ts
import { z } from 'zod'

import { idSchema, normalizedObject } from '../core'
import { streamDefaultKeyLabels } from './StreamCounterSchema'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'

/**
 * クッキーカウンター CookieCounter
 */

// CookieCounter のコンポーネントセット
export const cookieComponentSets = {
  standard: ['sakura', 'block3d'],
} as const

export type CookieComponentSets = typeof cookieComponentSets
export type CookieComponentSet = keyof CookieComponentSets

// セット別の ID 型
export type CookieComponentOf<S extends CookieComponentSet> = CookieComponentSets[S][number]

// 全 ID
export type CookieComponent = CookieComponentOf<CookieComponentSet>

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

//
export const CookieCounterImagesSchema = z.object({
  main: z.string().default(''),
  sub: z.string().default(''),
})

export const CookieCounterSchema = z.object({
  component: z.string().min(1).default('sakura').catch('sakura'), // カウンタースタイル(保存データは文字列。未同梱の ID も保持する。空文字は sakura に戻す)
  color: normalizedObject(CharacterColorSchema, 'ui.CookieCounter.color'),
  counters: z.array(CookieCounterCountersSchema).max(8).default([]), // 任意のカウンター
  images: normalizedObject(CookieCounterImagesSchema, 'ui.CookieCounter.images'),
})
export type CookieCounterType = z.infer<typeof CookieCounterSchema>
