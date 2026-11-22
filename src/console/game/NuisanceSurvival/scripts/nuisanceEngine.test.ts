// src/console/game/NuisanceSurvival/scripts/nuisanceEngine.test.ts
import { describe, expect, it } from 'vitest'
import { createDefaultConfig, type NuisanceConfigType } from './nuisanceConfig'
import {
  HERO_MOVE_INTERVAL_SECONDS,
  HERO_PUSH_INTERVAL_SECONDS,
  MAX_DAMAGE_RAMP,
  MAX_FOOTPRINT,
  MAX_OBSTACLES,
  MAX_SIZE_SCALE,
  OBSTACLE_SECONDS,
  PUSH_WAVE_DELAY_SECONDS,
  STEP_SECONDS,
  WORD_MAX,
  WORD_MAX_PER_COMMENT,
  WORD_SECONDS_MAX,
  WORD_SECONDS_MIN,
} from './nuisanceConstants'
import {
  advance,
  createGame,
  footprintOf,
  getContributionRanking,
  damageRampOf,
  sizeScaleOf,
  type GameState,
  type GridSize,
  type Nuisance,
  type SpawnRequest,
} from './nuisanceEngine'
import { NO_INPUT } from './heroInput'
import { getNuisanceTraits, type NuisanceKind } from './nuisanceTraits'
import { createRng } from './rng'

const config = (overrides: Partial<NuisanceConfigType> = {}): NuisanceConfigType => ({
  ...createDefaultConfig(),
  regenPerSecond: 0, // 既存のテストは、回復・時間経過の増加なしで書かれている
  damageRampPerMinute: 0,
  ...overrides,
})

const spawn = (userId: string, atSeconds = 0, lc?: number): SpawnRequest => ({
  atSeconds,
  lc,
  userId,
  userName: `name-${userId}`,
  profileImage: '',
})

/** 指定した種類になる userId を探す (static は、特殊能力の割合 0 のとき) */
const findUserId = (kind: NuisanceKind, from = 0): string => {
  const rate = kind === 'static' ? 0 : 1
  for (let i = from; i < from + 5000; i++) if (getNuisanceTraits(`u${i}`, rate).kind === kind) return `u${i}`
  throw new Error(`no user for ${kind}`)
}

/** 種類が決まった邪魔者を 1 体、指定のマスに置いた状態にする */
const withNuisance = (
  state: GameState,
  userId: string,
  col: number,
  row: number,
  patch: Partial<Nuisance> = {}
): GameState => {
  const traits = getNuisanceTraits(userId, patch.traits?.kind === 'static' ? 0 : 1)
  const nuisance: Nuisance = {
    id: state.nextId,
    userId,
    userName: `name-${userId}`,
    profileImage: '',
    traits,
    col,
    row,
    prevCol: col,
    prevRow: row,
    movedAt: 0,
    dirX: 1,
    dirY: 0,
    moveTimer: 1e9, // 勝手に動かない
    age: 0,
    fuse: traits.fuseSeconds,
    ...patch,
  }
  return {
    ...state,
    nextId: state.nextId + 1,
    nuisances: [...state.nuisances, nuisance],
    contributions: {
      ...state.contributions,
      [userId]: state.contributions[userId] ?? {
        userId,
        userName: nuisance.userName,
        profileImage: '',
        damage: 0,
        spawned: 1,
      },
    },
  }
}

const run = (state: GameState, cfg: NuisanceConfigType, seconds: number, input = NO_INPUT, seed = 1) =>
  advance(state, cfg, seconds, input, [], createRng(seed)).state

describe('sizeScaleOf / footprintOf', () => {
  const traits = { ...getNuisanceTraits('a'), baseSize: 1 }

  it('倍率の間隔ごとに、設定の倍率が掛かる', () => {
    const cfg = config({ growthMultiplier: 2, growthIntervalSeconds: 10 })
    expect(sizeScaleOf({ age: 0, traits }, cfg)).toBeCloseTo(1)
    expect(sizeScaleOf({ age: 10, traits }, cfg)).toBeCloseTo(2)
    expect(sizeScaleOf({ age: 5, traits }, cfg)).toBeCloseTo(Math.SQRT2)
  })

  it('倍率 1 なら大きくならず、上限を超えない', () => {
    expect(sizeScaleOf({ age: 9999, traits }, config({ growthMultiplier: 1 }))).toBeCloseTo(1)
    expect(sizeScaleOf({ age: 9999, traits }, config({ growthMultiplier: 3 }))).toBe(MAX_SIZE_SCALE)
  })

  it('占めるマスは 1〜MAX_FOOTPRINT', () => {
    expect(footprintOf(0.8)).toBe(1)
    expect(footprintOf(1.4)).toBe(1)
    expect(footprintOf(1.5)).toBe(2)
    expect(footprintOf(99)).toBe(MAX_FOOTPRINT)
  })
})

