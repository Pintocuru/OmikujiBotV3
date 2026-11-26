// src/console/game/WordAlchemy/scripts/drawItem.test.ts
import { describe, expect, it } from 'vitest'
import { itemList, type ItemDefinition } from '../maps/WordAlchemyItemMap'
import { drawItem } from './drawItem'

const item = (id: string, category: ItemDefinition['category'], color: ItemDefinition['color']): ItemDefinition => ({
  id,
  category,
  color,
})

describe('itemList', () => {
  it('4 分類 × 8 色で 32 種、id は重複しない', () => {
    expect(itemList).toHaveLength(32)
    expect(new Set(itemList.map((i) => i.id)).size).toBe(32)
  })
})

describe('drawItem', () => {
  it('分類と色の組み合わせに 1 種ずつなので、抽選は発生せず乱数も使わない', () => {
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
  it('同じ分類・色に複数あれば、一様なランダムで選ぶ', () => {
    const items = [item('x', 'C', '青'), item('y', 'C', '青'), item('z', 'C', '青')]
    expect(drawItem(items, 'C', '青', () => 0)?.id).toBe('x')
    expect(drawItem(items, 'C', '青', () => 0.5)?.id).toBe('y')
    expect(drawItem(items, 'C', '青', () => 0.999)?.id).toBe('z')
  })
})
