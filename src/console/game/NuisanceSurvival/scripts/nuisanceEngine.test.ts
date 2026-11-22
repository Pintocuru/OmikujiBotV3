// src/console/game/NuisanceSurvival/scripts/nuisanceEngine.test.ts
import { describe, expect, it } from 'vitest'
import { createDefaultConfig, type NuisanceConfigType } from './nuisanceConfig'
import {
  HERO_MOVE_INTERVAL_SECONDS,
  HERO_PUSH_INTERVAL_SECONDS,
  MAX_FOOTPRINT,
  MAX_OBSTACLES,
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
  coefficientOf,
  createGame,
  footprintOf,
  getContributionRanking,
  sizeScaleOf,
  type GameState,
  type GridSize,
  type Nuisance,
  type SpawnRequest,
  type Word,
} from './nuisanceEngine'
import { NO_INPUT } from './heroInput'
import { getBossTraits, getNuisanceTraits } from './nuisanceTraits'
import { createRng } from './rng'

/** 係数は下がらず、時間が増える・減るのが分かりやすい設定 */
const config = (overrides: Partial<NuisanceConfigType> = {}): NuisanceConfigType => ({
  ...createDefaultConfig(),
  coefficientDropPerMinute: 0,
  ...overrides,
})

const spawn = (userId: string, atSeconds = 0, lc?: number, extra: Partial<SpawnRequest> = {}): SpawnRequest => ({
  atSeconds,
  lc,
  userId,
  userName: `name-${userId}`,
  profileImage: '',
  ...extra,
})

/** アイコンを 1 つ、指定のマスに置いた状態にする (出現を経由しない) */
const withNuisance = (state: GameState, userId: string, col: number, row: number, boss = false): GameState => {
  const nuisance: Nuisance = {
    id: state.nextId,
    userId,
    userName: `name-${userId}`,
    profileImage: '',
    traits: boss ? getBossTraits(userId) : getNuisanceTraits(userId),
    col,
    row,
    prevCol: col,
    prevRow: row,
    movedAt: 0,
  }
  return { ...state, nextId: state.nextId + 1, nuisances: [...state.nuisances, nuisance] }
}

/** ことばを 1 つ、指定のマスに置いた状態にする */
const withWord = (state: GameState, userId: string, col: number, row: number, patch: Partial<Word> = {}): GameState => {
  const word: Word = {
    id: state.nextId,
    userId,
    userName: `name-${userId}`,
    profileImage: '',
    text: 'ことば',
    col,
    row,
    prevCol: col,
    prevRow: row,
    movedAt: 0,
    expiresAt: 1e6,
    lifeSeconds: 1e6,
    ...patch,
  }
  return { ...state, nextId: state.nextId + 1, words: [...state.words, word] }
}

const run = (state: GameState, cfg: NuisanceConfigType, seconds: number, input = NO_INPUT, seed = 1) =>
  advance(state, cfg, seconds, input, [], createRng(seed)).state

const RIGHT = { dx: 1, dy: 0 }

describe('sizeScaleOf / footprintOf', () => {
  it('アイコンは成長しない。ボスだけが大きい', () => {
    const n = { traits: getNuisanceTraits('a') }
    expect(sizeScaleOf(n)).toBe(n.traits.baseSize)
    expect(footprintOf(sizeScaleOf(n))).toBe(1)
    expect(footprintOf(sizeScaleOf({ traits: getBossTraits('a') }))).toBe(2)
  })

  it('占めるマスは 1〜MAX_FOOTPRINT', () => {
    expect(footprintOf(0.8)).toBe(1)
    expect(footprintOf(1.4)).toBe(1)
    expect(footprintOf(1.5)).toBe(2)
    expect(footprintOf(99)).toBe(MAX_FOOTPRINT)
  })
})