describe('advance: 出現', () => {
  it('コメントが届いた時刻の刻みで、空いているマスに出る (主人公のマスには出ない)', () => {
    const cfg = config()
    const grid: GridSize = { cols: 3, rows: 3 }
    const state = createGame(cfg, grid)
    const { state: next, pending } = advance(state, cfg, 1, NO_INPUT, [spawn('x', 0.5), spawn('y', 5)], createRng(1))
    expect(next.nuisances.map((n) => n.userId)).toEqual(['x'])
    expect(pending.map((p) => p.userId)).toEqual(['y'])
    const n = next.nuisances[0]
    expect([n.col, n.row]).not.toEqual([next.hero.col, next.hero.row])
    expect(next.contributions.x.spawned).toBe(1)
  })

  it('上限を超えたコメントは無視する (出現数に数えない)', () => {
    const cfg = config({ maxNuisances: 2 })
    const state = createGame(cfg)
    const spawns = ['a', 'b', 'c', 'd'].map((id) => spawn(id))
    const next = advance(state, cfg, 0.1, NO_INPUT, spawns, createRng(2)).state
    expect(next.nuisances).toHaveLength(2)
    expect(next.ignoredCount).toBe(2)
    expect(next.contributions.c).toBeUndefined()
  })

  it('空きマスがなければ無視する', () => {
    const cfg = config({ maxNuisances: 50 })
    const grid: GridSize = { cols: 2, rows: 1 } // 主人公 1 マス + 空き 1 マス
    const next = advance(createGame(cfg, grid), cfg, 0.1, NO_INPUT, [spawn('a'), spawn('b')], createRng(3)).state
    expect(next.nuisances).toHaveLength(1)
    expect(next.ignoredCount).toBe(1)
  })

  it('同じユーザーが何度コメントしても、そのぶんだけ増える', () => {
    const cfg = config()
    const next = advance(createGame(cfg), cfg, 0.1, NO_INPUT, [spawn('a'), spawn('a'), spawn('a')], createRng(4)).state
    expect(next.nuisances.filter((n) => n.userId === 'a')).toHaveLength(3)
    expect(next.contributions.a.spawned).toBe(3)
  })
})

describe('advance: 追いつき (隠れていても止まらない)', () => {
  it('1 回で長い時間を進めても、細かく進めた結果と同じになる', () => {
    const cfg = config()
    const spawns = [spawn('a', 1), spawn('b', 3.3), spawn('c', 7)]
    const once = advance(createGame(cfg), cfg, 30, NO_INPUT, spawns, createRng(5))

    let state = createGame(cfg)
    let pending: SpawnRequest[] = spawns
    const rng = createRng(5)
    for (let t = 1; t <= 30; t++) {
      const r = advance(state, cfg, t, NO_INPUT, pending, rng)
      state = r.state
      pending = r.pending
    }
    expect(state.elapsed).toBeCloseTo(once.state.elapsed)
    expect(state.life).toBeCloseTo(once.state.life)
    expect(state.nuisances.map((n) => [n.userId, n.col, n.row])).toEqual(
      once.state.nuisances.map((n) => [n.userId, n.col, n.row])
    )
  })

  it('離席中にコメントが大量に届いてゲームオーバーになる。終了時刻は、ライフが 0 になった時刻', () => {
    const cfg = config({ startLife: 20, maxNuisances: 100, drainMultiplier: 5 })
    const spawns = Array.from({ length: 60 }, (_, i) => spawn(`user${i}`, 1 + (i % 5) * 0.2))
    const r = advance(createGame(cfg), cfg, 600, NO_INPUT, spawns, createRng(6))
    expect(r.state.over).toBe(true)
    expect(r.state.life).toBe(0)
    expect(r.state.endedAt).not.toBeNull()
    expect(r.state.endedAt!).toBeGreaterThan(1)
    expect(r.state.endedAt!).toBeLessThan(600)
    expect(r.state.elapsed).toBe(r.state.endedAt)
    expect(r.pending).toEqual([])
  })

  it('ゲームオーバーのあとは、何も変わらない', () => {
    const cfg = config({ startLife: 1, drainMultiplier: 10 })
    const over = advance(createGame(cfg), cfg, 60, NO_INPUT, [spawn('a'), spawn('b')], createRng(7)).state
    expect(over.over).toBe(true)
    expect(advance(over, cfg, 120, NO_INPUT, [spawn('c')], createRng(7)).state).toBe(over)
  })

  it('刻みの上限で止まったら、reachedStepLimit が立つ。続きを呼べば追いつく', () => {
    const cfg = config({ startLife: 1000 })
    const first = advance(createGame(cfg), cfg, 100, NO_INPUT, [], createRng(8), 100)
    expect(first.reachedStepLimit).toBe(true)
    expect(first.state.elapsed).toBeCloseTo(100 * STEP_SECONDS)
    const second = advance(first.state, cfg, 10, NO_INPUT, [], createRng(8), 1000)
    expect(second.reachedStepLimit).toBe(false)
    expect(second.state.elapsed).toBeCloseTo(10, 1)
  })

  it('元の state は変えない', () => {
    const cfg = config()
    const state = createGame(cfg)
    const snapshot = JSON.stringify(state)
    advance(state, cfg, 5, NO_INPUT, [spawn('a')], createRng(9))
    expect(JSON.stringify(state)).toBe(snapshot)
  })
})

