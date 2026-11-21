// src/console/game/NuisanceSurvival/scripts/nuisanceEngine.ts
// 邪魔者サバイバルの進行を決める純粋関数 (画面・通信・時計に依存しない。乱数・入力・コメントは外から渡す)
//
// 時間は固定の刻み (STEP_SECONDS) で進める。画面が隠れて更新が止まっていた間も、
// 「前回から今まで」の時間を、必要な回数だけ刻んで追いつく (advance)。
// コメントは到着した時刻 (開始からの秒) をつけて渡すので、追いつく途中の正しい時刻に邪魔者が出る。
// 進行の結果は、状態 (GameState) とは別に、演出用のイベント (NuisanceEvent) としても返す。
import {
  GRID_COLS,
  GRID_ROWS,
  HERO_MOVE_INTERVAL_SECONDS,
  MAX_DAMAGE_RAMP,
  MAX_FOOTPRINT,
  MAX_OBSTACLE_CELLS,
  MAX_OBSTACLES,
  MAX_SIZE_SCALE,
  MIN_HERO_REACHABLE_CELLS,
  MAX_STEPS_PER_ADVANCE,
  STEP_SECONDS,
} from './nuisanceConstants'
import type { NuisanceConfigType } from './nuisanceConfig'
import { NO_INPUT, type HeroInput } from './heroInput'
import { getBossTraits, getNuisanceTraits, MOVING_KINDS, type NuisanceTraits } from './nuisanceTraits'
import { obstacleSecondsOf, obstacleSizeOf } from './nuisanceObstacle'
import type { Rng } from './rng'

export type GridSize = { cols: number; rows: number }
export const DEFAULT_GRID: GridSize = { cols: GRID_COLS, rows: GRID_ROWS }

export type Hero = {
  col: number
  row: number
  /** 次に動けるようになるまでの秒 */
  cooldown: number
}

export type Nuisance = {
  id: number
  userId: string
  userName: string
  profileImage: string
  traits: NuisanceTraits
  /** 占めるマスの左上 */
  col: number
  row: number
  /** 直前にいたマスと、動いた時刻 (経過秒)。描画でなめらかに動かすために使う */
  prevCol: number
  prevRow: number
  movedAt: number
  /** bouncer の進む向き */
  dirX: number
  dirY: number
  /** 次に動くまでの秒 */
  moveTimer: number
  /** 生まれてからの秒 (大きさはこれで決まる) */
  age: number
  /** 爆発までの残り秒 (bomber 以外は null) */
  fuse: number | null
}

/** ギフト障害物 (一定時間だけ盤面に残る。取り除けず、ダメージもない。通行と押し出しを妨げる) */
export type Obstacle = {
  id: number
  userId: string
  userName: string
  /** ギフトの金額 (表示に使う) */
  price: number
  /** 占めるマスの左上と、一辺のマス数 */
  col: number
  row: number
  size: number
  /** 置かれた時刻と、消える時刻 (開始からの秒) */
  placedAt: number
  expiresAt: number
}

/** ユーザーごとの貢献度 (その人の邪魔者が減らしたライフ) */
export type Contribution = {
  userId: string
  userName: string
  profileImage: string
  damage: number
  /** 出現した邪魔者の数 (無視されたコメントは数えない) */
  spawned: number
}

export type GameState = {
  grid: GridSize
  /** 開始からの経過秒 (ゲームオーバーのあとは、ライフが 0 になった時刻) */
  elapsed: number
  life: number
  hero: Hero
  nuisances: Nuisance[]
  obstacles: Obstacle[]
  nextId: number
  contributions: Record<string, Contribution>
  /** 主人公が取り除いた数 / 爆発で消えた数 / 上限などで無視したコメントの数 */
  removedCount: number
  explodedCount: number
  ignoredCount: number
  over: boolean
  /** ライフが 0 になった時刻 (開始からの秒)。ゲームオーバーでなければ null */
  endedAt: number | null
}

/** コメント1件ぶんの出現の依頼 */
export type SpawnRequest = {
  /** コメントが届いた時刻 (開始からの秒) */
  atSeconds: number
  userId: string
  userName: string
  profileImage: string
  /** 配信枠のコメント数 (lc)。コンフィグの間隔の倍数のとき、ボスになる。分からなければ省略 */
  lc?: number
  /** ギフトの金額。指定があれば、邪魔者ではなく障害物を置く (0 も置く。ギフトでなければ省略) */
  giftPrice?: number
}

