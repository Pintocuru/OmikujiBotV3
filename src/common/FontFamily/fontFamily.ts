// src/common/FontFamily/fontFamily.ts
import { fontFamilyMap } from '@/maps/OmikujiData'
import { FontFamilyType } from '@/types/OmikujiData'

/**
 * フォントクラス名を返す。
 * googleFontsUrl が設定されている場合、未読み込みなら <link> を動的挿入する。
 */
const _loadedFonts = new Set<string>()

export const useFontFamily = (font?: FontFamilyType): string => {
  if (font === undefined) return ''
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