describe('advance: ライフと貢献度', () => {
  it('邪魔者の数と大きさに応じて減る (大きいほど速い)', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('wanderer')
    const one = run(withNuisance(createGame(cfg), userId, 0, 0), cfg, 10)
    const two = run(withNuisance(withNuisance(createGame(cfg), userId, 0, 0), userId, 5, 5), cfg, 10)
    const lostOne = cfg.startLife - one.life
    const lostTwo = cfg.startLife - two.life
    expect(lostOne).toBeGreaterThan(0)
    expect(lostTwo).toBeCloseTo(lostOne * 2, 1)

    const grown = config({ growthMultiplier: 1 })
    const big = run(withNuisance(createGame(grown), userId, 0, 0, { age: 0 }), grown, 10)
    const growing = config({ growthMultiplier: 2, growthIntervalSeconds: 5 })
    const bigger = run(withNuisance(createGame(growing), userId, 0, 0), growing, 10)
    expect(growing.startLife - bigger.life).toBeGreaterThan(grown.startLife - big.life)
  })

  it('ゲームオーバーのとき、全員の貢献度の合計は、減らしたライフ (最大ライフ) に等しい', () => {
    const cfg = config({ startLife: 30, maxNuisances: 100, drainMultiplier: 4 })
    const spawns = Array.from({ length: 20 }, (_, i) => spawn(`user${i}`, 0.1))
    const state = advance(createGame(cfg), cfg, 300, NO_INPUT, spawns, createRng(10)).state
    expect(state.over).toBe(true)
    const sum = Object.values(state.contributions).reduce((s, c) => s + c.damage, 0)
    expect(sum).toBeCloseTo(cfg.startLife, 5)
  })

  it('貢献度の順位は、ダメージの多い順', () => {
    const cfg = config({ startLife: 30, maxNuisances: 100, drainMultiplier: 4 })
    const spawns = [...Array.from({ length: 8 }, (_, i) => spawn(`heavy${i}`, 0)), spawn('light', 0)]
    const state = advance(createGame(cfg), cfg, 300, NO_INPUT, spawns, createRng(11)).state
    const ranking = getContributionRanking(state)
    for (let i = 1; i < ranking.length; i++) expect(ranking[i - 1].damage).toBeGreaterThanOrEqual(ranking[i].damage)
  })
})

describe('advance: 爆発', () => {
  it('bomber は、時間が来ると消えて、大きなダメージを与える', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('bomber')
    const traits = getNuisanceTraits(userId)
    const fuse = traits.fuseSeconds!
    const before = withNuisance(createGame(cfg), userId, 0, 0)
    const mid = run(before, cfg, fuse - 1)
    expect(mid.nuisances).toHaveLength(1)
    const after = run(mid, cfg, fuse + 1)
    expect(after.nuisances).toHaveLength(0)
    expect(after.explodedCount).toBe(1)
    const lost = cfg.startLife - after.life
    expect(lost).toBeGreaterThan(traits.explosionDamage * 0.9)
    expect(after.contributions[userId].damage).toBeCloseTo(lost, 5)
  })
})

describe('advance: 主人公の移動と除去', () => {
  const grid: GridSize = { cols: 5, rows: 3 }

  it('キーを押している間、一定の間隔で 1 マスずつ動き、壁で止まる', () => {
    const cfg = config()
    const state = createGame(cfg, grid) // 主人公は (2, 1)
    const right = run(state, cfg, 0.5, { dx: 1, dy: 0 })
    expect(right.hero.col).toBeGreaterThan(2)
    const wall = run(state, cfg, 5, { dx: 1, dy: 0 })
    expect(wall.hero.col).toBe(4)
    const none = run(state, cfg, 5, NO_INPUT)
    expect([none.hero.col, none.hero.row]).toEqual([2, 1])
  })

  it('邪魔者にぶつかると、1 マス押し出される (主人公は、空いたマスへ進む)', () => {
    const cfg = config({ growthMultiplier: 1 })
    const base = withNuisance(createGame(cfg, grid), findUserId('static'), 3, 1) // 主人公 (2,1) の右隣
    const r = advance(base, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1)).state
    expect([r.hero.col, r.hero.row]).toEqual([3, 1])
    expect([r.nuisances[0].col, r.nuisances[0].row]).toEqual([4, 1])
    expect(r.removedCount).toBe(0)
  })

  it('壁際の邪魔者をさらに押すと、撃破される', () => {
    const cfg = config({ growthMultiplier: 1 })
    const base = withNuisance(createGame(cfg, grid), findUserId('static'), 4, 1) // 右端
    const state = { ...base, hero: { col: 3, row: 1, cooldown: 0 } }
    const r = advance(state, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1))
    expect(r.state.nuisances).toHaveLength(0)
    expect(r.state.removedCount).toBe(1)
    expect(r.state.hero.col).toBe(4)
    expect(r.events).toMatchObject([{ type: 'enemyDeath', cause: 'removed', col: 4, row: 1 }])
  })

  it('連鎖して押す。先頭が壁際なら、先頭だけ撃破され、後ろは詰まる', () => {
    const cfg = config({ growthMultiplier: 1 })
    let state = createGame(cfg, grid)
    state = withNuisance(state, findUserId('static'), 3, 1)
    state = withNuisance(state, findUserId('static', 100), 4, 1)
    const r = advance(state, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1)).state
    expect(r.removedCount).toBe(1)
    expect(r.nuisances.map((n) => [n.col, n.row])).toEqual([[4, 1]])
  })

  it('押し出しは、移動と同じ間隔でしか起きない', () => {
    const cfg = config({ growthMultiplier: 1 })
    const base = withNuisance(createGame(cfg, { cols: 9, rows: 3 }), findUserId('static'), 5, 1) // 主人公 (4,1)
    const r = run(base, cfg, 0.2, { dx: 1, dy: 0 })
    expect(r.hero.col).toBeLessThanOrEqual(6)
    expect(r.nuisances[0].col).toBeLessThanOrEqual(7)
  })
})