describe('coefficientOf', () => {
  it('1 から始まり、1 分ごとに指定の割合ずつ下がる。下限を下回らない', () => {
    const cfg = config({ coefficientDropPerMinute: 10, coefficientFloorPercent: 40 })
    expect(coefficientOf(0, 0, cfg)).toBe(1)
    expect(coefficientOf(60, 0, cfg)).toBeCloseTo(0.9)
    expect(coefficientOf(180, 0, cfg)).toBeCloseTo(0.7)
    expect(coefficientOf(9999, 0, cfg)).toBeCloseTo(0.4)
  })

  it('リセットした時刻から数え直す', () => {
    const cfg = config({ coefficientDropPerMinute: 10 })
    expect(coefficientOf(180, 150, cfg)).toBeCloseTo(0.95)
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
    const spawns = ['a', 'b', 'c', 'd'].map((id) => spawn(id))
    const next = advance(createGame(cfg), cfg, 0.1, NO_INPUT, spawns, createRng(2)).state
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

  it('アイコンは動かない (何秒たっても、同じマスにいる)', () => {
    const cfg = config()
    const first = advance(createGame(cfg), cfg, 0.1, NO_INPUT, [spawn('a'), spawn('b')], createRng(4)).state
    const later = run(first, cfg, 60)
    expect(later.nuisances.map((n) => [n.col, n.row])).toEqual(first.nuisances.map((n) => [n.col, n.row]))
  })
})

describe('advance: 残り時間 (追いつき・ゲームオーバー)', () => {
  it('残り時間は、最大から始まり、1 秒ごとに 1 秒減る', () => {
    const cfg = config({ maxSeconds: 600 })
    const state = createGame(cfg)
    expect(state.timeLeft).toBe(600)
    expect(run(state, cfg, 30).timeLeft).toBeCloseTo(570, 1)
  })

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
    expect(state.timeLeft).toBeCloseTo(once.state.timeLeft)
    expect(state.nuisances.map((n) => [n.userId, n.col, n.row])).toEqual(
      once.state.nuisances.map((n) => [n.userId, n.col, n.row])
    )
  })

  it('残り時間が 0 になるとゲームオーバー。終了時刻は、0 になった時刻', () => {
    const cfg = config({ maxSeconds: 60 })
    const r = advance(createGame(cfg), cfg, 600, NO_INPUT, [spawn('a', 1)], createRng(6))
    expect(r.state.over).toBe(true)
    expect(r.state.timeLeft).toBe(0)
    expect(r.state.endedAt!).toBeCloseTo(60, 1)
    expect(r.state.elapsed).toBe(r.state.endedAt)
    expect(r.pending).toEqual([])
  })

  it('ゲームオーバーのあとは、何も変わらない', () => {
    const cfg = config({ maxSeconds: 60 })
    const over = advance(createGame(cfg), cfg, 120, NO_INPUT, [spawn('a')], createRng(7)).state
    expect(over.over).toBe(true)
    expect(advance(over, cfg, 240, NO_INPUT, [spawn('c')], createRng(7)).state).toBe(over)
  })

  it('刻みの上限で止まったら、reachedStepLimit が立つ。続きを呼べば追いつく', () => {
    const cfg = config({ maxSeconds: 3600 })
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

describe('advance: 主人公の移動と得点', () => {
  const grid: GridSize = { cols: 9, rows: 3 }

  it('キーを押している間、一定の間隔で 1 マスずつ動き、壁で止まる', () => {
    const cfg = config()
    const state = createGame(cfg, grid) // 主人公 (4,1)
    const r = run(state, cfg, HERO_MOVE_INTERVAL_SECONDS * 2.5, RIGHT)
    expect(r.hero.col).toBe(4 + 3) // 最初の 1 マスは、待たずに動く
    expect(run(state, cfg, 5, RIGHT).hero.col).toBe(8)
  })

  it('アイコンにぶつかると、1 マス押し出される (主人公は進む)。外へ出ない押し出しは、得点にならない', () => {
    const cfg = config()
    const state = withNuisance(createGame(cfg, grid), 'a', 5, 1)
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1))
    expect([r.state.hero.col, r.state.nuisances[0].col]).toEqual([5, 6])
    expect(r.state.hero.cooldown).toBeCloseTo(HERO_MOVE_INTERVAL_SECONDS, 5)
    expect(r.events).toEqual([])
    expect(r.state.removedCount).toBe(0)
  })

  it('画面の外へ押し出すと得点。残り時間が、獲得秒数だけ増える', () => {
    const cfg = config({ iconSeconds: 5 })
    let state = withNuisance(createGame(cfg, grid), 'a', 8, 1)
    state = { ...state, hero: { col: 7, row: 1, cooldown: 0 }, timeLeft: 100 }
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1))
    expect(r.state.nuisances).toHaveLength(0)
    expect(r.state.removedCount).toBe(1)
    expect(r.state.timeLeft).toBeCloseTo(100 + 5 - STEP_SECONDS)
    expect(r.state.chain).toBe(1)
    expect(r.state.contributions.a.seconds).toBeCloseTo(5)
    expect(r.state.hero.cooldown).toBeCloseTo(HERO_PUSH_INTERVAL_SECONDS, 5) // 得点のあとだけ、長いクールダウン
    expect(r.events).toMatchObject([
      { type: 'enemyDeath', cause: 'removed', col: 8, row: 1 },
      {
        type: 'score',
        source: 'nuisance',
        userId: 'a',
        seconds: 5,
        applied: 5,
        chain: 1,
        chainTotal: 5,
        coefficient: 1,
      },
    ])
  })

  it('ことばを押し出すと、ことばの獲得秒数が増える。撃破数 (アイコン) には数えない', () => {
    const cfg = config({ wordSeconds: 1 })
    let state = withWord(createGame(cfg, grid), 'w', 8, 1)
    state = { ...state, hero: { col: 7, row: 1, cooldown: 0 }, timeLeft: 100 }
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1))
    expect(r.state.words).toHaveLength(0)
    expect(r.state.removedCount).toBe(0)
    expect(r.state.removedWordCount).toBe(1)
    expect(r.state.timeLeft).toBeCloseTo(100 + 1 - STEP_SECONDS)
    expect(r.events).toMatchObject([
      { type: 'wordGone', id: expect.any(Number), pushDx: 1, pushDy: 0 },
      { type: 'score', source: 'word', seconds: 1, chain: 1 },
    ])
  })

  it('連続で押し出すと連鎖が増え、獲得秒数 × 連鎖数になる (止まっていても切れない)', () => {
    const cfg = config({ iconSeconds: 5 })
    let state = createGame(cfg, grid)
    state = withNuisance(state, 'a', 8, 1)
    state = withNuisance(state, 'b', 7, 1)
    state = { ...state, hero: { col: 6, row: 1, cooldown: 0 }, timeLeft: 100 }
    // 1 回目: 先頭の a が外へ (連鎖 1 = 5 秒)。b は詰まる。0.5 秒あけて 2 回目: b が外へ (連鎖 2 = 10 秒)
    const r = advance(state, cfg, 1, RIGHT, [], createRng(1))
    const scores = r.events.filter((e) => e.type === 'score')
    expect(scores.map((e) => e.type === 'score' && [e.chain, e.seconds])).toEqual([
      [1, 5],
      [2, 10],
    ])
    expect(r.state.chain).toBe(2)
    expect(r.state.bestChain).toBe(2)
    expect(r.state.chainTotal).toBeCloseTo(15)
    expect(r.state.gainedSeconds).toBeCloseTo(15)

    // 動かずに待っても、連鎖は切れない
    const waited = run(r.state, cfg, r.state.elapsed + 10)
    expect(waited.chain).toBe(2)
  })

  it('得点しない動きをすると、連鎖が切れる (chainBreak)', () => {
    const cfg = config()
    let state = createGame(cfg, grid)
    state = { ...state, chain: 3, chainTotal: 30, bestChain: 3 }
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1)) // 空きマスへ動いただけ
    expect(r.state.chain).toBe(0)
    expect(r.state.chainTotal).toBe(0)
    expect(r.state.bestChain).toBe(3)
    expect(r.events).toEqual([{ type: 'chainBreak', chain: 3, total: 30 }])
  })

  it('壁や障害物で動けないときは、動いたことにならない (連鎖は切れない)', () => {
    const cfg = config()
    let state = createGame(cfg, grid)
    state = { ...state, hero: { col: 8, row: 1, cooldown: 0 }, chain: 2 }
    expect(run(state, cfg, 1, RIGHT).chain).toBe(2)
  })

  it('壁際のアイコンの後ろを押して、先頭だけが撃破される。後ろは詰まる', () => {
    const cfg = config()
    let state = createGame(cfg, grid)
    state = withNuisance(state, 'a', 8, 1)
    state = withNuisance(state, 'b', 7, 1)
    state = { ...state, hero: { col: 6, row: 1, cooldown: 0 } }
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1)).state
    expect(r.removedCount).toBe(1)
    expect(r.nuisances.map((n) => [n.userId, n.col])).toEqual([['b', 8]])
  })

  it('得点のクールダウン中は、動けない。クールダウンが終われば動ける', () => {
    const cfg = config()
    let state = withNuisance(createGame(cfg, grid), 'a', 8, 1)
    state = { ...state, hero: { col: 7, row: 1, cooldown: 0 } }
    const scored = advance(state, cfg, STEP_SECONDS, { dx: -1, dy: 0 }, [], createRng(1)) // 左へ動くだけ (得点なし)
    expect(scored.state.hero.col).toBe(6)
    const after = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1)).state
    expect(after.hero.cooldown).toBeCloseTo(HERO_PUSH_INTERVAL_SECONDS, 5)
    expect(run(after, cfg, after.elapsed + 0.3, { dx: -1, dy: 0 }).hero.col).toBe(after.hero.col)
    expect(run(after, cfg, after.elapsed + HERO_PUSH_INTERVAL_SECONDS + 0.1, { dx: -1, dy: 0 }).hero.col).toBeLessThan(
      after.hero.col
    )
  })

  it('係数が下がっていると、得点も減る。残り時間の上限を超えては増えない', () => {
    const cfg = config({ iconSeconds: 10, coefficientDropPerMinute: 10, maxSeconds: 60 })
    let state = withNuisance(createGame(cfg, grid), 'a', 8, 1)
    state = { ...state, hero: { col: 7, row: 1, cooldown: 0 }, elapsed: 300, timeLeft: 58 } // 5 分で、係数は 0.5
    const r = advance(state, cfg, 300 + STEP_SECONDS, RIGHT, [], createRng(1))
    expect(r.events).toMatchObject([
      { type: 'enemyDeath' },
      { type: 'score', seconds: 5, applied: 2, coefficient: 0.5 }, // 10 × 1 × 0.5 = 5 秒だが、上限まであと 2 秒
    ])
    expect(r.state.timeLeft).toBeCloseTo(60 - STEP_SECONDS)
    expect(r.state.contributions.a.seconds).toBeCloseTo(5) // 貢献度は、上限で切られる前の秒数
  })

  it('貢献度の順位は、生んだ秒数の多い順', () => {
    const cfg = config({ iconSeconds: 5 })
    let state = createGame(cfg, grid)
    state = withNuisance(state, 'a', 8, 1)
    state = withNuisance(state, 'b', 7, 1)
    state = { ...state, hero: { col: 6, row: 1, cooldown: 0 }, timeLeft: 100 }
    const r = advance(state, cfg, 1, RIGHT, [], createRng(1)).state
    expect(getContributionRanking(r).map((c) => [c.userId, Math.round(c.seconds)])).toEqual([
      ['b', 10],
      ['a', 5],
    ])
  })
})

