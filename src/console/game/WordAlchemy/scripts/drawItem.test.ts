// src/console/game/WordAlchemy/scripts/drawItem.test.ts
import { describe, expect, it } from 'vitest'
import type { ItemDefinition } from '../maps/WordAlchemyItemMap'
import { drawItem } from './drawItem'

const item = (
  id: string,
  category: ItemDefinition['category'],
  color: ItemDefinition['color'],
  weight = 1
): ItemDefinition => ({
  id,
  category,
  color,
  image: null,
  weight,
})
const ITEMS = [
  item('a-red', 'A', '赤'),
  item('a-blue', 'A', '青'),
  item('a-blue2', 'A', '青', 3),
  item('b-red', 'B', '赤'),
  item('c-zero', 'C', '赤', 0),
]

describe('drawItem', () => {
  it('分類と色が合うものから抽選する', () => {
    expect(drawItem(ITEMS, 'A', '赤', () => 0.99)?.id).toBe('a-red')
    expect(drawItem(ITEMS, 'B', '赤', () => 0)?.id).toBe('b-red')
  })
  it('色が合うものがなければ、分類だけで抽選する', () => {
    expect(['a-red', 'a-blue', 'a-blue2']).toContain(drawItem(ITEMS, 'A', '緑', () => 0.5)?.id)
  })
  it('重みが大きいほど出やすい (重み 1 と 3 なら、先頭 1/4 だけが軽い方)', () => {
    expect(drawItem(ITEMS, 'A', '青', () => 0.1)?.id).toBe('a-blue')
    expect(drawItem(ITEMS, 'A', '青', () => 0.3)?.id).toBe('a-blue2')
    expect(drawItem(ITEMS, 'A', '青', () => 0.999)?.id).toBe('a-blue2')
  })
  it('その分類に出せるアイテムがなければ null (重み 0 は出ない)', () => {
    expect(drawItem(ITEMS, 'C', '赤')).toBeNull()
    expect(drawItem(ITEMS, 'D', '赤')).toBeNull()
  })
})