/**
 * 演出に渡すイベント (ゲームの状態とは別。進行の結果として起きたことだけを知らせる)
 * 座標はマス単位 (占めるマスの左上)。演出側は、この情報だけで描く
 */
export type NuisanceEvent =
  | {
      type: 'enemySpawn'
      id: number
      userId: string
      col: number
      row: number
      kind: NuisanceTraits['kind']
      isBoss: boolean
    }
  | {
      type: 'enemyDeath'
      id: number
      userId: string
      col: number
      row: number
      footprint: number
      hue: number
      /** removed: 主人公が取り除いた / exploded: 爆発して消えた */
      cause: 'removed' | 'exploded'
    }
  | {
      /** 置ける場所がなく、障害物を置けなかったギフト (金額だけ表示する。無視はしない) */
      type: 'obstacleSkipped'
      userName: string
      price: number
    }

const DIRECTIONS: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

export const createGame = (config: NuisanceConfigType, grid: GridSize = DEFAULT_GRID): GameState => ({
  grid,
  elapsed: 0,
  life: config.startLife,
  hero: { col: Math.floor(grid.cols / 2), row: Math.floor(grid.rows / 2), cooldown: 0 },
  nuisances: [],
  obstacles: [],
  nextId: 1,
  contributions: {},
  removedCount: 0,
  explodedCount: 0,
  ignoredCount: 0,
  over: false,
  endedAt: null,
})

// ---- 大きさ ----

/** 邪魔者の大きさ (倍率)。時間が経つほど、設定の倍率に従って大きくなる (上限あり) */
export const sizeScaleOf = (n: Pick<Nuisance, 'age' | 'traits'>, config: NuisanceConfigType): number =>
  Math.min(MAX_SIZE_SCALE, n.traits.baseSize * Math.pow(config.growthMultiplier, n.age / config.growthIntervalSeconds))

/** 占めるマスの一辺 (大きさの倍率を四捨五入して、1〜MAX_FOOTPRINT) */
export const footprintOf = (scale: number): number => Math.min(MAX_FOOTPRINT, Math.max(1, Math.round(scale)))

const measure = (n: Nuisance, config: NuisanceConfigType) => {
  const scale = sizeScaleOf(n, config)
  return { scale, footprint: footprintOf(scale) }
}

const covers = (n: Nuisance, footprint: number, col: number, row: number): boolean =>
  col >= n.col && col < n.col + footprint && row >= n.row && row < n.row + footprint

/** 時間経過によるダメージ倍率 (1 + 分あたりの増加 × 経過分。上限あり) */
export const damageRampOf = (elapsed: number, config: NuisanceConfigType): number =>
  Math.min(MAX_DAMAGE_RAMP, 1 + (config.damageRampPerMinute * elapsed) / 60)

// ---- 状態の複製 ----

const cloneState = (s: GameState): GameState => ({
  ...s,
  hero: { ...s.hero },
  nuisances: s.nuisances.map((n) => ({ ...n })),
  obstacles: s.obstacles.map((o) => ({ ...o })),
  contributions: Object.fromEntries(Object.entries(s.contributions).map(([id, c]) => [id, { ...c }])),
})

// ---- 出現 ----

/** 空いているマスをランダムに 1 つ選ぶ。footprint が 2 以上なら、その一辺ぶんが丸ごと空いている左上のマス */
const pickFreeCell = (
  s: GameState,
  config: NuisanceConfigType,
  rng: Rng,
  size = 1,
  accept: (col: number, row: number) => boolean = () => true
): { col: number; row: number } | null => {
  const occupied = new Set<number>()
  occupied.add(s.hero.row * s.grid.cols + s.hero.col)
  for (const o of s.obstacles) {
    for (let r = o.row; r < o.row + o.size; r++) {
      for (let c = o.col; c < o.col + o.size; c++) occupied.add(r * s.grid.cols + c)
    }
  }
  for (const n of s.nuisances) {
    const { footprint } = measure(n, config)
    for (let r = n.row; r < n.row + footprint; r++) {
      for (let c = n.col; c < n.col + footprint; c++) occupied.add(r * s.grid.cols + c)
    }
  }
  const isFree = (col: number, row: number) => {
    for (let r = row; r < row + size; r++) {
      for (let c = col; c < col + size; c++) if (occupied.has(r * s.grid.cols + c)) return false
    }
    return true
  }
  const free: { col: number; row: number }[] = []
  for (let row = 0; row + size <= s.grid.rows; row++) {
    for (let col = 0; col + size <= s.grid.cols; col++) {
      if (isFree(col, row) && accept(col, row)) free.push({ col, row })
    }
  }
  return free.length ? free[Math.floor(rng() * free.length)] : null
}