describe('advance: 時間経過のダメージ増加と自然回復', () => {
  it('ダメージ倍率は時間とともに増え、上限を超えない', () => {
    const cfg = config({ damageRampPerMinute: 1 })
    expect(damageRampOf(0, cfg)).toBe(1)
    expect(damageRampOf(60, cfg)).toBeCloseTo(2)
    expect(damageRampOf(1e6, cfg)).toBe(MAX_DAMAGE_RAMP)
  })

  it('時間が経った後のほうが、同じ邪魔者から受けるダメージが大きい', () => {
    const cfg = config({ growthMultiplier: 1, damageRampPerMinute: 2, startLife: 1e6 })
    const base = withNuisance(createGame(cfg), findUserId('static'), 0, 0)
    const early = run(base, cfg, 5)
    const lateStart = { ...base, elapsed: 120 }
    const late = run(lateStart, cfg, 125)
    expect(cfg.startLife - late.life).toBeGreaterThan(cfg.startLife - early.life)
  })

  it('自然回復する。最大ライフを超えない', () => {
    const cfg = config({ regenPerSecond: 5 })
    const hurt = { ...createGame(cfg), life: 50 }
    expect(run(hurt, cfg, 2).life).toBeCloseTo(60, 5)
    expect(run(hurt, cfg, 100).life).toBe(cfg.startLife)
  })
})

describe('advance: 邪魔者の動き', () => {
  const grid: GridSize = { cols: 7, rows: 5 }
  const moveFast = { moveTimer: 0 }

  it('どの種類も、壁の外にも主人公のマスにも出ない', () => {
    const cfg = config({ startLife: 1e6, growthMultiplier: 1.2, growthIntervalSeconds: 5 })
    const kinds: NuisanceKind[] = ['wanderer', 'evader', 'creeper', 'bouncer']
    let state = createGame(cfg, grid)
    kinds.forEach((kind, i) => {
      state = withNuisance(state, findUserId(kind, i * 100), i, 0, { ...moveFast, fuse: null })
    })
    const rng = createRng(12)
    let pending: SpawnRequest[] = []
    for (let t = 1; t <= 60; t++) {
      const r = advance(state, cfg, t, { dx: t % 3 === 0 ? 1 : 0, dy: 0 }, pending, rng)
      state = r.state
      pending = r.pending
      for (const n of state.nuisances) {
        const f = footprintOf(sizeScaleOf(n, cfg))
        expect(n.col).toBeGreaterThanOrEqual(0)
        expect(n.row).toBeGreaterThanOrEqual(0)
        expect(n.col + f).toBeLessThanOrEqual(grid.cols)
        expect(n.row + f).toBeLessThanOrEqual(grid.rows)
      }
    }
  })

  it('evader は、主人公から遠ざかる', () => {
    const cfg = config({ growthMultiplier: 1, startLife: 1e6 })
    const userId = findUserId('evader')
    const state = withNuisance(createGame(cfg, grid), userId, 3, 2, { moveTimer: 0.01 }) // 主人公 (3,2) の隣へずらす
    const placed = { ...state, nuisances: [{ ...state.nuisances[0], col: 4, row: 2, prevCol: 4, prevRow: 2 }] }
    const after = run(placed, cfg, 6)
    const n = after.nuisances[0]
    expect(Math.abs(n.col - after.hero.col) + Math.abs(n.row - after.hero.row)).toBeGreaterThanOrEqual(2)
  })

  it('creeper は、主人公に近づき、隣り合ったら止まる', () => {
    const cfg = config({ growthMultiplier: 1, startLife: 1e6 })
    const userId = findUserId('creeper')
    const state = withNuisance(createGame(cfg, grid), userId, 0, 0, { moveTimer: 0.01 }) // 主人公は (3,2)
    const after = run(state, cfg, 20)
    const n = after.nuisances[0]
    expect(Math.abs(n.col - after.hero.col) + Math.abs(n.row - after.hero.row)).toBe(1)
    const later = run(after, cfg, after.elapsed + 10)
    expect([later.nuisances[0].col, later.nuisances[0].row]).toEqual([n.col, n.row])
  })

  it('static と bomber は、動かない', () => {
    const cfg = config({ growthMultiplier: 1, startLife: 1e6 })
    for (const kind of ['static', 'bomber'] as const) {
      const userId = findUserId(kind)
      const traits = getNuisanceTraits(userId, kind === 'static' ? 0 : 1)
      const state = withNuisance(createGame(cfg, grid), userId, 1, 1, { moveTimer: 0.01, fuse: null, traits })
      const after = run(state, cfg, 30)
      expect(after.nuisances[0].traits.kind).toBe(kind)
      expect([after.nuisances[0].col, after.nuisances[0].row]).toEqual([1, 1])
    }
  })

  it('特殊能力の割合 0 なら、出現した邪魔者はすべて static。100 なら、すべて特殊能力持ち', () => {
    const spawns = Array.from({ length: 30 }, (_, i) => spawn(`user${i}`, 0))
    const none = config({ specialRate: 0, maxNuisances: 100 })
    const all = config({ specialRate: 100, maxNuisances: 100 })
    const a = advance(createGame(none), none, 0.1, NO_INPUT, spawns, createRng(21)).state
    const b = advance(createGame(all), all, 0.1, NO_INPUT, spawns, createRng(21)).state
    expect(a.nuisances.every((n) => n.traits.kind === 'static')).toBe(true)
    expect(b.nuisances.every((n) => n.traits.kind !== 'static')).toBe(true)
  })

  it('bouncer は、壁に当たると向きを変えて動き続ける', () => {
    const cfg = config({ growthMultiplier: 1, startLife: 1e6 })
    const userId = findUserId('bouncer')
    const state = withNuisance(createGame(cfg, grid), userId, 5, 0, { moveTimer: 0.01, dirX: 1, dirY: 0 })
    const interval = state.nuisances[0].traits.moveIntervalSeconds
    // 最初の 1 マスで右端 (col 6) に着き、次の移動で壁に当たって反対向きになる
    const atWall = run(state, cfg, 0.06)
    expect(atWall.nuisances[0].col).toBe(6)
    const bounced = run(state, cfg, 0.06 + interval * 1.5)
    expect(bounced.nuisances[0].dirX).toBe(-1)
    expect(bounced.nuisances[0].col).toBeLessThan(6)
  })
})

