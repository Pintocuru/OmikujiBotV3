// src/ui/LuckyDraw/composables/pickRandom.test.ts
import { describe, expect, it } from 'vitest'
import { pickRandom } from './pickRandom'

describe('pickRandom', () => {
  const items = ['a', 'b', 'c', 'd', 'e']

  it('重複なしで count 個を選ぶ', () => {
    const picked = pickRandom(items, 3)
    expect(picked).toHaveLength(3)
    expect(new Set(picked).size).toBe(3)
    for (const item of picked) expect(items).toContain(item)
  })

  it('count が配列より多いときは全員を返す', () => {
    const picked = pickRandom(items, 10)
    expect([...picked].sort()).toEqual(items)
  })

  it('count が 0 以下・空配列のときは空配列', () => {
    expect(pickRandom(items, 0)).toEqual([])
    expect(pickRandom(items, -1)).toEqual([])
    expect(pickRandom([], 3)).toEqual([])
  })

  it('元の配列を変更しない', () => {
    const copy = [...items]
    pickRandom(items, 3)
    expect(items).toEqual(copy)
  })

  it('乱数を差し替えると結果が決まる', () => {
    // 常に 0 を返す乱数 → 各回で先頭(残りの先頭)を選ぶので、元の順のまま
    expect(pickRandom(items, 2, () => 0)).toEqual(['a', 'b'])
  })
})