/** 障害物を置く。同時数・マスの合計の上限を超えるときは、古いものから消す。置ける場所がなければ置かない */
/** 障害物を足したあとに、主人公が (敵を無視して) 動けるマスの数 */
const reachableCellsFrom = (s: GameState, extra: { col: number; row: number; size: number }): number => {
  const blocked = (c: number, r: number) =>
    s.obstacles.some((o) => c >= o.col && c < o.col + o.size && r >= o.row && r < o.row + o.size) ||
    (c >= extra.col && c < extra.col + extra.size && r >= extra.row && r < extra.row + extra.size)
  const seen = new Set<number>([s.hero.row * s.grid.cols + s.hero.col])
  const queue: [number, number][] = [[s.hero.col, s.hero.row]]
  while (queue.length) {
    const [c, r] = queue.pop()!
    for (const [dx, dy] of DIRECTIONS) {
      const nc = c + dx
      const nr = r + dy
      if (nc < 0 || nr < 0 || nc >= s.grid.cols || nr >= s.grid.rows || blocked(nc, nr)) continue
      const key = nr * s.grid.cols + nc
      if (seen.has(key)) continue
      seen.add(key)
      queue.push([nc, nr])
    }
  }
  return seen.size
}

const placeObstacle = (
  s: GameState,
  config: NuisanceConfigType,
  request: SpawnRequest,
  rng: Rng,
  events: NuisanceEvent[]
): void => {
  const price = request.giftPrice ?? 0
  const wanted = Math.min(obstacleSizeOf(price), s.grid.cols, s.grid.rows)
  const cells = () => s.obstacles.reduce((sum, o) => sum + o.size * o.size, 0)
  while (s.obstacles.length > 0 && (s.obstacles.length >= MAX_OBSTACLES || cells() + wanted * wanted > MAX_OBSTACLE_CELLS)) {
    s.obstacles.shift()
  }
  // 置ける場所がなければ、小さくして試す。主人公が閉じ込められる場所には置かない
  let cell: { col: number; row: number } | null = null
  let size = wanted
  for (; size >= 1 && !cell; size--) {
    const trySize = size
    cell = pickFreeCell(s, config, rng, trySize, (col, row) =>
      reachableCellsFrom(s, { col, row, size: trySize }) >= MIN_HERO_REACHABLE_CELLS
    )
    if (cell) break
  }
  if (!cell) {
    // 置けなくても、無視はしない (金額は、画面に表示する)
    events.push({ type: 'obstacleSkipped', userName: request.userName, price })
    return
  }
  s.obstacles.push({
    id: s.nextId++,
    userId: request.userId,
    userName: request.userName,
    price,
    col: cell.col,
    row: cell.row,
    size,
    placedAt: s.elapsed,
    expiresAt: s.elapsed + obstacleSecondsOf(price),
  })
}

const spawnOne = (
  s: GameState,
  config: NuisanceConfigType,
  request: SpawnRequest,
  rng: Rng,
  events: NuisanceEvent[]
): void => {
  // ギフトは、邪魔者ではなく障害物になる
  if (request.giftPrice !== undefined) {
    placeObstacle(s, config, request, rng, events)
    return
  }
  // lc がキリ番のコメントは、ボスになる。上限・空きなしのときは、ボスも出ない (普通の邪魔者にもならない)
  const isBoss =
    config.bossInterval > 0 && request.lc !== undefined && request.lc > 0 && request.lc % config.bossInterval === 0
  const traits = isBoss ? getBossTraits(request.userId) : getNuisanceTraits(request.userId, config.specialRate / 100)

  // 上限・空きマスなし: コメントは無視する (上限を固くすると、すぐゲームオーバーになるため)
  const cell =
    s.nuisances.length >= config.maxNuisances ? null : pickFreeCell(s, config, rng, footprintOf(traits.baseSize))
  if (!cell) {
    s.ignoredCount++
    return
  }

  const [dirX, dirY] = DIRECTIONS[Math.floor(rng() * DIRECTIONS.length)]
  s.nuisances.push({
    id: s.nextId++,
    userId: request.userId,
    userName: request.userName,
    profileImage: request.profileImage,
    traits,
    col: cell.col,
    row: cell.row,
    prevCol: cell.col,
    prevRow: cell.row,
    movedAt: s.elapsed,
    dirX,
    dirY,
    moveTimer: traits.moveIntervalSeconds * (0.5 + rng() * 0.5), // 全員が同時に動き出さないよう、ずらす
    age: 0,
    fuse: traits.fuseSeconds,
  })
  events.push({
    type: 'enemySpawn',
    id: s.nextId - 1,
    userId: request.userId,
    col: cell.col,
    row: cell.row,
    kind: traits.kind,
    isBoss,
  })

  const contribution = (s.contributions[request.userId] ??= {
    userId: request.userId,
    userName: request.userName,
    profileImage: request.profileImage,
    damage: 0,
    spawned: 0,
  })
  contribution.userName = request.userName
  contribution.profileImage = request.profileImage
  contribution.spawned++
}