describe('advance: ボス', () => {
  const grid: GridSize = { cols: 7, rows: 5 }
  const bossAt = (cfg: NuisanceConfigType, lc: number | undefined, g = grid) =>
    advance(createGame(cfg, g), cfg, 0.1, NO_INPUT, [spawn('boss', 0, lc)], createRng(31)).state

  it('lc が間隔の倍数のコメントだけが、ボスになる', () => {
    const cfg = config({ bossInterval: 10 })
    expect(bossAt(cfg, 10).nuisances[0].traits.kind).toBe('boss')
    expect(bossAt(cfg, 30).nuisances[0].traits.kind).toBe('boss')
    expect(bossAt(cfg, 11).nuisances[0].traits.kind).not.toBe('boss')
    expect(bossAt(cfg, 0).nuisances[0].traits.kind).not.toBe('boss') // 0 は不明
    expect(bossAt(cfg, undefined).nuisances[0].traits.kind).not.toBe('boss')
  })

  it('間隔 0 なら、ボスは出ない', () => {
    expect(bossAt(config({ bossInterval: 0 }), 100).nuisances[0].traits.kind).not.toBe('boss')
  })

  it('上限のときや、大きさぶんの空きがないときは、ボスは出ない (無視する)', () => {
    const capped = config({ bossInterval: 10, maxNuisances: 1 })
    const state = advance(
      createGame(capped, grid),
      capped,
      0.1,
      NO_INPUT,
      [spawn('a', 0, 1), spawn('boss', 0, 10)],
      createRng(32)
    ).state
    expect(state.nuisances.map((n) => n.userId)).toEqual(['a'])
    expect(state.ignoredCount).toBe(1)

    const tiny: GridSize = { cols: 2, rows: 1 } // 主人公 + 空き 1 マスでは、2x2 のボスは入らない
    const none = bossAt(config({ bossInterval: 10 }), 10, tiny)
    expect(none.nuisances).toHaveLength(0)
    expect(none.ignoredCount).toBe(1)
  })

  it('ボスは、主人公に近づき、時間が来ると爆発して消える (主人公のマスには入らない)', () => {
    const cfg = config({ bossInterval: 10, growthMultiplier: 1, startLife: 1e6 })
    let state = bossAt(cfg, 10)
    const boss = state.nuisances[0]
    const start = Math.abs(boss.col - state.hero.col) + Math.abs(boss.row - state.hero.row)
    state = run(state, cfg, 10)
    const near = state.nuisances[0]
    expect(Math.abs(near.col - state.hero.col) + Math.abs(near.row - state.hero.row)).toBeLessThanOrEqual(start)
    state = run(state, cfg, 40)
    expect(state.nuisances).toHaveLength(0)
    expect(state.explodedCount).toBe(1)
  })
})

