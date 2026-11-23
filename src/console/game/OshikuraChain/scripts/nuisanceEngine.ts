// src/console/game/OshikuraChain/scripts/nuisanceEngine.ts
// おしくらチェイン (協力パズル) の進行を決める純粋関数 (画面・通信・時計に依存しない。乱数・入力・コメントは外から渡す)
//
// 遊び方: コメントした人のアイコンと、コメントの文字 (ことば) が盤面に降ってくる。主人公が画面の外へ押し出すと、
// 残り時間が増える (獲得秒数 × 連鎖数 × 係数)。残り時間は、1 秒ごとに 1 秒減り、0 になるとゲームオーバー。
// - 連鎖: 画面の外へ押し出して得点するたびに +1。得点しない動き (空きマスへの移動など) をすると、切れる。止まっただけでは切れない
// - 係数: 時間が経つほど下がる (下限あり)。初見コメントのリセット設定が有効なら、初見さんのコメントで 1 に戻る
// - 残り時間には上限 (maxSeconds) がある
//
// 時間は固定の刻み (STEP_SECONDS) で進める。画面が隠れて更新が止まっていた間も、
// 「前回から今まで」の時間を、必要な回数だけ刻んで追いつく (advance)。
// コメントは到着した時刻 (開始からの秒) をつけて渡すので、追いつく途中の正しい時刻に出現する。
// 進行の結果は、状態 (GameState) とは別に、演出用のイベント (NuisanceEvent) としても返す。
import {
  GRID_COLS,
  GRID_ROWS,
  HERO_MOVE_INTERVAL_SECONDS,
  HERO_PUSH_INTERVAL_SECONDS,
  MAX_FOOTPRINT,
  MAX_OBSTACLE_CELLS,
  MAX_OBSTACLES,
  MIN_HERO_REACHABLE_CELLS,
  MAX_STEPS_PER_ADVANCE,
  PUSH_WAVE_DELAY_SECONDS,
  STEP_SECONDS,
  GIANT_INTERVAL_SECONDS,
  COEFFICIENT_RESET_NOTICE_BELOW,
  WORD_CHARS_PER_ITEM,
  WORD_MAX,
  WORD_MAX_PER_COMMENT,
  WORD_SECONDS_MAX,
  WORD_SECONDS_MIN,
} from './nuisanceConstants'
import type { NuisanceConfigType } from './nuisanceConfig'
import { NO_INPUT, type HeroInput } from './heroInput'
import { getBossTraits, getNuisanceTraits, type NuisanceTraits } from './nuisanceTraits'
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

/** アイコン (コメントした人)。動かない。押し出せる */
export type Nuisance = {
  id: number
  userId: string
  userName: string
  profileImage: string
  traits: NuisanceTraits
  /** 占めるマスの左上 */
  col: number
  row: number
  /** 直前にいたマスと、動き出す時刻 (経過秒。連鎖のウェーブでは、未来の時刻になる)。描画でなめらかに動かすために使う */
  prevCol: number
  prevRow: number
  movedAt: number
}

/** ギフト障害物 (一定時間だけ盤面に残る。取り除けず、通行と押し出しを妨げる) */
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

/**
 * コメントの文字 (「ことば」)。コメントの文字数に応じて降ってくる。1 マスを占める。
 * 主人公が押し出せる (押された先のアイコンも連鎖する)。押されないまま時間が経つと、爆発して、周囲 8 マスのアイコン・ことばを消す
 * (得点にはならない。連鎖の邪魔になる)。押されると、爆発までの時間は最初の長さに戻る
 */
export type Word = {
  id: number
  userId: string
  userName: string
  profileImage: string
  /** 表示する文字 (コメントの一部) */
  text: string
  col: number
  row: number
  /** 直前にいたマスと、動き出す時刻 (経過秒)。描画でなめらかに動かすために使う */
  prevCol: number
  prevRow: number
  movedAt: number
  /** 爆発する時刻 (開始からの秒)。押されるたびに、いまの時刻 + lifeSeconds になる。円グラフで、残り時間を見せる */
  expiresAt: number
  lifeSeconds: number
}

