// src/console/game/OshikuraChain/scripts/nuisanceEngine.ts
// おしくらチェインの進行を決める純粋関数
import {
  GRID_COLS,
  GRID_ROWS,
  HERO_MOVE_INTERVAL_SECONDS,
  HERO_PUSH_INTERVAL_SECONDS,
  MAX_FOOTPRINT,
  MAX_STEPS_PER_ADVANCE,
  PUSH_WAVE_DELAY_SECONDS,
  STEP_SECONDS,
  GIANT_INTERVAL_SECONDS,
  MULTIPLIER_RESET_NOTICE_ABOVE,
  WORD_CHARS_PER_ITEM,
  WORD_MAX,
  WORD_MAX_PER_COMMENT,
  WORD_SECONDS_MAX,
  WORD_SECONDS_MIN,
} from './nuisanceConstants'
import type { GameMode, NuisanceConfigType } from './nuisanceConfig'
import { NO_INPUT, type HeroInput } from './heroInput'
import { getBossTraits, getNuisanceTraits, type NuisanceTraits } from './nuisanceTraits'
import { giftCoolAmountOf, giftProtectSecondsOf } from './nuisanceGift'
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

/**
 * コメントの文字 (「ことば」)。コメントの文字数に応じて降ってくる。1 マスを占める。
 * 主人公が押し出せる (押された先のアイコンも連鎖する)。押されないまま時間が経つと、爆発して、周囲 8 マスのアイコン・ことばを消す
 * (得点にはならない。連鎖の邪魔になる)。押されると、爆発までの時間は最初の長さに戻る。
 * ギフト効果により protected が true になったワードは時間経過で爆発しない。
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
  /** ギフトで保護されているか (保護されたワードは爆発しない) */
  protected?: boolean
}

/** 押し出せるもの (アイコン・ことば) */
type Body = Nuisance | Word

const isWord = (b: Body): b is Word => 'text' in b

/** ユーザーごとの貢献度 (その人のアイコン・ことばが生んだ秒数) */
export type Contribution = {
  userId: string
  userName: string
  profileImage: string
  /** 生んだ秒数 (獲得秒数 × 連鎖数の合計。残り時間が上限のときも、数える) */
  seconds: number
  /** 出現したアイコンの数 (無視されたコメントは数えない) */
  spawned: number
}

export type GameState = {
  /** このゲームのモード (スタート時の設定。結果の表示に使う) */
  gameMode: GameMode
  grid: GridSize
  /** 開始からの経過秒 (ゲームオーバーのあとは、残り時間が 0 になった時刻) */
  elapsed: number
  /** 残り時間 (秒)。0 になるとゲームオーバー (タイムアタックでは使わず、常に 0) */
  timeLeft: number
  hero: Hero
  nuisances: Nuisance[]
  /** コメントの文字 (ことば) */
  words: Word[]
  nextId: number
  contributions: Record<string, Contribution>
  /** いまの連鎖数と、その連鎖で得た秒数の合計 (連鎖が切れると、どちらも 0) */
  chain: number
  chainTotal: number
  /** 最大の連鎖数 */
  bestChain: number
  /** 倍率が 1 だった時刻 (開始からの秒)。初見コメントによるリセットやギフト冷却時に更新する */
  multiplierResetAt: number
  /** 演出で知らせた倍率の段階 (1〜。倍率の整数部分。上がったときだけ知らせ、リセットで 1 に戻る) */
  multiplierLevel: number
  /** 次に巨大化するユーザーを選ぶ時刻 (開始からの秒) */
  nextGiantAt: number
  /** ギフトによるワード保護効果の終了時刻 (開始からの経過秒) */
  wordProtectUntil: number
  /** 残り時間に足した秒数の合計 (上限で切られた分は含まない)。タイムアタックでは、獲得した秒数の合計 (目標との比較に使う) */
  gainedSeconds: number
  /** 押し出したアイコン / ことばの数 / 上限などで無視したコメントの数 */
  removedCount: number
  removedWordCount: number
  ignoredCount: number
  over: boolean
  /** タイムアタックで、目標の獲得秒数に届いて終わった (やめたときは false) */
  cleared: boolean
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
  /** 初見さん (その人の最初のコメント) か。設定が有効なら倍率が 1 に戻る */
  isFirst?: boolean
  /** コメントの本文。あれば、文字数に応じて「ことば」が降ってくる */
  comment?: string
  /** ギフトの金額。指定があれば、ワードを保護し、倍率を下げる (ギフトでなければ省略) */
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
      /** 得た秒数 (獲得秒数 × 連鎖数。上限で切られる前の値) */
      seconds: number
      /** 実際に、残り時間に足した秒数 (上限のとき、seconds より小さい) */
      applied: number
      /** この得点を含めた連鎖数と、その連鎖の秒数の合計 */
      chain: number
      chainTotal: number
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
      /** 倍率が、次の整数の段階に上がった (エンジンがヒートアップした)。isMax: 上限に達した */
      type: 'multiplierUp'
      level: number
      isMax: boolean
    }
  | {
      /** 初見さんのコメントで、上がっていた倍率が 1 に戻った (エンジンが冷えた) */
      type: 'multiplierReset'
      userName: string
    }
  | {
      /** ギフト効果の発動 (ワード保護とエンジン冷却) */
      type: 'giftReceived'
      userName: string
      price: number
      protectSeconds: number
      coolAmount: number
    }