describe('advance: 初見さんで係数が戻る', () => {
  it('isFirst のコメントが届くと、その時刻から係数が 1 に戻る。目立って下がっていたときだけ、イベントが返る', () => {
    const cfg = config({ coefficientDropPerMinute: 10 })
    const state = { ...createGame(cfg), elapsed: 120, timeLeft: 100 }
    const r = advance(state, cfg, 121, NO_INPUT, [spawn('a', 120.5, undefined, { isFirst: true })], createRng(1))
    expect(r.state.coefficientResetAt).toBeGreaterThan(120.3) // コメントが届いた刻み
    expect(r.state.coefficientResetAt).toBeLessThanOrEqual(120.5 + STEP_SECONDS)
    expect(coefficientOf(r.state.elapsed, r.state.coefficientResetAt, cfg)).toBeGreaterThan(0.99)
    expect(r.events).toContainEqual({ type: 'coefficientReset', userName: 'name-a' })

    // 下がっていないとき (開始直後) は、イベントなし
    const fresh = advance(
      createGame(cfg),
      cfg,
      1,
      NO_INPUT,
      [spawn('b', 0.2, undefined, { isFirst: true })],
      createRng(1)
    )
    expect(fresh.events.some((e) => e.type === 'coefficientReset')).toBe(false)
  })

  it('アイコンが上限で出なくても、ギフトでも、初見なら戻る。初見でなければ戻らない', () => {
    const cfg = config({ coefficientDropPerMinute: 10, maxNuisances: 1 })
    const state = { ...createGame(cfg), elapsed: 120, timeLeft: 100, nuisances: [] as Nuisance[] }
    const full = withNuisance(state, 'x', 0, 0)
    const ignored = advance(
      full,
      cfg,
      121,
      NO_INPUT,
      [spawn('a', 120.5, undefined, { isFirst: true })],
      createRng(1)
    ).state
    expect(ignored.ignoredCount).toBe(1)
    expect(ignored.coefficientResetAt).toBeGreaterThan(120)
    const gift = advance(
      state,
      cfg,
      121,
      NO_INPUT,
      [spawn('b', 120.5, undefined, { isFirst: true, giftPrice: 100 })],
      createRng(1)
    ).state
    expect(gift.coefficientResetAt).toBeGreaterThan(120)
    const notFirst = advance(state, cfg, 121, NO_INPUT, [spawn('c', 120.5)], createRng(1)).state
    expect(notFirst.coefficientResetAt).toBe(0)
  })
})

