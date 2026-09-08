// src/types/OmikujiData/UiSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../ParsedDefault'
import { CommentBubbleSchema } from '../UiSettings/CommentBubbleSchema'
import { ToastWidgetsSchema } from '../UiSettings/ToastWidgetsSchema'
import { FlashBannerSchema } from '../UiSettings/FlashBannerSchema'
import { CommentSpinSchema } from '../UiSettings/CommentSpinSchema'
import { GameRankingSchema } from '../UiSettings/GameRankingSchema'
import { CounterPreviewSchema } from '../UiSettings/CounterPreviewSchema'
import { WinnerGroupSchema } from '../UiSettings/WinnerGroupSchema'
import { FlightSeatSchema } from '../UiSettings/FlightSeatSchema'
import { SocialRosterSchema } from '../UiSettings/SocialRosterSchema'
import { StreamCounterSchema } from '../UiSettings/StreamCounterSchema'
import { DeadAirSchema } from '../UiSettings/DeadAirSchema'
import { LiveClockSchema } from '../UiSettings/LiveClockSchema'
import { CookieCounterSchema } from '../UiSettings/CookieCounterSchema'
import { KujibikiPanelSchema } from '../UiSettings/KujibikiPanelSchema'
import { FontFamilySchema, FontFamilyType } from '../fontFamily'
import { UiLayoutSchema } from './UiLayoutSchema'
import { fontFamilyMap } from '@/maps/OmikujiData'

/**
 * フォントクラス名を返す。
 * googleFontsUrl が設定されている場合、未読み込みなら <link> を動的挿入する。
 * TODO:関数はここではない
 */
const _loadedFonts = new Set<string>()

export const useFontFamily = (font: FontFamilyType): string => {
  const entry = fontFamilyMap[font] ?? fontFamilyMap.default
  if (entry.googleFontsUrl && !_loadedFonts.has(font)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = entry.googleFontsUrl
    document.head.appendChild(link)
    _loadedFonts.add(font)
  }
  return entry.className ?? ''
}

export const UiSettingsSchema = z.object({
  bubble: CommentBubbleSchema.optional(),
  toast: ToastWidgetsSchema.optional(),
  liveClock: LiveClockSchema.optional(),
  ranking: GameRankingSchema.optional(),
  counter: CounterPreviewSchema.optional(),
  winnerGroup: WinnerGroupSchema.optional(),
  flightSeat: FlightSeatSchema.optional(),
  socialRoster: SocialRosterSchema.optional(),
  flashBanner: FlashBannerSchema.optional(),
  commentSpin: CommentSpinSchema.optional(),
  streamCounter: StreamCounterSchema.optional(),
  cookieCounter: CookieCounterSchema.optional(),
  deadAir: DeadAirSchema.optional(),
  kujibikiPanel: KujibikiPanelSchema.optional(),
})
export type UiSettingsType = z.infer<typeof UiSettingsSchema>

/**
 * ComponentsSchema
 */
export const UiSchema = z.object({
  layout: UiLayoutSchema,
  settings: normalizedObject(UiSettingsSchema),
  fontFamily: FontFamilySchema,
})
export type UiType = z.infer<typeof UiSchema>