export const createGame = (config: NuisanceConfigType, grid: GridSize = DEFAULT_GRID): GameState => ({
  gameMode: config.gameMode,
  grid,
  elapsed: 0,
  timeLeft: config.gameMode === 'timeAttack' ? 0 : config.initialSeconds,
  hero: { col: Math.floor(grid.cols / 2), row: Math.floor(grid.rows / 2), cooldown: 0 },
  nuisances: [],
  words: [],
  nextId: 1,
  contributions: {},
  chain: 0,
  chainTotal: 0,
  bestChain: 0,
  multiplierResetAt: 0,
  multiplierLevel: 1,
  nextGiantAt: GIANT_INTERVAL_SECONDS,
  wordProtectUntil: 0,
  gainedSeconds: 0,
  removedCount: 0,
  removedWordCount: 0,
  ignoredCount: 0,
  over: false,
  cleared: false,
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

// ---- 倍率 ----

/**
 * 倍率 (残り時間が減る速さ。エンジンのヒートアップ)。タイムアタックでは常に 1。
 * 耐久では、1 から始まり、時間が経つほど上がる (1 分ごとに multiplierRisePerMinute、上限は multiplierMax)
 * resetAt: 倍率が 1 だった時刻 (初見さんのコメントが届いた時刻)
 */
export const multiplierOf = (elapsed: number, resetAt: number, config: NuisanceConfigType): number => {
  if (config.gameMode === 'timeAttack') return 1 // タイムアタックは、時間が経っても上がらない
  const risen = config.multiplierRisePerMinute * (Math.max(0, elapsed - resetAt) / 60)
  return Math.min(config.multiplierMax, 1 + risen)
}

/** 倍率の段階 (整数部分。×2 になったら 2)。わずかな計算誤差で、段階を取りこぼさない */
export const multiplierLevelOf = (multiplier: number): number => Math.floor(multiplier + 1e-9)

// ---- 状態の複製 ----

const cloneState = (s: GameState): GameState => ({
  ...s,
  hero: { ...s.hero },
  nuisances: s.nuisances.map((n) => ({ ...n })),
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

/** コメントの文字を、5 文字ごとの「ことば」にして降らせる (最大 WORD_MAX_PER_COMMENT 個)。空きマスがなければ、そこで止める */
const dropWords = (s: GameState, request: SpawnRequest, rng: Rng, events: NuisanceEvent[]): void => {
  const chars = Array.from((request.comment ?? '').replace(/\s+/g, ''))
  if (!chars.length) return
  const count = Math.min(WORD_MAX_PER_COMMENT, Math.ceil(chars.length / WORD_CHARS_PER_ITEM))
  const isProtected = s.elapsed < s.wordProtectUntil
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
      protected: isProtected ? true : undefined,
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
  // 初見コメントによる倍率リセットは、設定で無効にできる
  if (config.resetMultiplierOnFirst && request.isFirst) {
    if (multiplierOf(s.elapsed, s.multiplierResetAt, config) > MULTIPLIER_RESET_NOTICE_ABOVE) {
      events.push({ type: 'multiplierReset', userName: request.userName })
    }
    s.multiplierResetAt = s.elapsed
    s.multiplierLevel = 1
  }

  // ギフト効果: 既存ワードの保護・新規ワード保護時間の延長・倍率の冷却 (引き下げ)
  if (request.giftPrice !== undefined && request.giftPrice > 0) {
    const price = request.giftPrice
    const protectSeconds = giftProtectSecondsOf(price)
    const coolAmount = giftCoolAmountOf(price)

    // 1. 盤面上にあるすべてのワードを保護する (効果終了後も爆発しない)
    for (const w of s.words) {
      w.protected = true
    }
    // 2. 保護時間中は、新しく出現するワードも保護対象にする
    const currentProtectLeft = Math.max(0, s.wordProtectUntil - s.elapsed)
    s.wordProtectUntil = s.elapsed + currentProtectLeft + protectSeconds

    // 3. 倍率を 金額/1000 だけ引き下げる (冷却効果)
    if (coolAmount > 0 && config.multiplierRisePerMinute > 0 && config.gameMode !== 'timeAttack') {
      const currentMultiplier = multiplierOf(s.elapsed, s.multiplierResetAt, config)
      const targetMultiplier = Math.max(1, currentMultiplier - coolAmount)
      const targetElapsedOffset = ((targetMultiplier - 1) / config.multiplierRisePerMinute) * 60
      s.multiplierResetAt = Math.max(0, s.elapsed - targetElapsedOffset)
      s.multiplierLevel = multiplierLevelOf(targetMultiplier)
    }

    events.push({
      type: 'giftReceived',
      userName: request.userName,
      price,
      protectSeconds,
      coolAmount,
    })
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

/** 画面の外へ押し出されたもの 1 つぶんの得点。連鎖数が 1 増え、獲得秒数 × 連鎖数が、残り時間に足される (上限あり) */
const awardScore = (
  s: GameState,
  config: NuisanceConfigType,
  body: Body,
  delaySeconds: number,
  events: NuisanceEvent[]
): void => {
  s.chain++
  s.bestChain = Math.max(s.bestChain, s.chain)
  const seconds = (isWord(body) ? config.wordSeconds : config.iconSeconds) * s.chain
  // 耐久: 残り時間に足す (上限あり)。タイムアタック: 残り時間はなく、獲得秒数を、そのまま合計する
  const applied =
    config.gameMode === 'timeAttack' ? seconds : Math.max(0, Math.min(seconds, config.maxSeconds - s.timeLeft))
  if (config.gameMode !== 'timeAttack') s.timeLeft += applied
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
 * 主人公は巻き込まれない。ギフトで保護された (protected) ことばは爆発しない。
 */
const explodeWords = (s: GameState, events: NuisanceEvent[]): void => {
  const due = s.words.filter((w) => !w.protected && w.expiresAt <= s.elapsed)
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
      const scored = pushChain(s, config, col, row, input.dx, input.dy, removed, events)
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

  // ことば: 時間が来たら (押されておらず、保護されていなければ) 爆発する
  explodeWords(s, events)

  // タイムアタック: 残り時間はない。獲得秒数の合計が目標に届いた時刻 (得点した刻み) で、クリア
  if (config.gameMode === 'timeAttack') {
    if (s.gainedSeconds >= config.targetSeconds) {
      s.over = true
      s.cleared = true
      s.endedAt = s.elapsed
    } else {
      s.elapsed += dt
    }
    return
  }

  // 倍率: 時間が経つほど上がる。整数の段階を超えたら、演出に知らせる (エンジンのヒートアップ)
  const multiplier = multiplierOf(s.elapsed, s.multiplierResetAt, config)
  const level = multiplierLevelOf(multiplier)
  if (level > s.multiplierLevel) {
    events.push({ type: 'multiplierUp', level, isMax: multiplier >= config.multiplierMax - 1e-9 })
    s.multiplierLevel = level
  }

  // 残り時間: 1 秒ごとに「倍率」秒減る。0 になった時刻 (実時間) で、ゲームオーバー
  const before = s.timeLeft
  const drain = dt * multiplier
  if (before - drain <= 0) {
    s.timeLeft = 0
    s.over = true
    s.endedAt = s.elapsed + Math.max(0, before) / multiplier
    s.elapsed = s.endedAt
  } else {
    s.timeLeft = before - drain
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
