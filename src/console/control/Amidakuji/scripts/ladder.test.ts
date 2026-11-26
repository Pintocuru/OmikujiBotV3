// src/console/control/Amidakuji/scripts/ladder.test.ts
import { describe, expect, it } from 'vitest'
import { canPlaceRung, generateAutoRungs, toggleRung, traceAll, traceLadder, type Rung } from './ladder'
import { generateShuffledGoals, type PrizeInput } from './goals'
import { calculateRowCount } from './amidakujiConstants'

describe('ladder (あみだくじの幾何・進行)', () => {
  it('横線の制約: 隣り合う列の同じ行には置けない', () => {
    const colCount = 5
    const rowCount = 10
    const rungs: Rung[] = [{ col: 1, row: 3 }]

    // 同じ行で col = 1 には置けない(重複)
    expect(canPlaceRung(rungs, 1, 3, colCount, rowCount)).toBe(false)
    // 同じ行で左隣 col = 0 には置けない
    expect(canPlaceRung(rungs, 0, 3, colCount, rowCount)).toBe(false)
    // 同じ行で右隣 col = 2 には置けない
    expect(canPlaceRung(rungs, 2, 3, colCount, rowCount)).toBe(false)
    // 1マス離れた col = 3 は置ける
    expect(canPlaceRung(rungs, 3, 3, colCount, rowCount)).toBe(true)
    // 別の行なら col = 1 や col = 2 でも置ける
    expect(canPlaceRung(rungs, 1, 4, colCount, rowCount)).toBe(true)
    expect(canPlaceRung(rungs, 2, 4, colCount, rowCount)).toBe(true)
  })

  it('範囲外の横線は置けない', () => {
    const colCount = 4
    const rowCount = 8
    expect(canPlaceRung([], -1, 0, colCount, rowCount)).toBe(false)
    expect(canPlaceRung([], 3, 0, colCount, rowCount)).toBe(false) // col は 0..2
    expect(canPlaceRung([], 0, -1, colCount, rowCount)).toBe(false)
    expect(canPlaceRung([], 0, 8, colCount, rowCount)).toBe(false) // row は 0..7
  })

  it('toggleRung: 存在すれば削除、なければ制約検査して追加', () => {
    const colCount = 4
    const rowCount = 8
    const r1 = toggleRung([], 1, 2, colCount, rowCount)
    expect(r1.changed).toBe(true)
    expect(r1.rungs).toEqual([{ col: 1, row: 2 }])

    // 再度呼ぶと削除
    const r2 = toggleRung(r1.rungs, 1, 2, colCount, rowCount)
    expect(r2.changed).toBe(true)
    expect(r2.rungs).toEqual([])

    // 隣り合う位置は追加できない
    const r3 = toggleRung(r1.rungs, 2, 2, colCount, rowCount)
    expect(r3.changed).toBe(false)
    expect(r3.rungs).toEqual(r1.rungs)
  })

  it('自動生成でも同じ行で隣り合う横線は絶対に生成されない', () => {
    const colCount = 10
    const rowCount = 20
    const rungs = generateAutoRungs([], colCount, rowCount, 0.4)

    for (let i = 0; i < rungs.length; i++) {
      for (let j = i + 1; j < rungs.length; j++) {
        const a = rungs[i]
        const b = rungs[j]
        if (a.row === b.row) {
          expect(Math.abs(a.col - b.col)).toBeGreaterThan(1)
        }
      }
    }
  })

  it('どんな横線構成でも、結果が全単射 (1対1の対応) になる', () => {
    const colCount = 8
    const rowCount = calculateRowCount(colCount)

    // ランダム生成を10回試行
    for (let seed = 0; seed < 10; seed++) {
      const rungs = generateAutoRungs([], colCount, rowCount, 0.5)
      const allPaths = traceAll(colCount, rungs, rowCount)
      const endCols = allPaths.map((p) => p.endCol)

      // endCol の集合のサイズが参加者数と一致する (重複がない)
      const uniqueEndCols = new Set(endCols)
      expect(uniqueEndCols.size).toBe(colCount)
      for (let c = 0; c < colCount; c++) {
        expect(uniqueEndCols.has(c)).toBe(true)
      }
    }
  })
})

describe('goals (ゴールの生成・シャッフル)', () => {
  it('当たり合計 + はずれ = 縦線の数', () => {
    const prizes: PrizeInput[] = [
      { id: '1', name: '特賞', count: 1 },
      { id: '2', name: 'たわし', count: 2 },
    ]
    const colCount = 6
    const goals = generateShuffledGoals(prizes, colCount, 'ハズレ')

    expect(goals).toHaveLength(6)
    const hits = goals.filter((g) => g.isHit)
    const loses = goals.filter((g) => !g.isHit)

    expect(hits).toHaveLength(3)
    expect(loses).toHaveLength(3)
    expect(hits.filter((g) => g.name === '特賞')).toHaveLength(1)
    expect(hits.filter((g) => g.name === 'たわし')).toHaveLength(2)
    expect(loses.every((g) => g.name === 'ハズレ')).toBe(true)
  })

  it('当たりが多すぎるときはエラー', () => {
    const prizes: PrizeInput[] = [{ id: '1', name: '特賞', count: 5 }]
    expect(() => generateShuffledGoals(prizes, 4)).toThrow(/当たりの数\(5\)が参加者数\(4\)を超えています/)
  })
})
