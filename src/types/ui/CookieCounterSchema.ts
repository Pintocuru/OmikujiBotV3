// src/types/ui/CookieCounterSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, normalizedObject } from '../OmikujiData'
import { idSchema } from '../core'
import { streamDefaultKeyLabels } from './StreamCounterSchema'

/**
 * ライブクロック LiveClock
 */

// カウンターの種類(表示名・設定は src/maps/ui/CookieCounterMap.ts)
export interface CookieComponentConfig {
  label: string
  maxCounters: number
  isColor: boolean
  hasImage: boolean
}
export const cookieComponents = ['sakura', 'block3d'] as const
export type CookieComponent = (typeof cookieComponents)[number]

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
  component: z.enum(cookieComponents).default('sakura').catch('sakura'), // カウンタースタイル
  color: normalizedObject(CharacterColorScheme),
  counters: z.array(CookieCounterCountersSchema).max(8).default([]), // 任意のカウンター
  images: normalizedObject(CookieCounterImagesSchema),
})
export type CookieCounterType = z.infer<typeof CookieCounterSchema>
