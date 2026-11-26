// src/console/game/WordAlchemy/maps/WordAlchemyItemMap.ts
// アイテムの一覧 (データ駆動)。「4 分類 × 8 色の各組み合わせに 1 種ずつ、計 32 種」。レア度はない。
// 同じ分類・色に複数のアイテムを足すときは、itemList に追加する (抽選は一様なランダム)。
// 見た目 (アイコン) は DiceBear が名前から作るので、アイテムは画像を持たない (scripts/itemIcon.ts)。id は図鑑のキーなので、変えない
import { ALCHEMY_CATEGORIES, ALCHEMY_PALETTE, type AlchemyCategory, type AlchemyColor } from '../ai/alchemyTypes'

export type ItemDefinition = {
  /** 固有のアイテム ID。図鑑のキーになるので、変えない */
  id: string
  category: AlchemyCategory
  color: AlchemyColor
}

const COLOR_ID: Readonly<Record<AlchemyColor, string>> = {
  赤: 'red',
  橙: 'orange',
  黄: 'yellow',
  緑: 'green',
  青: 'blue',
  紫: 'purple',
  白: 'white',
  黒: 'black',
}

/** 並び順がそのまま図鑑の並び順 (分類順 → 色のパレット順) */
export const itemList: readonly ItemDefinition[] = ALCHEMY_CATEGORIES.flatMap((category) =>
  ALCHEMY_PALETTE.map((color) => ({
    id: `${category.toLowerCase()}-${COLOR_ID[color]}`,
    category,
    color,
  }))
)