describe('advance: ボス', () => {
  const grid: GridSize = { cols: 7, rows: 5 }
  const bossAt = (cfg: NuisanceConfigType, lc: number | undefined, g = grid) =>
    advance(createGame(cfg, g), cfg, 0.1, NO_INPUT, [spawn('boss', 0, lc)], createRng(31)).state

  it('lc が間隔の倍数のコメントだけが、ボスになる。ボスは大きい', () => {
    const cfg = config({ bossInterval: 10 })
    expect(bossAt(cfg, 10).nuisances[0].traits.kind).toBe('boss')
    expect(bossAt(cfg, 30).nuisances[0].traits.kind).toBe('boss')
    expect(bossAt(cfg, 11).nuisances[0].traits.kind).toBe('static')
    expect(bossAt(cfg, 0).nuisances[0].traits.kind).toBe('static') // 0 は不明
    expect(bossAt(cfg, undefined).nuisances[0].traits.kind).toBe('static')
    const boss = bossAt(cfg, 10).nuisances[0]
    expect(footprintOf(sizeScaleOf(boss))).toBe(2)
  })

  it('間隔 0 なら、ボスは出ない', () => {
    expect(bossAt(config({ bossInterval: 0 }), 100).nuisances[0].traits.kind).toBe('static')
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

  it('ボスは動かず、爆発もしない。押し出すと、アイコンと同じ秒数になる', () => {
    const cfg = config({ bossInterval: 10, iconSeconds: 5 })
    const state = bossAt(cfg, 10)
    const boss = state.nuisances[0]
    const later = run(state, cfg, 120)
    expect(later.nuisances.map((n) => [n.col, n.row])).toEqual([[boss.col, boss.row]])
    expect(later.over).toBe(false)
  })

  it('大きいボスは、押し出すとき、触れた全体が動く (2 マスぶん)', () => {
    const cfg = config({ iconSeconds: 5 })
    const grid2: GridSize = { cols: 9, rows: 5 }
    let state = withNuisance(createGame(cfg, grid2), 'boss', 6, 1, true) // 2x2: (6..7, 1..2)
    state = { ...state, hero: { col: 5, row: 1, cooldown: 0 }, timeLeft: 100 }
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1)).state
    expect([r.hero.col, r.nuisances[0].col]).toEqual([6, 7])
  })
})

