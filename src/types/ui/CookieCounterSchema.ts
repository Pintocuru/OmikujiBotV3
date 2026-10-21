// src/types/ui/CookieCounterSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, normalizedObject } from '@/types/OmikujiData'
import { idSchema } from '@/types/core'
import { streamDefaultKeyLabels } from './StreamCounterSchema'

/**
 * ライブクロック LiveClock
 */

// カウンターの種類
export const cookieComponentMap = {
  sakura: {
    label: 'さくらツイン🌸',
    maxCounters: 2,
    isColor: false,
    hasImage: true,
  },
  block3d: {
    label: 'ブロックツイン',
    maxCounters: 2,
    isColor: true,
    hasImage: false,
  },
} as const

export type CookieComponent = keyof typeof cookieComponentMap
export const cookieComponentsEnum = Object.keys(cookieComponentMap) as CookieComponent[]

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
  component: z.enum(cookieComponentsEnum).default('sakura').catch('sakura'), // カウンタースタイル
  color: normalizedObject(CharacterColorScheme),
  counters: z.array(CookieCounterCountersSchema).max(8).default([]), // 任意のカウンター
  images: normalizedObject(CookieCounterImagesSchema),
})
export type CookieCounterType = z.infer<typeof CookieCounterSchema>