// ---- 移動 ----

const canPlace = (s: GameState, footprint: number, col: number, row: number): boolean => {
  if (col < 0 || row < 0 || col + footprint > s.grid.cols || row + footprint > s.grid.rows) return false
  if (hitsObstacle(s, footprint, col, row)) return false
  const h = s.hero
  return !(h.col >= col && h.col < col + footprint && h.row >= row && h.row < row + footprint)
}

/** footprint 四方の範囲が、障害物と重なるか */
const hitsObstacle = (s: GameState, footprint: number, col: number, row: number): boolean =>
  s.obstacles.some(
    (o) => col < o.col + o.size && col + footprint > o.col && row < o.row + o.size && row + footprint > o.row
  )

const moveNuisance = (s: GameState, n: Nuisance, footprint: number, rng: Rng): void => {
  const valid = DIRECTIONS.filter(([dx, dy]) => canPlace(s, footprint, n.col + dx, n.row + dy))
  let chosen: readonly [number, number] | undefined

  switch (n.traits.kind) {
    case 'evader':
    case 'creeper':
    case 'boss': {
      // evader: 主人公から遠ざかる向きだけを選ぶ (遠ざかれないなら動かない = 壁際に追い込める)
      // creeper・boss: 主人公に近づく向きだけを選ぶ (近づけないなら動かない = 隣り合ったら止まる)
      const distance = (dx: number, dy: number) =>
        Math.abs(n.col + dx + (footprint - 1) / 2 - s.hero.col) +
        Math.abs(n.row + dy + (footprint - 1) / 2 - s.hero.row)
      const current = distance(0, 0)
      const better = valid.filter(([dx, dy]) =>
        n.traits.kind === 'evader' ? distance(dx, dy) > current : distance(dx, dy) < current
      )
      chosen = better.length ? better[Math.floor(rng() * better.length)] : undefined
      break
    }
    case 'bouncer': {
      const straight = valid.find(([dx, dy]) => dx === n.dirX && dy === n.dirY)
      if (straight) {
        chosen = straight
      } else {
        // 壁・主人公に当たったら、反対向きへ。それも行けなければ、行ける向きから選ぶ
        n.dirX = -n.dirX
        n.dirY = -n.dirY
        chosen =
          valid.find(([dx, dy]) => dx === n.dirX && dy === n.dirY) ??
          (valid.length ? valid[Math.floor(rng() * valid.length)] : undefined)
        if (chosen) {
          n.dirX = chosen[0]
          n.dirY = chosen[1]
        }
      }
      break
    }
    default:
      chosen = valid.length ? valid[Math.floor(rng() * valid.length)] : undefined
  }

  if (!chosen) return
  n.prevCol = n.col
  n.prevRow = n.row
  n.movedAt = s.elapsed
  n.col += chosen[0]
  n.row += chosen[1]
}

// ---- 1 刻み ----

type DamageEvent = { userId: string; amount: number }

const deathEvent = (n: Nuisance, footprint: number, cause: 'removed' | 'exploded'): NuisanceEvent => ({
  type: 'enemyDeath',
  id: n.id,
  userId: n.userId,
  col: n.col,
  row: n.row,
  footprint,
  hue: n.traits.hue,
  cause,
})

/**
 * (col, row) にいる邪魔者を、(dx, dy) の向きへ 1 マス押す。押した先にいる邪魔者も、連鎖して押す。
 * 押した結果、盤面の外へ出る邪魔者は撃破 (removed)。重なっている邪魔者は、押す集合に含めて一緒に動かす。
 */