/** 押し出せるもの (アイコン・ことば) */
type Body = Nuisance | Word

const isWord = (b: Body): b is Word => 'text' in b

/** ユーザーごとの貢献度 (その人のアイコン・ことばが生んだ秒数) */
export type Contribution = {
  userId: string
  userName: string
  profileImage: string
  /** 生んだ秒数 (獲得秒数 × 連鎖数 × 係数の合計。残り時間が上限のときも、数える) */
  seconds: number
  /** 出現したアイコンの数 (無視されたコメントは数えない) */
  spawned: number
}

export type GameState = {
  grid: GridSize
  /** 開始からの経過秒 (ゲームオーバーのあとは、残り時間が 0 になった時刻) */
  elapsed: number
  /** 残り時間 (秒)。0 になるとゲームオーバー */
  timeLeft: number
  hero: Hero
  nuisances: Nuisance[]
  obstacles: Obstacle[]
  /** コメントの文字 (ことば) */
  words: Word[]
  nextId: number
  contributions: Record<string, Contribution>
  /** いまの連鎖数と、その連鎖で得た秒数の合計 (連鎖が切れると、どちらも 0) */
  chain: number
  chainTotal: number
  /** 最大の連鎖数 */
  bestChain: number
  /** 係数が 1 だった時刻 (開始からの秒)。初見コメントによるリセット時に更新する */
  coefficientResetAt: number
  /** 次に巨大化するユーザーを選ぶ時刻 (開始からの秒) */
  nextGiantAt: number
  /** 残り時間に足した秒数の合計 (上限で切られた分は含まない) */
  gainedSeconds: number
  /** 押し出したアイコン / ことばの数 / 上限などで無視したコメントの数 */
  removedCount: number
  removedWordCount: number
  ignoredCount: number
  over: boolean
  /** 終わった時刻 (開始からの秒)。残り時間が 0 になった時刻、またはプレイヤーがやめた時刻。ゲームオーバーでなければ null */
  endedAt: number | null
}

/** コメント1件ぶんの出現の依頼 */
export type SpawnRequest = {
  /** コメントが届いた時刻 (開始からの秒) */
  atSeconds: number
  userId: string
  userName: string
  profileImage: string
  /** 初見さん (その人の最初のコメント) か。設定が有効なら係数が 1 に戻る */
  isFirst?: boolean
  /** コメントの本文。あれば、文字数に応じて「ことば」が降ってくる (ギフトのときは降らない) */
  comment?: string
  /** ギフトの金額。指定があれば、アイコンではなく障害物を置く (0 も置く。ギフトでなければ省略) */
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
      /** アイコンが、画面の外へ押し出された */
      type: 'enemyDeath'
      id: number
      userId: string
      col: number
      row: number
      footprint: number
      hue: number
      /** removed: 主人公が画面の外へ押し出した (得点) / exploded: ことばの爆発に巻き込まれて消えた (得点なし) */
      cause: 'removed' | 'exploded'
      /** 連鎖の途中で押し出されたとき: 押された向きと、動き出すまでの秒 (演出が、ウェーブに合わせて消すため) */
      pushDx?: number
      pushDy?: number
      delaySeconds?: number
    }
  | {
      /** 「ことば」が降ってきた */
      type: 'wordSpawn'
      id: number
      col: number
      row: number
    }
  | {
      /** 「ことば」が押し出されて、盤面の外へ出た */
      type: 'wordGone'
      id: number
      col: number
      row: number
      pushDx: number
      pushDy: number
      delaySeconds: number
    }
  | {
      /** 「ことば」が爆発した。周囲 8 マスのことば (victims) は、巻き込まれて消えた (アイコンは enemyDeath の cause 'exploded') */
      type: 'wordExplode'
      id: number
      col: number
      row: number
      victims: number[]
    }
  | {
      /** 得点した (アイコンまたはことばが、画面の外へ押し出された) */
      type: 'score'
      source: 'nuisance' | 'word'
      userId: string
      userName: string
      /** 得た秒数 (獲得秒数 × 連鎖数 × 係数。上限で切られる前の値) */
      seconds: number
      /** 実際に、残り時間に足した秒数 (上限のとき、seconds より小さい) */
      applied: number
      /** この得点を含めた連鎖数と、その連鎖の秒数の合計 */
      chain: number
      chainTotal: number
      coefficient: number
      col: number
      row: number
      /** 連鎖のウェーブに合わせて、演出を遅らせる秒 */
      delaySeconds: number
    }
  | {
      /** 連鎖が切れた (得点しない動きをした) */
      type: 'chainBreak'
      chain: number
      total: number
    }
  | {
      /** 初見さんのコメントで、下がっていた係数が 1 に戻った */
      type: 'coefficientReset'
      userName: string
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
  timeLeft: config.initialSeconds,
  hero: { col: Math.floor(grid.cols / 2), row: Math.floor(grid.rows / 2), cooldown: 0 },
  nuisances: [],
  obstacles: [],
  words: [],
  nextId: 1,
  contributions: {},
  chain: 0,
  chainTotal: 0,
  bestChain: 0,
  coefficientResetAt: 0,
  nextGiantAt: GIANT_INTERVAL_SECONDS,
  gainedSeconds: 0,
  removedCount: 0,
  removedWordCount: 0,
  ignoredCount: 0,
  over: false,
  endedAt: null,
})