describe('決定性', () => {
  it('同じ乱数・同じコメントなら、同じ結果になる', () => {
    const cfg = config()
    const spawns = Array.from({ length: 10 }, (_, i) => spawn(`user${i}`, i * 0.7))
    const a = advance(createGame(cfg), cfg, 40, NO_INPUT, spawns, createRng(99)).state
    const b = advance(createGame(cfg), cfg, 40, NO_INPUT, spawns, createRng(99)).state
    expect(a).toEqual(b)
  })
})

describe('advance: 演出用のイベント', () => {
  it('出現すると enemySpawn が返る。上限で無視されたコメントは返らない', () => {
    const cfg = config({ maxNuisances: 1 })
    const r = advance(createGame(cfg), cfg, 1, NO_INPUT, [spawn('a', 0.1), spawn('b', 0.2)], createRng(1))
    expect(r.events.map((e) => e.type)).toEqual(['enemySpawn'])
    expect(r.events[0]).toMatchObject({ type: 'enemySpawn', userId: 'a', isBoss: false })
  })

  it('lc が bossInterval の倍数なら、isBoss が立つ', () => {
    const cfg = config({ bossInterval: 10 })
    const r = advance(createGame(cfg), cfg, 1, NO_INPUT, [spawn('a', 0.1, 10)], createRng(1))
    expect(r.events[0]).toMatchObject({ type: 'enemySpawn', isBoss: true })
  })

  it('爆発すると、cause が exploded の enemyDeath が 1 回だけ返る', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('bomber')
    const fuse = getNuisanceTraits(userId).fuseSeconds!
    const before = withNuisance(createGame(cfg), userId, 2, 3)
    const r = advance(before, cfg, fuse + 1, NO_INPUT, [], createRng(1))
    const deaths = r.events.filter((e) => e.type === 'enemyDeath')
    expect(deaths).toHaveLength(1)
    expect(deaths[0]).toMatchObject({ cause: 'exploded', userId, col: 2, row: 3 })
  })

  it('主人公が壁際まで押し出すと、cause が removed の enemyDeath が返る', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('static')
    let state = withNuisance(createGame(cfg), userId, 0, 0)
    state = { ...state, hero: { col: 1, row: 0, cooldown: 0 } }
    const r = advance(state, cfg, 10, { dx: -1, dy: 0 }, [], createRng(1))
    expect(r.state.removedCount).toBe(1)
    expect(r.events.filter((e) => e.type === 'enemyDeath')).toMatchObject([{ cause: 'removed', userId }])
  })

  it('1 刻みも進まないときは、イベントは空', () => {
    const cfg = config()
    expect(advance(createGame(cfg), cfg, 0).events).toEqual([])
  })
})

const DEFAULT_GRID_FOR_TEST: GridSize = { cols: 11, rows: 8 }