const pushChain = (
  s: GameState,
  config: NuisanceConfigType,
  col: number,
  row: number,
  dx: number,
  dy: number,
  removed: Set<number>,
  notices: NuisanceEvent[]
): boolean => {
  const sizes = new Map<number, number>()
  const footprintById = (n: Nuisance) => {
    let f = sizes.get(n.id)
    if (f === undefined) sizes.set(n.id, (f = measure(n, config).footprint))
    return f
  }
  const pushing = new Map<number, Nuisance>()
  const queue: Nuisance[] = s.nuisances.filter((n) => covers(n, footprintById(n), col, row))
  while (queue.length) {
    const n = queue.pop()!
    if (pushing.has(n.id)) continue
    pushing.set(n.id, n)
    const f = footprintById(n)
    // 押した先のマス (進む向きの、1 つ外側の辺)
    for (let i = 0; i < f; i++) {
      const c = dx > 0 ? n.col + f : dx < 0 ? n.col - 1 : n.col + i
      const r = dy > 0 ? n.row + f : dy < 0 ? n.row - 1 : n.row + i
      for (const other of s.nuisances) {
        if (!pushing.has(other.id) && covers(other, footprintById(other), c, r)) queue.push(other)
      }
    }
  }
  // 押す先に障害物があれば、まるごと押せない (盤面の外へ出るものは、障害物の影響を受けない)
  for (const n of pushing.values()) {
    const f = footprintById(n)
    const nextCol = n.col + dx
    const nextRow = n.row + dy
    const inside = nextCol >= 0 && nextRow >= 0 && nextCol + f <= s.grid.cols && nextRow + f <= s.grid.rows
    if (inside && hitsObstacle(s, f, nextCol, nextRow)) return false
  }
  for (const n of pushing.values()) {
    const f = footprintById(n)
    const nextCol = n.col + dx
    const nextRow = n.row + dy
    if (nextCol < 0 || nextRow < 0 || nextCol + f > s.grid.cols || nextRow + f > s.grid.rows) {
      removed.add(n.id)
      s.removedCount++
      notices.push(deathEvent(n, f, 'removed'))
      continue
    }
    n.prevCol = n.col
    n.prevRow = n.row
    n.movedAt = s.elapsed
    n.col = nextCol
    n.row = nextRow
  }
  return true
}

const stepOnce = (
  s: GameState,
  config: NuisanceConfigType,
  input: HeroInput,
  rng: Rng,
  notices: NuisanceEvent[]
): void => {
  const dt = STEP_SECONDS
  const ramp = damageRampOf(s.elapsed, config)
  // 自然回復 (最大ライフまで)
  s.life = Math.min(config.startLife, s.life + config.regenPerSecond * dt)

  // 主人公: 向きのマスが空いていれば動く。邪魔者がいれば、連鎖して 1 マス押し出す (画面の外へ出た邪魔者は撃破)
  const hero = s.hero
  hero.cooldown = Math.max(0, hero.cooldown - dt)
  const removed = new Set<number>()
  if ((input.dx !== 0 || input.dy !== 0) && hero.cooldown === 0) {
    const col = hero.col + input.dx
    const row = hero.row + input.dy
    if (col >= 0 && row >= 0 && col < s.grid.cols && row < s.grid.rows) {
      const free = !s.obstacles.some((o) => col >= o.col && col < o.col + o.size && row >= o.row && row < o.row + o.size)
      if (free && pushChain(s, config, col, row, input.dx, input.dy, removed, notices)) {
        hero.col = col
        hero.row = row
        hero.cooldown = HERO_MOVE_INTERVAL_SECONDS
      }
    }
  }
  if (removed.size) s.nuisances = s.nuisances.filter((n) => !removed.has(n.id))
  removed.clear()

  // 障害物: 時間が来たら消える
  if (s.obstacles.some((o) => o.expiresAt <= s.elapsed)) s.obstacles = s.obstacles.filter((o) => o.expiresAt > s.elapsed)

  // 邪魔者: 成長・移動・ライフを減らす・爆発
  const events: DamageEvent[] = []
  for (const n of s.nuisances) {
    if (removed.has(n.id)) continue
    n.age += dt
    const { scale, footprint } = measure(n, config)
    // 大きくなってはみ出した分は、中へ寄せる
    n.col = Math.max(0, Math.min(n.col, s.grid.cols - footprint))
    n.row = Math.max(0, Math.min(n.row, s.grid.rows - footprint))

    // 動くのは、特殊能力を持つ邪魔者だけ (static・bomber は動かない)
    if (MOVING_KINDS.includes(n.traits.kind)) {
      n.moveTimer -= dt
      if (n.moveTimer <= 0) {
        n.moveTimer += n.traits.moveIntervalSeconds
        moveNuisance(s, n, footprint, rng)
      }
    }

    events.push({ userId: n.userId, amount: n.traits.drainPerSecond * scale * config.drainMultiplier * ramp * dt })

    if (n.fuse !== null) {
      n.fuse -= dt
      if (n.fuse <= 0) {
        events.push({ userId: n.userId, amount: n.traits.explosionDamage * scale * config.drainMultiplier * ramp })
        removed.add(n.id)
        s.explodedCount++
        notices.push(deathEvent(n, footprint, 'exploded'))
      }
    }
  }
  if (removed.size) s.nuisances = s.nuisances.filter((n) => !removed.has(n.id))

  // ライフ: 0 になった刻みでは、その刻みの途中で 0 になった時刻を求め、減らした分だけをその人の貢献にする
  const total = events.reduce((sum, e) => sum + e.amount, 0)
  const before = s.life
  const lethal = total > 0 && before - total <= 0
  const ratio = lethal ? before / total : 1
  for (const e of events) {
    const contribution = s.contributions[e.userId]
    if (contribution) contribution.damage += e.amount * ratio
  }
  if (lethal) {
    s.life = 0
    s.over = true
    s.endedAt = s.elapsed + dt * ratio
    s.elapsed = s.endedAt
  } else {
    s.life = before - total
    s.elapsed += dt
  }
}