// ---- 大きさ ----

/** アイコンの大きさ (倍率)。成長しない (巨大化したアイコンだけが大きい) */
export const sizeScaleOf = (n: Pick<Nuisance, 'traits'>): number => n.traits.baseSize

/** 占めるマスの一辺 (大きさの倍率を四捨五入して、1〜MAX_FOOTPRINT) */
export const footprintOf = (scale: number): number => Math.min(MAX_FOOTPRINT, Math.max(1, Math.round(scale)))

const measure = (n: Nuisance) => {
  const scale = sizeScaleOf(n)
  return { scale, footprint: footprintOf(scale) }
}

const covers = (n: { col: number; row: number }, footprint: number, col: number, row: number): boolean =>
  col >= n.col && col < n.col + footprint && row >= n.row && row < n.row + footprint

// ---- 係数 ----

/**
 * 係数 (得点に掛かる倍率)。1 から始まり、時間が経つほど下がる (1 分ごとに coefficientDropPerMinute %、下限は coefficientFloorPercent %)
 * resetAt: 係数が 1 だった時刻 (初見さんのコメントが届いた時刻)
 */
export const coefficientOf = (elapsed: number, resetAt: number, config: NuisanceConfigType): number => {
  const floor = config.coefficientFloorPercent / 100
  const dropped = (config.coefficientDropPerMinute / 100) * (Math.max(0, elapsed - resetAt) / 60)
  return Math.max(floor, 1 - dropped)
}

// ---- 状態の複製 ----

const cloneState = (s: GameState): GameState => ({
  ...s,
  hero: { ...s.hero },
  nuisances: s.nuisances.map((n) => ({ ...n })),
  obstacles: s.obstacles.map((o) => ({ ...o })),
  words: s.words.map((w) => ({ ...w })),
  contributions: Object.fromEntries(Object.entries(s.contributions).map(([id, c]) => [id, { ...c }])),
})

const contributionOf = (s: GameState, userId: string, userName: string, profileImage: string): Contribution => {
  const contribution = (s.contributions[userId] ??= { userId, userName, profileImage, seconds: 0, spawned: 0 })
  contribution.userName = userName
  contribution.profileImage = profileImage
  return contribution
}

// ---- 出現 ----

/** 空いているマスをランダムに 1 つ選ぶ。size が 2 以上なら、その一辺ぶんが丸ごと空いている左上のマス */
const pickFreeCell = (
  s: GameState,
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
    const { footprint } = measure(n)
    for (let r = n.row; r < n.row + footprint; r++) {
      for (let c = n.col; c < n.col + footprint; c++) occupied.add(r * s.grid.cols + c)
    }
  }
  for (const w of s.words) occupied.add(w.row * s.grid.cols + w.col)
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

