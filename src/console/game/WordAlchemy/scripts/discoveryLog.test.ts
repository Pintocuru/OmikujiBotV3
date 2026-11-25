// src/console/game/WordAlchemy/scripts/discoveryLog.test.ts
import { describe, expect, it } from 'vitest'
import { buildDiscoveryLogs, DISCOVERY_SCORE } from './discoveryLog'

const users = [
  { userId: 'u1', userName: 'A' },
  { userId: 'u2', userName: 'B' },
  { userId: 'u1', userName: 'A' },
]

describe('buildDiscoveryLogs', () => {
  it('材料を出したユーザーごとに 1 件。同じユーザーが複数の材料を出していても 1 件', () => {
    const logs = buildDiscoveryLogs({ discoveryId: 'd1', name: 'ねこ', isNew: true, users, createdAt: 10 })
    expect(logs.map((l) => l.userId)).toEqual(['u1', 'u2'])
    expect(logs.map((l) => l.id)).toEqual(['d1:u1', 'd1:u2'])
  })
  it('新種は高い貢献点・フラグ・「(新種)」付き。既発見は低い貢献点', () => {
    const [fresh] = buildDiscoveryLogs({ discoveryId: 'd1', name: 'ねこ', isNew: true, users, createdAt: 10 })
    expect(fresh).toMatchObject({ score: DISCOVERY_SCORE.new, item: 'ねこ(新種)', flag: true, userName: 'A', createdAt: 10 })
    const [known] = buildDiscoveryLogs({ discoveryId: 'd2', name: 'いぬ', isNew: false, users, createdAt: 11 })
    expect(known).toMatchObject({ score: DISCOVERY_SCORE.known, item: 'いぬ', flag: false })
    expect(DISCOVERY_SCORE.new).toBeGreaterThan(DISCOVERY_SCORE.known)
  })
  it('煮込みごとに id が変わる (別の煮込みは、別の記録になる)', () => {
    const a = buildDiscoveryLogs({ discoveryId: 'd1', name: 'x', isNew: false, users, createdAt: 1 })
    const b = buildDiscoveryLogs({ discoveryId: 'd2', name: 'x', isNew: false, users, createdAt: 1 })
    expect(a[0].id).not.toBe(b[0].id)
  })
})