describe('advance: ギフト障害物', () => {
  const gift = (userId: string, price: number, atSeconds = 0): SpawnRequest => ({ ...spawn(userId, atSeconds), giftPrice: price })
  const place = (cfg: NuisanceConfigType, grid: GridSize, state: GameState, ...gifts: SpawnRequest[]) =>
    advance(state, cfg, STEP_SECONDS, NO_INPUT, gifts, createRng(1)).state

  it('ギフトは、邪魔者ではなく障害物になる。金額が大きいほど大きい (0 円も置く)', () => {
    const cfg = config()
    const r = place(cfg, DEFAULT_GRID_FOR_TEST, createGame(cfg), gift('a', 0), gift('b', 500), gift('c', 5000))
    expect(r.nuisances).toHaveLength(0)
    expect(r.obstacles.map((o) => [o.price, o.size])).toEqual([
      [0, 1],
      [500, 2],
      [5000, 3],
    ])
  })

  it('一定時間で消える。主人公のマスには置かれない', () => {
    const cfg = config({ startLife: 1e6 })
    const r = place(cfg, DEFAULT_GRID_FOR_TEST, createGame(cfg), gift('a', 100))
    const o = r.obstacles[0]
    expect(o.col <= r.hero.col && r.hero.col < o.col + o.size && o.row <= r.hero.row && r.hero.row < o.row + o.size).toBe(false)
    expect(run(r, cfg, OBSTACLE_SECONDS - 1).obstacles).toHaveLength(1)
    expect(run(r, cfg, OBSTACLE_SECONDS + 1).obstacles).toHaveLength(0)
  })

  it('同時数の上限を超えたら、古いものから消える', () => {
    const cfg = config()
    const gifts = Array.from({ length: MAX_OBSTACLES + 2 }, (_, i) => gift(`g${i}`, 0))
    const r = place(cfg, DEFAULT_GRID_FOR_TEST, createGame(cfg), ...gifts)
    expect(r.obstacles).toHaveLength(MAX_OBSTACLES)
    expect(r.obstacles[0].userId).toBe('g2')
  })

  it('主人公は障害物のマスに入れない', () => {
    const cfg = config()
    const grid: GridSize = { cols: 5, rows: 3 }
    const base = createGame(cfg, grid) // 主人公 (2,1)
    const state = { ...base, obstacles: [{ id: 99, userId: 'x', userName: 'x', price: 0, col: 3, row: 1, size: 1, placedAt: 0, expiresAt: 100 }] }
    const r = run(state, cfg, 1, { dx: 1, dy: 0 })
    expect([r.hero.col, r.hero.row]).toEqual([2, 1])
  })

  it('押す先に障害物があるときは押せない。主人公も動かない', () => {
    const cfg = config({ growthMultiplier: 1 })
    const grid: GridSize = { cols: 6, rows: 3 }
    let state = withNuisance(createGame(cfg, grid), findUserId('static'), 3, 1) // 主人公 (3,1)? 中央は col 3
    state = { ...state, hero: { col: 2, row: 1, cooldown: 0 } }
    state = { ...state, obstacles: [{ id: 99, userId: 'x', userName: 'x', price: 0, col: 4, row: 1, size: 1, placedAt: 0, expiresAt: 100 }] }
    const r = run(state, cfg, 1, { dx: 1, dy: 0 })
    expect([r.hero.col, r.nuisances[0].col]).toEqual([2, 3])
    expect(r.removedCount).toBe(0)
  })

  it('邪魔者は、障害物のマスには動かない', () => {
    const cfg = config({ growthMultiplier: 1, startLife: 1e6 })
    const grid: GridSize = { cols: 5, rows: 1 }
    let state = withNuisance(createGame(cfg, grid), findUserId('wanderer'), 0, 0, { moveTimer: 0 })
    state = { ...state, hero: { col: 4, row: 0, cooldown: 0 }, obstacles: [{ id: 99, userId: 'x', userName: 'x', price: 0, col: 1, row: 0, size: 1, placedAt: 0, expiresAt: 1e6 }] }
    const r = run(state, cfg, 30)
    expect(r.nuisances[0].col).toBe(0)
  })

  it('主人公が閉じ込められる場所には置かない。置けなければ、金額の表示イベントを返す', () => {
    const cfg = config()
    const grid: GridSize = { cols: 5, rows: 3 } // 15 マスしかなく、20 マス動ける範囲を保てない
    const r = advance(createGame(cfg, grid), cfg, STEP_SECONDS, NO_INPUT, [gift('a', 700)], createRng(1))
    expect(r.state.obstacles).toHaveLength(0)
    expect(r.events).toMatchObject([{ type: 'obstacleSkipped', userName: 'name-a', price: 700 }])
  })

  it('金額が大きいほど、長く残る', () => {
    const cfg = config()
    const r = place(cfg, DEFAULT_GRID_FOR_TEST, createGame(cfg), gift('a', 100), gift('b', 10000))
    const [small, big] = r.obstacles
    expect(big.expiresAt - big.placedAt).toBeGreaterThan(small.expiresAt - small.placedAt)
  })
})

describe('advance: 押し出しのクールダウンとウェーブ', () => {
  const grid: GridSize = { cols: 9, rows: 3 }
  const cfg = config({ growthMultiplier: 1 })

  it('何かを押し出したあとは、長いクールダウンになる。空きマスへ動いただけなら、短い', () => {
    const empty = advance(createGame(cfg, grid), cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1)).state
    expect(empty.hero.cooldown).toBeCloseTo(HERO_MOVE_INTERVAL_SECONDS - 0, 5)
    const base = withNuisance(createGame(cfg, grid), findUserId('static'), 5, 1) // 主人公 (4,1) の右隣
    const pushed = advance(base, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1)).state
    expect(pushed.hero.cooldown).toBeCloseTo(HERO_PUSH_INTERVAL_SECONDS, 5)
  })

  it('連鎖して押すと、後ろのものほど動き出しが遅れる (位置は即座に変わる)', () => {
    let state = createGame(cfg, grid)
    state = withNuisance(state, findUserId('static'), 5, 1)
    state = withNuisance(state, findUserId('static', 100), 6, 1)
    state = withNuisance(state, findUserId('static', 200), 7, 1)
    const r = advance(state, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1)).state
    expect(r.nuisances.map((n) => n.col)).toEqual([6, 7, 8])
    const delays = r.nuisances.map((n) => n.movedAt - r.nuisances[0].movedAt)
    expect(delays[0]).toBeCloseTo(0, 5)
    expect(delays[1]).toBeCloseTo(PUSH_WAVE_DELAY_SECONDS, 5)
    expect(delays[2]).toBeCloseTo(PUSH_WAVE_DELAY_SECONDS * 2, 5)
  })

  it('連鎖の途中で壁の外へ出るものには、演出を遅らせる情報がつく', () => {
    let state = createGame(cfg, grid)
    state = withNuisance(state, findUserId('static'), 7, 1)
    state = withNuisance(state, findUserId('static', 100), 8, 1) // 右端
    state = { ...state, hero: { col: 6, row: 1, cooldown: 0 } }
    const r = advance(state, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1))
    expect(r.events).toMatchObject([
      { type: 'enemyDeath', cause: 'removed', col: 8, row: 1, pushDx: 1, pushDy: 0, delaySeconds: PUSH_WAVE_DELAY_SECONDS },
    ])
  })
})

