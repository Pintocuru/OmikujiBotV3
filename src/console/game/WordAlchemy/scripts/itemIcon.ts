// src/console/game/WordAlchemy/scripts/itemIcon.ts
// アイテムのアイコン (DiceBear の HTTP API の URL)。分類でスタイルを変え、名前を種にして、完成品の色 (k) を当てはめる。
// 生物: Initial Face / 食物: Slice / 道具: Icons / ガラクタ: Identicon (ライセンスは CREDITS.md)
import { getDiceBearUrl } from '@/common/DiceBear/getDiceBearUrl'
import type { AlchemyCategory, AlchemyColor } from '../ai/alchemyTypes'
import { colorCssMap } from '../maps/WordAlchemyColorMap'

type IconSpec = {
  style: string
  /** 完成品の色を、スタイルのどこへ当てはめるか (色の値は '#rrggbb') */
  options: (color: string) => Record<string, string>
}

const luminance = (color: string): number => {
  const n = parseInt(color.slice(1), 16)
  return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
}

/** 明るい色の上には暗い地、暗い色の上には明るい地を敷く (色が地に埋もれないように) */
const contrastBackground = (color: string): string => (luminance(color) > 0.6 ? '#2a2a2a' : '#f5f5f5')

/** 食物のスタイルを変えるときは、ここだけを直す (CC0 か MIT のものにする) */
const iconSpecs: Readonly<Record<AlchemyCategory, IconSpec>> = {
  // 生物: 地の色に、目と口が自動でコントラストを取る
  A: { style: 'initial-face', options: (color) => ({ backgroundColor: color }) },
  // 食物: 本体を色にして、地は反対の明るさにする
  B: { style: 'slice', options: (color) => ({ bodyColor: color, backgroundColor: contrastBackground(color) }) },
  // 道具: 地の色に、アイコンが自動でコントラストを取る
  C: { style: 'icons', options: (color) => ({ backgroundColor: color }) },
  // ガラクタ: 市松の色を、色にする
  D: { style: 'identicon', options: (color) => ({ rowColor: color, backgroundColor: contrastBackground(color) }) },
}

/** アイコンの URL。同じ分類・色・名前なら、いつも同じ絵になる */
export const itemIconUrl = (category: AlchemyCategory, color: AlchemyColor, name: string): string => {
  const spec = iconSpecs[category]
  return getDiceBearUrl(spec.style, name, spec.options(colorCssMap[color]))
}
