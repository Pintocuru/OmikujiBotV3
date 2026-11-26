// src/console/game/WordAlchemy/scripts/codex.test.ts
import { describe, expect, it } from 'vitest'
import { itemList } from '../maps/WordAlchemyItemMap'
import {
  CODEX_DATA_VERSION,
  countDiscovered,
  createEmptyCodex,
  getEntry,
  parseCodex,
  setEntry,
  type CodexEntry,
} from './codex'

const entry = (name: string, at = 1): CodexEntry => ({
  name,
  materials: [
    { text: 'こんにちは', userName: 'A' },
    { text: 'ラーメン', userName: 'B' },
  ],
  at,
})

describe('setEntry / getEntry', () => {
  it('鍋ごとに別の図鑑。同じアイテムでも、鍋が違えば別の枠', () => {
    let codex = setEntry(createEmptyCodex(), 'pressure', 'a-red', entry('ねこ'))
    codex = setEntry(codex, 'witch', 'a-red', entry('ぬこ'))
    expect(getEntry(codex, 'pressure', 'a-red')?.name).toBe('ねこ')
    expect(getEntry(codex, 'witch', 'a-red')?.name).toBe('ぬこ')
    expect(getEntry(codex, 'mizutaki', 'a-red')).toBeUndefined()
  })
  it('同じ枠に入れると置き換える (1 件のまま)', () => {
    let codex = setEntry(createEmptyCodex(), 'pressure', 'a-red', entry('ねこ'))
    codex = setEntry(codex, 'pressure', 'a-red', entry('いぬ', 2))
    expect(Object.keys(codex.pots.pressure)).toEqual(['a-red'])
    expect(getEntry(codex, 'pressure', 'a-red')).toEqual(entry('いぬ', 2))
  })
  it('元の図鑑は書き換えない', () => {
    const base = createEmptyCodex()
    setEntry(base, 'pressure', 'a-red', entry('ねこ'))
    expect(base).toEqual(createEmptyCodex())
  })
})

describe('countDiscovered', () => {
  it('その鍋だけを数える。一覧にないアイテムの記録は数えない', () => {
    let codex = setEntry(createEmptyCodex(), 'pressure', 'a-red', entry('ねこ'))
    codex = setEntry(codex, 'pressure', 'removed-item', entry('ごーすと'))
    codex = setEntry(codex, 'witch', 'b-red', entry('ぱん'))
    expect(countDiscovered(codex, 'pressure', itemList)).toBe(1)
    expect(countDiscovered(codex, 'witch', itemList)).toBe(1)
    expect(countDiscovered(codex, 'yami', itemList)).toBe(0)
    expect(countDiscovered(codex, 'pressure', [])).toBe(0)
  })
})

describe('parseCodex', () => {
  it('まだ保存されていなければ、初期状態 (捨てたわけではない)', () => {
    expect(parseCodex(null)).toEqual({ codex: createEmptyCodex(), discarded: false })
  })
  it('正しいデータは、そのまま読む', () => {
    const saved = setEntry(createEmptyCodex(), 'pressure', 'a-red', entry('ねこ'))
    expect(parseCodex(JSON.parse(JSON.stringify(saved)))).toEqual({ codex: saved, discarded: false })
  })
  it('バージョン違い (旧データを含む)・壊れたデータは、捨てて初期化する', () => {
    expect(parseCodex({ dataVersion: CODEX_DATA_VERSION - 1, entries: {}, history: [] })).toEqual({
      codex: createEmptyCodex(),
      discarded: true,
    })
    expect(parseCodex({ dataVersion: CODEX_DATA_VERSION, pots: { p: { x: { name: 1 } } } }).discarded).toBe(true)
    expect(parseCodex({ foo: 1 }).discarded).toBe(true)
  })
})