describe('決定性', () => {
  it('同じ乱数・同じコメントなら、同じ結果になる', () => {
    const cfg = config()
    const spawns = [spawn('a', 0.5), spawn('b', 2, 100), spawn('c', 4)]
    const a = advance(createGame(cfg), cfg, 20, RIGHT, spawns, createRng(77)).state
    const b = advance(createGame(cfg), cfg, 20, RIGHT, spawns, createRng(77)).state
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })
})

describe('advance: 演出用のイベント', () => {
  it('出現すると enemySpawn が返る。上限で無視されたコメントは返らない', () => {
    const cfg = config({ maxNuisances: 1 })
    const r = advance(createGame(cfg), cfg, 0.1, NO_INPUT, [spawn('a'), spawn('b')], createRng(1))
    const spawns = r.events.filter((e) => e.type === 'enemySpawn')
    expect(spawns).toHaveLength(1)
    expect(spawns[0]).toMatchObject({ userId: 'a', isBoss: false, kind: 'static' })
  })

  it('lc が bossInterval の倍数なら、isBoss が立つ', () => {
    const cfg = config({ bossInterval: 10 })
    const r = advance(createGame(cfg), cfg, 0.1, NO_INPUT, [spawn('a', 0, 10)], createRng(1))
    expect(r.events).toMatchObject([{ type: 'enemySpawn', isBoss: true, kind: 'boss' }])
  })

  it('1 刻みも進まないときは、イベントは空', () => {
    const cfg = config()
    expect(advance(createGame(cfg), cfg, 0.01, NO_INPUT, [spawn('a')], createRng(1)).events).toEqual([])
  })
})

