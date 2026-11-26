// src/console/game/WordAlchemy/scripts/codex.test.ts
import { describe, expect, it } from 'vitest'
import { itemList } from '../maps/WordAlchemyItemMap'
import {
  CODEX_DATA_VERSION,
  CODEX_HISTORY_MAX,
  CODEX_NAME_HISTORY_MAX,
  countDiscovered,
  countFinds,
  createEmptyCodex,
  parseCodex,
  recordDiscovery,
} from './codex'

const found = (name: string, at = 1, userNames: string[] = ['A'], itemId = 'a-red') => ({
  itemId,
  name,
  at,
  userNames,
  pot: 'pressure',
})

describe('recordDiscovery', () => {
  it('初めてなら新種。初回の名前と発見履歴が入る', () => {
    const { codex, isNew } = recordDiscovery(createEmptyCodex(), found('ねこ', 10, ['A', 'B', 'A']))
    expect(isNew).toBe(true)
    expect(codex.entries['a-red']).toEqual({ firstName: 'ねこ', names: ['ねこ'] })
    expect(codex.history).toEqual([{ itemId: 'a-red', at: 10, userNames: ['A', 'B'], pot: 'pressure' }])
  })
  it('再発見は既発見。図鑑本体は 1 件のまま、名前の履歴と発見履歴だけが増える (初回の名前は変わらない)', () => {
    let codex = recordDiscovery(createEmptyCodex(), found('ねこ')).codex
    const again = recordDiscovery(codex, found('いぬ', 2))
    codex = again.codex
    expect(again.isNew).toBe(false)
    expect(Object.keys(codex.entries)).toEqual(['a-red'])
    expect(codex.entries['a-red']).toEqual({ firstName: 'ねこ', names: ['ねこ', 'いぬ'] })
    expect(codex.history).toHaveLength(2)
    expect(countFinds(codex, 'a-red')).toBe(2)
  })
  it('名前の履歴は直近 5 件。発見履歴は直近 500 件 (超えたら、古いものから捨てる)', () => {
    let codex = createEmptyCodex()
    for (let i = 0; i < 8; i++) codex = recordDiscovery(codex, found(`n${i}`, i)).codex
    expect(codex.entries['a-red'].names).toEqual(['n3', 'n4', 'n5', 'n6', 'n7'])
    expect(codex.entries['a-red'].names).toHaveLength(CODEX_NAME_HISTORY_MAX)
    expect(codex.history).toHaveLength(8)
    expect(codex.entries['a-red'].firstName).toBe('n0')

    let big = createEmptyCodex()
    for (let i = 0; i < CODEX_HISTORY_MAX + 10; i++) big = recordDiscovery(big, found('n', i)).codex
    expect(big.history).toHaveLength(CODEX_HISTORY_MAX)
    expect(big.history[0].at).toBe(10)
    expect(big.history[CODEX_HISTORY_MAX - 1].at).toBe(CODEX_HISTORY_MAX + 9)
  })
  it('元の図鑑は書き換えない', () => {
    const base = createEmptyCodex()
    recordDiscovery(base, found('ねこ'))
    expect(base).toEqual(createEmptyCodex())
  })
})

describe('countDiscovered', () => {
  it('登録アイテム数 (分母) に連動する。一覧にないアイテムの記録は数えない', () => {
    let codex = recordDiscovery(createEmptyCodex(), found('ねこ', 1, ['A'], 'a-red')).codex
    codex = recordDiscovery(codex, found('ごーすと', 1, ['A'], 'removed-item')).codex
    expect(countDiscovered(codex, itemList)).toBe(1)
    expect(countDiscovered(codex, itemList.slice(0, 0))).toBe(0)
  })
})

describe('parseCodex', () => {
  it('まだ保存されていなければ、初期状態 (捨てたわけではない)', () => {
    expect(parseCodex(null)).toEqual({ codex: createEmptyCodex(), discarded: false })
  })
  it('正しいデータは、そのまま読む', () => {
    const saved = recordDiscovery(createEmptyCodex(), found('ねこ')).codex
    expect(parseCodex(JSON.parse(JSON.stringify(saved)))).toEqual({ codex: saved, discarded: false })
  })
  it('バージョン違い・壊れたデータは、捨てて初期化する', () => {
    expect(parseCodex({ dataVersion: CODEX_DATA_VERSION + 1, entries: {}, history: [] })).toEqual({
      codex: createEmptyCodex(),
      discarded: true,
    })
    expect(
      parseCodex({ dataVersion: CODEX_DATA_VERSION, entries: { x: { firstName: 1 } }, history: [] }).discarded
    ).toBe(true)
    expect(parseCodex({ foo: 1 }).discarded).toBe(true)
  })
})
