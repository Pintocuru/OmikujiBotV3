// src/console/game/WordAlchemy/scripts/drawItem.test.ts
import { describe, expect, it } from 'vitest'
import { itemList, type ItemDefinition } from '../maps/WordAlchemyItemMap'
import { drawItem } from './drawItem'

const item = (
  id: string,
  category: ItemDefinition['category'],
  color: ItemDefinition['color'],
  rarity: ItemDefinition['rarity'] = 'common'
): ItemDefinition => ({
  id,
  category,
  color,
  rarity,
  image: null,
})

describe('itemList', () => {
  it('4 分類 × 8 色で 32 種、id は重複しない', () => {
    expect(itemList).toHaveLength(32)
    expect(new Set(itemList.map((i) => i.id)).size).toBe(32)
    expect(itemList.every((i) => i.rarity === 'common')).toBe(true)
  })
})

describe('drawItem', () => {
  it('初期状態では、分類と色の組み合わせに 1 種ずつなので、抽選は発生せず乱数も使わない', () => {
    const rng = () => {
      throw new Error('乱数は使わない')
    }
    expect(drawItem(itemList, 'B', '赤', rng)?.id).toBe('b-red')
    expect(drawItem(itemList, 'D', '黒', rng)?.id).toBe('d-black')
  })
  it('分類と色の両方に一致するものがなければ null (分類だけでは選ばない)', () => {
    expect(drawItem([item('a-red', 'A', '赤')], 'A', '青')).toBeNull()
    expect(drawItem([], 'A', '赤')).toBeNull()
  })
  it('同じ分類・色に複数あれば、レアリティの重み (コモン 4・アンコモン 3・レア 2) で抽選する', () => {
    const items = [
      item('common', 'C', '青', 'common'),
      item('uncommon', 'C', '青', 'uncommon'),
      item('rare', 'C', '青', 'rare'),
    ]
    // 合計 9: 0〜4 → コモン、4〜7 → アンコモン、7〜9 → レア
    expect(drawItem(items, 'C', '青', () => 0.1)?.id).toBe('common')
    expect(drawItem(items, 'C', '青', () => 4.5 / 9)?.id).toBe('uncommon')
    expect(drawItem(items, 'C', '青', () => 8 / 9)?.id).toBe('rare')
    expect(drawItem(items, 'C', '青', () => 0.999)?.id).toBe('rare')
  })
})