describe('advance: ギフト障害物', () => {
  const grid: GridSize = { cols: 11, rows: 8 }
  const gift = (userId: string, price: number, atSeconds = 0): SpawnRequest => ({
    ...spawn(userId, atSeconds),
    giftPrice: price,
  })
  const place = (cfg: NuisanceConfigType, state: GameState, ...gifts: SpawnRequest[]) =>
    advance(state, cfg, STEP_SECONDS, NO_INPUT, gifts, createRng(1)).state

  it('ギフトは、アイコンではなく障害物になる。金額が大きいほど大きい (0 円も置く)', () => {
    const cfg = config()
    const r = place(cfg, createGame(cfg, grid), gift('a', 0), gift('b', 500), gift('c', 5000))
    expect(r.nuisances).toHaveLength(0)
    expect(r.obstacles.map((o) => [o.price, o.size])).toEqual([
      [0, 1],
      [500, 2],
      [5000, 3],
    ])
  })

  it('一定時間で消える。主人公のマスには置かれない', () => {
    const cfg = config({ maxSeconds: 3600 })
    const r = place(cfg, createGame(cfg, grid), gift('a', 100))
    const o = r.obstacles[0]
    expect(
      o.col <= r.hero.col && r.hero.col < o.col + o.size && o.row <= r.hero.row && r.hero.row < o.row + o.size
    ).toBe(false)
    expect(run(r, cfg, OBSTACLE_SECONDS - 1).obstacles).toHaveLength(1)
    expect(run(r, cfg, OBSTACLE_SECONDS + 1).obstacles).toHaveLength(0)
  })

  it('同時数の上限を超えたら、古いものから消える', () => {
    const cfg = config()
    const gifts = Array.from({ length: MAX_OBSTACLES + 2 }, (_, i) => gift(`g${i}`, 0))
    const r = place(cfg, createGame(cfg, grid), ...gifts)
    expect(r.obstacles).toHaveLength(MAX_OBSTACLES)
    expect(r.obstacles[0].userId).toBe('g2')
  })

  it('主人公は障害物のマスに入れない', () => {
    const cfg = config()
    const small: GridSize = { cols: 5, rows: 3 }
    const base = createGame(cfg, small) // 主人公 (2,1)
    const state = {
      ...base,
      obstacles: [
        { id: 99, userId: 'x', userName: 'x', price: 0, col: 3, row: 1, size: 1, placedAt: 0, expiresAt: 100 },
      ],
    }
    const r = run(state, cfg, 1, RIGHT)
    expect([r.hero.col, r.hero.row]).toEqual([2, 1])
  })

  it('押す先に障害物があるときは押せない。主人公も動かない', () => {
    const cfg = config()
    const g: GridSize = { cols: 6, rows: 3 }
    let state = withNuisance(createGame(cfg, g), 'a', 3, 1)
    state = { ...state, hero: { col: 2, row: 1, cooldown: 0 } }
    state = {
      ...state,
      obstacles: [
        { id: 99, userId: 'x', userName: 'x', price: 0, col: 4, row: 1, size: 1, placedAt: 0, expiresAt: 100 },
      ],
    }
    const r = run(state, cfg, 1, RIGHT)
    expect([r.hero.col, r.nuisances[0].col]).toEqual([2, 3])
    expect(r.removedCount).toBe(0)
  })

  it('主人公が閉じ込められる場所には置かない。置けなければ、金額の表示イベントを返す', () => {
    const cfg = config()
    const small: GridSize = { cols: 5, rows: 3 } // 15 マスしかなく、20 マス動ける範囲を保てない
    const r = advance(createGame(cfg, small), cfg, STEP_SECONDS, NO_INPUT, [gift('a', 700)], createRng(1))
    expect(r.state.obstacles).toHaveLength(0)
    expect(r.events).toMatchObject([{ type: 'obstacleSkipped', userName: 'name-a', price: 700 }])
  })

  it('金額が大きいほど、長く残る', () => {
    const cfg = config()
    const r = place(cfg, createGame(cfg, grid), gift('a', 100), gift('b', 10000))
    const [small, big] = r.obstacles
    expect(big.expiresAt - big.placedAt).toBeGreaterThan(small.expiresAt - small.placedAt)
  })
})

