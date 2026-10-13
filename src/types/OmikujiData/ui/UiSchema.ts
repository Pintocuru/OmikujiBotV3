// src/types/OmikujiData/ui/UiSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../ParsedDefault'
import { FontFamilySchema, FontFamilyType } from '../fontFamily'
import { UiLayoutSchema } from './UiLayoutSchema'
import { fontFamilyMap } from '@/maps/OmikujiData'
import { UiSettingsSchema } from './UiSettingsSchema'

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

/**
 * UiSchema
 */
export const UiSchema = z.object({
  layout: UiLayoutSchema,
  settings: normalizedObject(UiSettingsSchema),
  fontFamily: FontFamilySchema,
})
export type UiType = z.infer<typeof UiSchema>
