// src/console/game/WordAlchemy/maps/WordAlchemyItemMap.ts
// アイテムの一覧 (データ駆動)。分類・色・重みで抽選する。画像は素材ができたら入れる (null なら、画像なしで進む)
// 100 種 (各分類 25 種) の具体的な内容は未決定。以下は、抽選の動作確認用の仮のデータ (各分類 2 種)
import type { AlchemyCategory, AlchemyColor } from '../ai/alchemyTypes'

export type ItemDefinition = {
  id: string
  category: AlchemyCategory
  color: AlchemyColor
  /** images/WordAlchemy/items/ からの相対パス。素材がなければ null */
  image: string | null
  /** 抽選の重み (大きいほど出やすい。0 以下は出ない) */
  weight: number
}

export const itemList: readonly ItemDefinition[] = [
  { id: 'a-01', category: 'A', color: '緑', image: null, weight: 1 },
  { id: 'a-02', category: 'A', color: '赤', image: null, weight: 1 },
  { id: 'b-01', category: 'B', color: '橙', image: null, weight: 1 },
  { id: 'b-02', category: 'B', color: '黄', image: null, weight: 1 },
  { id: 'c-01', category: 'C', color: '青', image: null, weight: 1 },
  { id: 'c-02', category: 'C', color: '白', image: null, weight: 1 },
  { id: 'd-01', category: 'D', color: '黒', image: null, weight: 1 },
  { id: 'd-02', category: 'D', color: '紫', image: null, weight: 1 },
]