describe('advance: 連鎖して押す (ウェーブ)', () => {
  const grid: GridSize = { cols: 9, rows: 3 }
  const cfg = config()

  it('連鎖して押すと、後ろのものほど動き出しが遅れる (位置は即座に変わる)', () => {
    let state = createGame(cfg, grid)
    state = withNuisance(state, 'a', 5, 1)
    state = withNuisance(state, 'b', 6, 1)
    state = withNuisance(state, 'c', 7, 1)
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1)).state
    expect(r.nuisances.map((n) => n.col)).toEqual([6, 7, 8])
    const delays = r.nuisances.map((n) => n.movedAt - r.nuisances[0].movedAt)
    expect(delays[0]).toBeCloseTo(0, 5)
    expect(delays[1]).toBeCloseTo(PUSH_WAVE_DELAY_SECONDS, 5)
    expect(delays[2]).toBeCloseTo(PUSH_WAVE_DELAY_SECONDS * 2, 5)
  })

  it('連鎖の途中で壁の外へ出るものには、演出を遅らせる情報がつく', () => {
    let state = createGame(cfg, grid)
    state = withNuisance(state, 'a', 7, 1)
    state = withNuisance(state, 'b', 8, 1) // 右端
    state = { ...state, hero: { col: 6, row: 1, cooldown: 0 } }
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1))
    expect(r.events[0]).toMatchObject({
      type: 'enemyDeath',
      cause: 'removed',
      col: 8,
      row: 1,
    })
    // 先頭 (壁際) は、押された順の最後なので、ウェーブの遅れが 1 段ぶんつく
    expect(r.events[0]).toMatchObject({ pushDx: 1, pushDy: 0, delaySeconds: PUSH_WAVE_DELAY_SECONDS })
  })
})

