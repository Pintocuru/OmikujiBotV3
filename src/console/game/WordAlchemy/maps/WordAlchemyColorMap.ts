// src/console/game/WordAlchemy/maps/WordAlchemyColorMap.ts
// 色の名前 → 表示用の色 (画像のないアイテムを、色の四角で代用するときに使う)
import type { AlchemyColor } from '../ai/alchemyTypes'

export const colorCssMap: Readonly<Record<AlchemyColor, string>> = {
  赤: '#e5484d',
  橙: '#f5922b',
  黄: '#f2cc2f',
  緑: '#3fb950',
  青: '#3b82f6',
  紫: '#a855f7',
  白: '#f5f5f5',
  黒: '#2a2a2a',
}
