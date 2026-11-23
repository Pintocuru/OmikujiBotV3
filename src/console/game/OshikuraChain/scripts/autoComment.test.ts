// src/console/game/OshikuraChain/scripts/autoComment.test.ts
import { describe, expect, it } from 'vitest'
import { collectAutoSpawns } from './autoComment'
import type { SpawnRequest } from './nuisanceEngine'

const make = (atSeconds: number): SpawnRequest => ({ atSeconds, userId: 'u', userName: 'u', profileImage: '' })

describe('collectAutoSpawns', () => {
  it('時計が間隔に届くまでは、何も入れない', () => {
    expect(collectAutoSpawns(5, 4.9, 5, make)).toEqual({ spawns: [], nextAt: 5 })
  })

  it('間隔ちょうどに 1 件入れ、次の時刻へ進める', () => {
    const r = collectAutoSpawns(5, 5, 5, make)
    expect(r.spawns.map((s) => s.atSeconds)).toEqual([5])
    expect(r.nextAt).toBe(10)
  })

  it('時計が一気に進んでも、きっちり間隔ごとに入れる (到着時刻がずれない)', () => {
    const r = collectAutoSpawns(5, 23, 5, make)
    expect(r.spawns.map((s) => s.atSeconds)).toEqual([5, 10, 15, 20])
    expect(r.nextAt).toBe(25)
  })

  it('小さな刻みを繰り返しても、20 秒で 4 件 (5 秒ごと)', () => {
    let nextAt = 5
    let count = 0
    for (let i = 0; i <= 400; i++) {
      const r = collectAutoSpawns(nextAt, i * 0.05, 5, make) // 0.05 秒刻みで 20 秒まで (累積誤差を避けるため、整数から作る)
      nextAt = r.nextAt
      count += r.spawns.length
    }
    expect(count).toBe(4)
  })

  it('間隔が 0 以下なら、何も入れない (無限ループしない)', () => {
    expect(collectAutoSpawns(0, 100, 0, make).spawns).toEqual([])
  })
})