describe('advance: コメントの文字 (ことば)', () => {
  const grid: GridSize = { cols: 9, rows: 4 }
  const cfg = config()
  const comment = (text: string, userId = 'a', atSeconds = 0): SpawnRequest => ({
    ...spawn(userId, atSeconds),
    comment: text,
  })
  const first = (spawns: SpawnRequest[], state = createGame(cfg, grid)) =>
    advance(state, cfg, STEP_SECONDS, NO_INPUT, spawns, createRng(1))

  it('文字数に応じて降ってくる (5 文字ごとに 1 つ。上限あり)', () => {
    expect(first([comment('あ')]).state.words).toHaveLength(1)
    expect(first([comment('あいうえお')]).state.words).toHaveLength(1)
    expect(first([comment('あいうえおか')]).state.words).toHaveLength(2)
    expect(first([comment('あ'.repeat(500))]).state.words).toHaveLength(WORD_MAX_PER_COMMENT)
    expect(first([comment('あいうえおかきくけこ')]).state.words.map((w) => w.text)).toEqual([
      'あいうえお',
      'かきくけこ',
    ])
  })

  it('空白だけ・本文なし・ギフトのコメントでは降らない', () => {
    expect(first([comment('  \n ')]).state.words).toHaveLength(0)
    expect(first([spawn('a')]).state.words).toHaveLength(0)
    expect(first([{ ...comment('ありがとう'), giftPrice: 100 }]).state.words).toHaveLength(0)
  })

  it('アイコンが上限で無視されても、ことばは降る', () => {
    const limited = config({ maxNuisances: 1 })
    const r = advance(
      createGame(limited, grid),
      limited,
      STEP_SECONDS,
      NO_INPUT,
      [comment('こんにちは'), comment('こんばんは', 'b')],
      createRng(1)
    )
    expect(r.state.nuisances).toHaveLength(1)
    expect(r.state.ignoredCount).toBe(1)
    expect(r.state.words).toHaveLength(2)
    expect(r.events.filter((e) => e.type === 'wordSpawn')).toHaveLength(2)
  })

  it('消える時間は、5〜20 秒のランダム。時間が来ると消える (降ってからの長さも持つ。円グラフ用)', () => {
    const r = first([comment('あ'.repeat(25))]).state
    for (const w of r.words) {
      expect(w.lifeSeconds).toBeGreaterThanOrEqual(WORD_SECONDS_MIN)
      expect(w.lifeSeconds).toBeLessThanOrEqual(WORD_SECONDS_MAX)
      expect(w.expiresAt).toBeCloseTo(r.elapsed - STEP_SECONDS + w.lifeSeconds, 5)
      expect(w.expiresAt).toBeGreaterThanOrEqual(WORD_SECONDS_MIN)
      expect(w.expiresAt).toBeLessThanOrEqual(WORD_SECONDS_MAX + STEP_SECONDS)
    }
    const later = run(r, { ...cfg, maxSeconds: 3600 }, WORD_SECONDS_MAX + 1)
    expect(later.words).toHaveLength(0)
  })

  it('同時に出せる数には上限があり、超えたら古いものから消える', () => {
    const many = Array.from({ length: 12 }, (_, i) => comment('あ'.repeat(25), `u${i}`))
    const r = first(many).state
    expect(r.words.length).toBeLessThanOrEqual(WORD_MAX)
    const ids = r.words.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('空きマスにだけ降る (主人公・アイコン・ことばと重ならない)', () => {
    const r = first([comment('あ'.repeat(25))]).state
    const cells = r.words.map((w) => `${w.col},${w.row}`)
    expect(new Set(cells).size).toBe(cells.length)
    expect(cells).not.toContain(`${r.hero.col},${r.hero.row}`)
  })

  it('主人公が押し出せる。連鎖してアイコンも押す', () => {
    let state = createGame(cfg, grid) // 主人公 (4,2)
    state = withWord(state, 'w', 5, 2)
    state = withNuisance(state, 'a', 6, 2)
    const r = advance(state, cfg, STEP_SECONDS, RIGHT, [], createRng(1)).state
    expect(r.words[0].col).toBe(6)
    expect(r.nuisances[0].col).toBe(7)
    expect(r.hero.cooldown).toBeCloseTo(HERO_MOVE_INTERVAL_SECONDS, 5) // 外へ出ていないので、得点なし
  })

  it('ことばが連鎖に加わると、連鎖が伸びる (先頭のアイコンが外へ出て、ことばは詰まる)', () => {
    let state = createGame(cfg, grid)
    state = withNuisance(state, 'a', 8, 2)
    state = withWord(state, 'w', 7, 2)
    state = { ...state, hero: { col: 6, row: 2, cooldown: 0 }, timeLeft: 100 }
    const r = advance(state, cfg, 1, RIGHT, [], createRng(1)).state
    // 1 回目: アイコンが外へ (連鎖 1)。2 回目: ことばが外へ (連鎖 2)
    expect(r.chain).toBe(2)
    expect(r.removedCount).toBe(1)
    expect(r.removedWordCount).toBe(1)
  })
})
