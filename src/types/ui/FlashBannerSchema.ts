// src/types/ui/FlashBannerSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../core'
import { CharacterColorSchema } from '../OmikujiData/assets/CharacterSchema'

/**
 * ニュースフラッシュ FlashBanner(実験枠。V2 の FlashBanner から移植)
 * - 本文(bubble)は 1 件ずつ表示する。コメントがないときは、slot0(FlashBannerSlotMap.defaultMessage)の文言を表示する
 */
// FlashBanner のコンポーネントセット
export const flashBannerComponentSets = {
  standard: ['standard', 'glass', 'clear', 'arcade', 'scroll', 'ticker'],
} as const

export type FlashBannerComponentSets = typeof flashBannerComponentSets
export type FlashBannerComponentSet = keyof FlashBannerComponentSets

// セット別の ID 型
export type FlashBannerComponentOf<S extends FlashBannerComponentSet> = FlashBannerComponentSets[S][number]

// 全 ID
export type FlashBannerComponent = FlashBannerComponentOf<FlashBannerComponentSet>

/** 長文スクロール終了後の戻り方 */
export const flashBannerReturnModes = ['loop', 'fade'] as const

export const FLASH_BANNER_ICON_SIZE = { min: 0, max: 60, default: 12 } as const
export const FLASH_BANNER_SCROLL_SPEED = { min: 10, max: 100, default: 50 } as const

/**
 * - component: 表示タイプ(保存データは文字列。未同梱の ID も保持する)
 * - color: 配色 (name / text / background / accent)。コメントのキャラがいないとき(slot0 の文言など)に使う。キャラがいるときはそのキャラの色
 * - label: 左(右)端のラベル。空なら表示しない
 * - iconSize: キャラアイコンの大きさ(0 で非表示)
 * - showItemOnRight: ラベル・アイコンを右側に置く
 * - scrollSpeed: 文字のスクロール速度 (px/sec)
 * - scrollReturnMode: 長文スクロール終了後の戻り方(往復型のタイプだけが使う)
 */
export const FlashBannerSchema = z.object({
  component: z.string().min(1).default('standard').catch('standard'),
  color: normalizedObject(CharacterColorSchema, 'ui.FlashBanner.color'),
  label: z.string().default('速報').catch('速報'),
  iconSize: z
    .number()
    .int()
    .min(FLASH_BANNER_ICON_SIZE.min)
    .max(FLASH_BANNER_ICON_SIZE.max)
    .default(FLASH_BANNER_ICON_SIZE.default)
    .catch(FLASH_BANNER_ICON_SIZE.default),
  showItemOnRight: z.boolean().default(false).catch(false),
  scrollSpeed: z
    .number()
    .min(FLASH_BANNER_SCROLL_SPEED.min)
    .max(FLASH_BANNER_SCROLL_SPEED.max)
    .default(FLASH_BANNER_SCROLL_SPEED.default)
    .catch(FLASH_BANNER_SCROLL_SPEED.default),
  scrollReturnMode: z.enum(flashBannerReturnModes).default('loop').catch('loop'),
})
export type FlashBannerType = z.infer<typeof FlashBannerSchema>
