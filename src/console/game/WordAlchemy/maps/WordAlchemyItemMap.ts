// src/console/game/WordAlchemy/maps/WordAlchemyItemMap.ts
// アイテムの一覧 (データ駆動)。初期は「4 分類 × 8 色の各組み合わせに 1 種ずつ、計 32 種」(すべてコモン)。
// 同じ分類・色に複数のアイテムを足すときは、itemList に追加する (アンコモン・レアは、そのときに使う)。
// 個別のアイテムの内容・画像は素材選定で決める。いまは、分類と色だけの仮のアイテム (id は図鑑のキーなので、決めたら変えない)
import { ALCHEMY_CATEGORIES, ALCHEMY_PALETTE, type AlchemyCategory, type AlchemyColor } from '../ai/alchemyTypes'

export type ItemRarity = 'common' | 'uncommon' | 'rare'

/** 抽選の重み (同じ分類・色に複数のアイテムがあるときだけ効く) */
export const RARITY_WEIGHT: Readonly<Record<ItemRarity, number>> = { common: 4, uncommon: 3, rare: 2 }

export type ItemDefinition = {
  /** 固有のアイテム ID。図鑑のキーになるので、変えない */
  id: string
  category: AlchemyCategory
  color: AlchemyColor
  rarity: ItemRarity
  /** images/WordAlchemy/items/ からの相対パス。素材がなければ null (図鑑では色の四角で代用する) */
  image: string | null
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
    rarity: 'common' as const,
    image: null,
  }))
)