describe('advance: コメントの文字 (ことば)', () => {
  const grid: GridSize = { cols: 9, rows: 4 }
  const cfg = config({ growthMultiplier: 1 })
  const comment = (text: string, userId = 'a', atSeconds = 0): SpawnRequest => ({ ...spawn(userId, atSeconds), comment: text })
  const first = (spawns: SpawnRequest[], state = createGame(cfg, grid)) =>
    advance(state, cfg, STEP_SECONDS, NO_INPUT, spawns, createRng(1))

  it('文字数に応じて降ってくる (5 文字ごとに 1 つ。上限あり)', () => {
    expect(first([comment('あ')]).state.words).toHaveLength(1)
    expect(first([comment('あいうえお')]).state.words).toHaveLength(1)
    expect(first([comment('あいうえおか')]).state.words).toHaveLength(2)
    expect(first([comment('あ'.repeat(500))]).state.words).toHaveLength(WORD_MAX_PER_COMMENT)
    expect(first([comment('あいうえおかきくけこ')]).state.words.map((w) => w.text)).toEqual(['あいうえお', 'かきくけこ'])
  })

  it('空白だけ・本文なし・ギフトのコメントでは降らない', () => {
    expect(first([comment('  \n ')]).state.words).toHaveLength(0)
    expect(first([spawn('a')]).state.words).toHaveLength(0)
    expect(first([{ ...comment('ありがとう'), giftPrice: 100 }]).state.words).toHaveLength(0)
  })

  it('邪魔者の上限で無視されても、ことばは降る。ダメージ・貢献度・出現数には関わらない', () => {
    const limited = config({ growthMultiplier: 1, maxNuisances: 1 })
    const r = advance(createGame(limited, grid), limited, STEP_SECONDS, NO_INPUT, [comment('こんにちは'), comment('こんばんは', 'b')], createRng(1))
    expect(r.state.nuisances).toHaveLength(1)
    expect(r.state.ignoredCount).toBe(1)
    expect(r.state.words).toHaveLength(2)
    expect(r.events.filter((e) => e.type === 'wordSpawn')).toHaveLength(2)
    const onlyWords = advance(createGame(cfg, grid), cfg, 5, NO_INPUT, [], createRng(1)).state
    expect(onlyWords.life).toBe(cfg.startLife)
  })

  it('消える時間は、5〜20 秒のランダム。時間が来ると消える', () => {
    const r = first([comment('あ'.repeat(25))]).state
    for (const w of r.words) {
      expect(w.expiresAt - 0).toBeGreaterThanOrEqual(WORD_SECONDS_MIN)
      expect(w.expiresAt - 0).toBeLessThanOrEqual(WORD_SECONDS_MAX + STEP_SECONDS)
    }
    const later = advance(r, cfg, WORD_SECONDS_MAX + 1, NO_INPUT, [], createRng(1)).state
    expect(later.words).toHaveLength(0)
  })

  it('同時に出せる数には上限があり、超えたら古いものから消える', () => {
    const many = Array.from({ length: 12 }, (_, i) => comment('あ'.repeat(25), `u${i}`))
    const r = first(many).state
    expect(r.words.length).toBeLessThanOrEqual(WORD_MAX)
    const ids = r.words.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('空きマスにだけ降る (主人公・邪魔者・ことばと重ならない)', () => {
    const r = first([comment('あ'.repeat(25))]).state
    const cells = r.words.map((w) => `${w.col},${w.row}`)
    expect(new Set(cells).size).toBe(cells.length)
    expect(cells).not.toContain(`${r.hero.col},${r.hero.row}`)
  })

  it('主人公が押し出せる。連鎖して邪魔者も押す。盤面の外へ出ても、撃破数・得点には数えない', () => {
    let state = createGame(cfg, grid) // 主人公 (4,2)
    state = {
      ...state,
      words: [{ id: 900, userId: 'w', text: 'ことば', col: 5, row: 2, prevCol: 5, prevRow: 2, movedAt: 0, expiresAt: 1e6 }],
    }
    state = withNuisance(state, findUserId('static'), 6, 2)
    const r = advance(state, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1)).state
    expect(r.words[0].col).toBe(6)
    expect(r.nuisances[0].col).toBe(7)
    expect(r.hero.cooldown).toBeCloseTo(HERO_PUSH_INTERVAL_SECONDS, 5)

    // 壁際で押す
    const edge = {
      ...createGame(cfg, grid),
      hero: { col: 7, row: 2, cooldown: 0 },
      words: [{ id: 901, userId: 'w', text: 'ことば', col: 8, row: 2, prevCol: 8, prevRow: 2, movedAt: 0, expiresAt: 1e6 }],
    }
    const out = advance(edge, cfg, STEP_SECONDS, { dx: 1, dy: 0 }, [], createRng(1))
    expect(out.state.words).toHaveLength(0)
    expect(out.state.removedCount).toBe(0)
    expect(out.events).toMatchObject([{ type: 'wordGone', id: 901, pushDx: 1, pushDy: 0 }])
  })
})