/** 障害物を足したあとに、主人公が (アイコンを無視して) 動けるマスの数 */
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

/** 障害物を置く。同時数・マスの合計の上限を超えるときは、古いものから消す。置ける場所がなければ置かない */
const placeObstacle = (s: GameState, request: SpawnRequest, rng: Rng, events: NuisanceEvent[]): void => {
  const price = request.giftPrice ?? 0
  const wanted = Math.min(obstacleSizeOf(price), s.grid.cols, s.grid.rows)
  const cells = () => s.obstacles.reduce((sum, o) => sum + o.size * o.size, 0)
  while (
    s.obstacles.length > 0 &&
    (s.obstacles.length >= MAX_OBSTACLES || cells() + wanted * wanted > MAX_OBSTACLE_CELLS)
  ) {
    s.obstacles.shift()
  }
  // 置ける場所がなければ、小さくして試す。主人公が閉じ込められる場所には置かない
  let cell: { col: number; row: number } | null = null
  let size = wanted
  for (; size >= 1 && !cell; size--) {
    const trySize = size
    cell = pickFreeCell(
      s,
      rng,
      trySize,
      (col, row) => reachableCellsFrom(s, { col, row, size: trySize }) >= MIN_HERO_REACHABLE_CELLS
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

/** コメントの文字を、5 文字ごとの「ことば」にして降らせる (最大 WORD_MAX_PER_COMMENT 個)。空きマスがなければ、そこで止める */
const dropWords = (s: GameState, request: SpawnRequest, rng: Rng, events: NuisanceEvent[]): void => {
  const chars = Array.from((request.comment ?? '').replace(/\s+/g, ''))
  if (!chars.length) return
  const count = Math.min(WORD_MAX_PER_COMMENT, Math.ceil(chars.length / WORD_CHARS_PER_ITEM))
  for (let i = 0; i < count; i++) {
    // 上限を超えるときは、古いものから消す
    while (s.words.length >= WORD_MAX) s.words.shift()
    const cell = pickFreeCell(s, rng)
    if (!cell) return
    const id = s.nextId++
    const lifeSeconds = WORD_SECONDS_MIN + rng() * (WORD_SECONDS_MAX - WORD_SECONDS_MIN)
    s.words.push({
      id,
      userId: request.userId,
      userName: request.userName,
      profileImage: request.profileImage,
      text: chars.slice(i * WORD_CHARS_PER_ITEM, (i + 1) * WORD_CHARS_PER_ITEM).join(''),
      col: cell.col,
      row: cell.row,
      prevCol: cell.col,
      prevRow: cell.row,
      movedAt: s.elapsed,
      expiresAt: s.elapsed + lifeSeconds,
      lifeSeconds,
    })
    events.push({ type: 'wordSpawn', id, col: cell.col, row: cell.row })
  }
}

const spawnOne = (
  s: GameState,
  config: NuisanceConfigType,
  request: SpawnRequest,
  rng: Rng,
  events: NuisanceEvent[]
): void => {
  // 初見コメントによる係数リセットは、設定で無効にできる
  if (config.resetCoefficientOnFirst && request.isFirst) {
    if (coefficientOf(s.elapsed, s.coefficientResetAt, config) < COEFFICIENT_RESET_NOTICE_BELOW) {
      events.push({ type: 'coefficientReset', userName: request.userName })
    }
    s.coefficientResetAt = s.elapsed
  }
  // ギフトは、アイコンではなく障害物になる
  if (request.giftPrice !== undefined) {
    placeObstacle(s, request, rng, events)
    return
  }
  // コメントの文字数に応じて、「ことば」も降ってくる (アイコンが上限で出なくても降る)
  dropWords(s, request, rng, events)
  // 2 分経過するごとに、その後最初に出現するユーザーを巨大化する
  const canSpawn = s.nuisances.length < config.maxNuisances
  const isGiantDue = request.atSeconds >= s.nextGiantAt
  const giantTraits = isGiantDue ? getBossTraits(request.userId) : null
  const giantCell = canSpawn ? (giantTraits ? pickFreeCell(s, rng, footprintOf(giantTraits.baseSize)) : null) : null
  // 巨大化できる空きがなければ通常サイズで出す。巨大化の権利は次のユーザーへ持ち越す
  const isBoss = giantCell !== null
  const traits = isBoss ? giantTraits! : getNuisanceTraits(request.userId)
  const cell = !canSpawn ? null : (giantCell ?? pickFreeCell(s, rng, footprintOf(traits.baseSize)))
  if (!cell) {
    s.ignoredCount++
    return
  }
  if (isBoss) s.nextGiantAt += GIANT_INTERVAL_SECONDS

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
  contributionOf(s, request.userId, request.userName, request.profileImage).spawned++
}

// ---- 押し出し ----

/** footprint 四方の範囲が、障害物と重なるか */
const hitsObstacle = (s: GameState, footprint: number, col: number, row: number): boolean =>
  s.obstacles.some(
    (o) => col < o.col + o.size && col + footprint > o.col && row < o.row + o.size && row + footprint > o.row
  )

/** 画面の外へ押し出されたもの 1 つぶんの得点。連鎖数が 1 増え、獲得秒数 × 連鎖数 × 係数が、残り時間に足される (上限あり) */
const awardScore = (
  s: GameState,
  config: NuisanceConfigType,
  body: Body,
  delaySeconds: number,
  events: NuisanceEvent[]
): void => {
  s.chain++
  s.bestChain = Math.max(s.bestChain, s.chain)
  const coefficient = coefficientOf(s.elapsed, s.coefficientResetAt, config)
  const seconds = (isWord(body) ? config.wordSeconds : config.iconSeconds) * s.chain * coefficient
  const applied = Math.max(0, Math.min(seconds, config.maxSeconds - s.timeLeft))
  s.timeLeft += applied
  s.gainedSeconds += applied
  s.chainTotal += seconds
  contributionOf(s, body.userId, body.userName, body.profileImage).seconds += seconds
  events.push({
    type: 'score',
    source: isWord(body) ? 'word' : 'nuisance',
    userId: body.userId,
    userName: body.userName,
    seconds,
    applied,
    chain: s.chain,
    chainTotal: s.chainTotal,
    coefficient,
    col: body.col,
    row: body.row,
    delaySeconds,
  })
}

const breakChain = (s: GameState, events: NuisanceEvent[]): void => {
  if (s.chain > 0) events.push({ type: 'chainBreak', chain: s.chain, total: s.chainTotal })
  s.chain = 0
  s.chainTotal = 0
}

const deathEvent = (
  n: Nuisance,
  footprint: number,
  cause: 'removed' | 'exploded',
  push?: { dx: number; dy: number; delaySeconds: number }
): NuisanceEvent => ({
  type: 'enemyDeath',
  id: n.id,
  userId: n.userId,
  col: n.col,
  row: n.row,
  footprint,
  hue: n.traits.hue,
  cause,
  // 連鎖の途中で押し出されたものだけ、ウェーブに合わせて演出を遅らせるための情報をつける
  ...(push && push.delaySeconds > 0 ? { pushDx: push.dx, pushDy: push.dy, delaySeconds: push.delaySeconds } : {}),
})

/**
 * (col, row) にいるアイコン・ことばを、(dx, dy) の向きへ 1 マス押す。押した先にいるものも、連鎖して押す。
 * 押した結果、盤面の外へ出るものは得点になる (押された順に、連鎖数が増える)。重なっているものは、一緒に動かす。
 * 位置は即座に変わるが、動き出す時刻 (movedAt) は、押された順に PUSH_WAVE_DELAY_SECONDS ずつ遅らせる (見た目のウェーブ)
 * 戻り値: 得点した数 (0 なら、盤面の外へ出たものはなかった)。障害物に阻まれて押せないときは null
 */
const pushChain = (
  s: GameState,
  config: NuisanceConfigType,
  col: number,
  row: number,
  dx: number,
  dy: number,
  removed: Set<number>,
  events: NuisanceEvent[]
): number | null => {
  const sizes = new Map<number, number>()
  const footprintById = (b: Body) => {
    if (isWord(b)) return 1
    let f = sizes.get(b.id)
    if (f === undefined) sizes.set(b.id, (f = measure(b).footprint))
    return f
  }
  const all: Body[] = [...s.nuisances, ...s.words]
  // 幅優先で集める (先頭からの段数 = ウェーブの遅れ)
  const depth = new Map<number, number>()
  const pushing: Body[] = []
  for (const b of all) {
    if (covers(b, footprintById(b), col, row)) {
      depth.set(b.id, 0)
      pushing.push(b)
    }
  }
  for (let head = 0; head < pushing.length; head++) {
    const n = pushing[head]
    const f = footprintById(n)
    const next = (depth.get(n.id) ?? 0) + 1
    // 押した先のマス (進む向きの、1 つ外側の辺)
    for (let i = 0; i < f; i++) {
      const c = dx > 0 ? n.col + f : dx < 0 ? n.col - 1 : n.col + i
      const r = dy > 0 ? n.row + f : dy < 0 ? n.row - 1 : n.row + i
      for (const other of all) {
        if (!depth.has(other.id) && covers(other, footprintById(other), c, r)) {
          depth.set(other.id, next)
          pushing.push(other)
        }
      }
    }
  }
  // 押す先に障害物があれば、まるごと押せない (盤面の外へ出るものは、障害物の影響を受けない)
  for (const n of pushing) {
    const f = footprintById(n)
    const nextCol = n.col + dx
    const nextRow = n.row + dy
    const inside = nextCol >= 0 && nextRow >= 0 && nextCol + f <= s.grid.cols && nextRow + f <= s.grid.rows
    if (inside && hitsObstacle(s, f, nextCol, nextRow)) return null
  }
  let scored = 0
  for (const n of pushing) {
    const f = footprintById(n)
    const nextCol = n.col + dx
    const nextRow = n.row + dy
    const delaySeconds = (depth.get(n.id) ?? 0) * PUSH_WAVE_DELAY_SECONDS
    if (nextCol < 0 || nextRow < 0 || nextCol + f > s.grid.cols || nextRow + f > s.grid.rows) {
      removed.add(n.id)
      scored++
      if (isWord(n)) {
        s.removedWordCount++
        events.push({ type: 'wordGone', id: n.id, col: n.col, row: n.row, pushDx: dx, pushDy: dy, delaySeconds })
      } else {
        s.removedCount++
        events.push(deathEvent(n, f, 'removed', { dx, dy, delaySeconds }))
      }
      awardScore(s, config, n, delaySeconds, events)
      continue
    }
    n.prevCol = n.col
    n.prevRow = n.row
    n.movedAt = s.elapsed + delaySeconds
    n.col = nextCol
    n.row = nextRow
    // 押されたことばは、爆発までの時間が最初の長さに戻る (連鎖の途中で爆発しない)
    if (isWord(n)) n.expiresAt = s.elapsed + n.lifeSeconds
  }
  return scored
}

// ---- ことばの爆発 ----

/**
 * 爆発までの時間が来たことばを、爆発させる。周囲 8 マスにある (一部でも重なる) アイコン・ことばを消す。
 * 得点にはならず、連鎖も切れない (消えたぶん、並べたアイコンが減る)。巻き込まれたことばは、連鎖して爆発はしない。
 * 主人公・障害物は、巻き込まれない
 */
const explodeWords = (s: GameState, events: NuisanceEvent[]): void => {
  const due = s.words.filter((w) => w.expiresAt <= s.elapsed)
  if (!due.length) return
  const gone = new Set<number>()
  for (const w of due) {
    if (gone.has(w.id)) continue // 先に爆発したことばに、巻き込まれて消えた
    gone.add(w.id)
    for (const n of s.nuisances) {
      if (gone.has(n.id)) continue
      const { footprint } = measure(n)
      const overlaps =
        n.col <= w.col + 1 &&
        n.col + footprint - 1 >= w.col - 1 &&
        n.row <= w.row + 1 &&
        n.row + footprint - 1 >= w.row - 1
      if (!overlaps) continue
      gone.add(n.id)
      events.push(deathEvent(n, footprint, 'exploded'))
    }
    const victims: number[] = []
    for (const other of s.words) {
      if (gone.has(other.id) || Math.abs(other.col - w.col) > 1 || Math.abs(other.row - w.row) > 1) continue
      gone.add(other.id)
      victims.push(other.id)
    }
    events.push({ type: 'wordExplode', id: w.id, col: w.col, row: w.row, victims })
  }
  s.nuisances = s.nuisances.filter((n) => !gone.has(n.id))
  s.words = s.words.filter((w) => !gone.has(w.id))
}

// ---- 1 刻み ----

const stepOnce = (s: GameState, config: NuisanceConfigType, input: HeroInput, events: NuisanceEvent[]): void => {
  const dt = STEP_SECONDS

  // 主人公: 向きのマスが空いていれば動く。アイコン・ことばがいれば、連鎖して 1 マス押し出す
  const hero = s.hero
  hero.cooldown = Math.max(0, hero.cooldown - dt)
  const removed = new Set<number>()
  if ((input.dx !== 0 || input.dy !== 0) && hero.cooldown === 0) {
    const col = hero.col + input.dx
    const row = hero.row + input.dy
    if (col >= 0 && row >= 0 && col < s.grid.cols && row < s.grid.rows) {
      const free = !s.obstacles.some(
        (o) => col >= o.col && col < o.col + o.size && row >= o.row && row < o.row + o.size
      )
      const scored = free ? pushChain(s, config, col, row, input.dx, input.dy, removed, events) : null
      if (scored !== null) {
        hero.col = col
        hero.row = row
        if (scored > 0) {
          // 得点したあとは、次に動けるまで少しかかる (得点のリズム)
          hero.cooldown = HERO_PUSH_INTERVAL_SECONDS
        } else {
          // 得点しない動きは、連鎖を切る。止まっているだけでは切れない
          hero.cooldown = HERO_MOVE_INTERVAL_SECONDS
          breakChain(s, events)
        }
      }
    }
  }
  if (removed.size) {
    s.nuisances = s.nuisances.filter((n) => !removed.has(n.id))
    s.words = s.words.filter((w) => !removed.has(w.id))
  }

  // 障害物: 時間が来たら消える。ことば: 時間が来たら (押されていなければ) 爆発する
  if (s.obstacles.some((o) => o.expiresAt <= s.elapsed))
    s.obstacles = s.obstacles.filter((o) => o.expiresAt > s.elapsed)
  explodeWords(s, events)

  // 残り時間: 1 秒ごとに 1 秒減る。0 になった時刻で、ゲームオーバー
  const before = s.timeLeft
  if (before - dt <= 0) {
    s.timeLeft = 0
    s.over = true
    s.endedAt = s.elapsed + Math.max(0, before)
    s.elapsed = s.endedAt
  } else {
    s.timeLeft = before - dt
    s.elapsed += dt
  }
}

// ---- 進行 ----

/** プレイヤーが途中でやめたときの終了。いまの時刻で終わりにする (結果・記録は、時間切れと同じ扱い) */
export const endGame = (state: GameState): GameState =>
  state.over ? state : { ...state, over: true, endedAt: state.elapsed }

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
    while (next < queue.length && queue[next].atSeconds <= stepEnd + 1e-9)
      spawnOne(s, config, queue[next++], rng, events)
    stepOnce(s, config, input, events)
    steps++
  }

  const reachedStepLimit = !s.over && s.elapsed + STEP_SECONDS <= untilSeconds + 1e-9
  return { state: s, pending: s.over ? [] : queue.slice(next), reachedStepLimit, events }
}

/** 貢献度の順位 (生んだ秒数の多い順。同じなら出現数の多い順) */
export const getContributionRanking = (state: GameState): Contribution[] =>
  Object.values(state.contributions).sort((a, b) => b.seconds - a.seconds || b.spawned - a.spawned)
