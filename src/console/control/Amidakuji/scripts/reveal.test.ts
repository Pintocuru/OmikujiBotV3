// src/console/control/Amidakuji/scripts/reveal.test.ts
import { describe, expect, it } from 'vitest'
import { traceLadder, type Rung } from './ladder'
import { crossingsOf, pointAt, polylineUpTo } from './trace'
import { pruneRungs } from './rungs'
import { countTotalPrizes, generateShuffledGoals, type PrizeInput } from './goals'
import { buildResults } from './results'

describe('rungs (範囲外の横線の掃除)', () => {
  it('人数や行数が減ったあとに範囲外になる横線を除く', () => {
    const rungs: Rung[] = [
      { col: 0, row: 0 },
      { col: 3, row: 2 }, // colCount=4 なら col は 0..2 なので範囲外
      { col: 1, row: 9 }, // rowCount=8 なら範囲外
    ]
    expect(pruneRungs(rungs, 4, 8)).toEqual([{ col: 0, row: 0 }])
  })
})

describe('trace (高さ y からの位置)', () => {
  const rowCount = 4
  const path = traceLadder(0, [{ col: 0, row: 1 }], rowCount)

  it('横線を渡る所を取り出せる', () => {
    expect(crossingsOf(path)).toEqual([{ row: 1.5, from: 0, to: 1 }])
  })

  it('y=0 は始点だけ、y=rowCount は終点まで', () => {
    expect(polylineUpTo(path, 0, rowCount)).toEqual([{ col: 0, row: 0 }])
    const full = polylineUpTo(path, rowCount, rowCount)
    expect(full[full.length - 1]).toEqual({ col: path.endCol, row: rowCount })
  })

  it('横線の途中では、col が小数になる', () => {
    const p = pointAt(path, 1.5, rowCount)
    expect(p.col).toBeCloseTo(0.5)
    expect(p.row).toBeCloseTo(1.5)
  })

  it('横線の数が違っても、同じ y なら同じ高さにいる (全員同時)', () => {
    const none = traceLadder(2, [], rowCount)
    expect(pointAt(none, 2.2, rowCount).row).toBeCloseTo(2.2)
    expect(pointAt(path, 2.2, rowCount).row).toBeCloseTo(2.2)
  })
})

describe('goals (不正な個数)', () => {
  it('NaN・小数・負数は 0 以上の整数にそろえる', () => {
    const prizes: PrizeInput[] = [
      { id: '1', name: 'a', count: Number.NaN },
      { id: '2', name: 'b', count: 1.9 },
      { id: '3', name: 'c', count: -3 },
    ]
    expect(countTotalPrizes(prizes)).toBe(1)
    expect(generateShuffledGoals(prizes, 4)).toHaveLength(4)
  })
})

describe('results (結果一覧)', () => {
  const goals = [
    { id: 'g0', name: 'はずれ', isHit: false },
    { id: 'g1', name: '当たり', isHit: true },
  ]
  const paths = [
    { startCol: 0, endCol: 0, steps: [] },
    { startCol: 1, endCol: 1, steps: [] },
  ]

  it('発表済みだけを、当たり先頭で返す', () => {
    const res = buildResults(['A', 'B'], goals, paths, new Set([0, 1]))
    expect(res.map((r) => r.player)).toEqual(['B', 'A'])
    expect(buildResults(['A', 'B'], goals, paths, new Set([0])).map((r) => r.player)).toEqual(['A'])
  })

  it('ゴールが見つからない行は、例外にせず除く', () => {
    expect(buildResults(['A', 'B'], [goals[0]], paths, new Set([0, 1])).map((r) => r.player)).toEqual(['A'])
  })
})