// ---- 進行 ----

export type AdvanceResult = {
  state: GameState
  /** まだ出現させていないコメント (到着時刻が、進めた時刻より先のもの) */
  pending: SpawnRequest[]
  /** 刻みの上限で止まった (まだ追いついていない)。すぐにもう一度 advance を呼ぶ */
  reachedStepLimit: boolean
  /** この呼び出しで起きたこと (時系列順)。演出に渡す。ゲームの状態には含めない */
  events: NuisanceEvent[]
}

/**
 * untilSeconds (開始からの秒) まで進める。元の state は変えない
 * - 入力 (input) は、進める間ずっと同じものとして扱う (隠れている間は、キー入力がないため)
 * - spawns は、到着時刻 (atSeconds) の順に並んでいなくてもよい。届いた時刻の刻みで出現する
 * - ゲームオーバーになったら、そこで止まる (残りのコメントは捨てる)
 */
export const advance = (
  state: GameState,
  config: NuisanceConfigType,
  untilSeconds: number,
  input: HeroInput = NO_INPUT,
  spawns: readonly SpawnRequest[] = [],
  rng: Rng = Math.random,
  maxSteps: number = MAX_STEPS_PER_ADVANCE
): AdvanceResult => {
  if (state.over) return { state, pending: [], reachedStepLimit: false, events: [] }
  // 1 刻みも進まないなら、複製せずにそのまま返す (毎フレーム呼んでも軽い)
  if (state.elapsed + STEP_SECONDS > untilSeconds + 1e-9)
    return { state, pending: [...spawns], reachedStepLimit: false, events: [] }

  const s = cloneState(state)
  const queue = [...spawns].sort((a, b) => a.atSeconds - b.atSeconds)
  const events: NuisanceEvent[] = []
  let next = 0
  let steps = 0
  while (!s.over && s.elapsed + STEP_SECONDS <= untilSeconds + 1e-9 && steps < maxSteps) {
    const stepEnd = s.elapsed + STEP_SECONDS
    while (next < queue.length && queue[next].atSeconds <= stepEnd + 1e-9) spawnOne(s, config, queue[next++], rng, events)
    stepOnce(s, config, input, rng, events)
    steps++
  }

  const reachedStepLimit = !s.over && s.elapsed + STEP_SECONDS <= untilSeconds + 1e-9
  return { state: s, pending: s.over ? [] : queue.slice(next), reachedStepLimit, events }
}

/** 貢献度の順位 (ダメージの多い順。同じなら出現数の多い順) */
export const getContributionRanking = (state: GameState): Contribution[] =>
  Object.values(state.contributions).sort((a, b) => b.damage - a.damage || b.spawned - a.spawned)
