// src/console/game/UserRace/scripts/raceEngine.ts
// ユーザーレースの進行を決める純粋関数 (画面・通信・時計に依存しない。乱数だけを外から渡す)
import type { GameLogType, UserListItemType, UserStatsUpdateType } from '@/types/api'

/** 走る人数 (多すぎると、レーンの名前が読めない) */
export const MAX_RACERS = 8
export const MIN_RACERS = 2
/** 平均の所要時間 (秒)。全員が同じ平均の速さで走り、速さの波だけが違う (誰が勝つかは運) */
export const RACE_SECONDS = 14
/** 上位(得点の対象)が決まってから、残りの人を走らせる時間 (秒) */
export const FINISH_GRACE_SECONDS = 2
/** ゲームログの eventKey (GameLog の画面では、この名前で一覧に出る) */
export const GAME_KEY = 'userRace'
/** 1位・2位・3位の得点 */
export const RACE_POINTS = [3, 2, 1] as const

export type Rng = () => number

/** 種から作る乱数 (mulberry32)。同じ種なら同じレースになるので、テストしやすい */
export const createRng = (seed: number): Rng => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type RacerProfile = Pick<UserListItemType, 'userId' | 'userName' | 'profileImage'>

export type Racer = RacerProfile & {
  lane: number
  /** 0 (スタート) 〜 1 (ゴール) */
  position: number
  /** ゴールした時刻 (レース開始からの秒)。まだなら null */
  finishedAt: number | null
  // 速さの波 (2つの正弦波の重ね合わせ)
  amp: number
  f1: number
  f2: number
  p1: number
  p2: number
}

export type RaceState = {
  racers: Racer[]
  elapsed: number
  /** 上位(RACE_POINTS の人数)がゴールした時刻。まだなら null */
  podiumAt: number | null
  finished: boolean
}

export type RaceResult = { rank: number; userId: string; userName: string; points: number }

/** 全員の最終順位 (ゴールした順。ゴールしていない人は、進んだ位置の順で、その後ろ) */
export type FinalRank = { rank: number; racer: Racer }

const shuffle = <T>(items: T[], rng: Rng): T[] => {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 走る人を選ぶ。ピン留めのユーザーを優先し、残りはランダム */
export const pickRacers = (users: UserListItemType[], rng: Rng, max = MAX_RACERS): RacerProfile[] => {
  const pinned = shuffle(
    users.filter((u) => u.pinned),
    rng
  )
  const others = shuffle(
    users.filter((u) => !u.pinned),
    rng
  )
  return [...pinned, ...others]
    .slice(0, max)
    .map(({ userId, userName, profileImage }) => ({ userId, userName, profileImage }))
}

export const createRace = (profiles: RacerProfile[], rng: Rng): RaceState => ({
  racers: profiles.map((p, lane) => ({
    ...p,
    lane,
    position: 0,
    finishedAt: null,
    amp: 0.45 + rng() * 0.25, // 速さの揺れ幅 (最も遅いときでも、平均の 3 割は進む)
    f1: 0.15 + rng() * 0.2,
    f2: 0.35 + rng() * 0.3,
    p1: rng() * Math.PI * 2,
    p2: rng() * Math.PI * 2,
  })),
  elapsed: 0,
  podiumAt: null,
  finished: false,
})

/** 時刻 t の速さ (1 秒あたりに進む割合)。平均は 1 / RACE_SECONDS */
const speedAt = (r: Racer, t: number): number =>
  (1 / RACE_SECONDS) *
  (1 + r.amp * (0.6 * Math.sin(2 * Math.PI * r.f1 * t + r.p1) + 0.4 * Math.sin(2 * Math.PI * r.f2 * t + r.p2)))

/** dt 秒だけ進める (dt は 0.1 秒以下を想定)。元の state は変えない */
export const stepRace = (state: RaceState, dt: number): RaceState => {
  if (state.finished || dt <= 0) return state
  const elapsed = state.elapsed + dt

  const racers = state.racers.map((r) => {
    if (r.finishedAt !== null) return r
    const move = ((speedAt(r, state.elapsed) + speedAt(r, elapsed)) / 2) * dt
    const position = r.position + move
    if (position < 1) return { ...r, position }
    // ゴールした。dt の途中で越えた時刻を求める (同じ刻みで越えた人の順位を、正しく付けるため)
    return { ...r, position: 1, finishedAt: state.elapsed + dt * ((1 - r.position) / move) }
  })

  const goalCount = racers.filter((r) => r.finishedAt !== null).length
  const podiumSize = Math.min(RACE_POINTS.length, racers.length)
  const podiumAt = state.podiumAt ?? (goalCount >= podiumSize ? elapsed : null)
  const finished = goalCount === racers.length || (podiumAt !== null && elapsed - podiumAt >= FINISH_GRACE_SECONDS)

  return { racers, elapsed, podiumAt, finished }
}

/** ゴールした人の順位 (ゴールが早い順)。ゴールしていない人は含まない */
export const getRanking = (state: RaceState): { rank: number; racer: Racer }[] =>
  state.racers
    .filter((r): r is Racer & { finishedAt: number } => r.finishedAt !== null)
    .sort((a, b) => a.finishedAt - b.finishedAt)
    .map((racer, i) => ({ rank: i + 1, racer }))

/** 全員の最終順位。ゴールした人 → ゴールしていない人 (位置が先の順) */
export const getFinalRanking = (state: RaceState): FinalRank[] => {
  const goal = getRanking(state).map(({ racer }) => racer)
  const rest = state.racers
    .filter((r) => r.finishedAt === null)
    .sort((a, b) => b.position - a.position || a.lane - b.lane)
  return [...goal, ...rest].map((racer, i) => ({ rank: i + 1, racer }))
}

/** 得点の対象 (1〜3位) */
export const getResults = (state: RaceState): RaceResult[] =>
  getRanking(state)
    .slice(0, RACE_POINTS.length)
    .map(({ rank, racer }) => ({ rank, userId: racer.userId, userName: racer.userName, points: RACE_POINTS[rank - 1] }))

/** 得点の加算リクエスト (サーバー側で加算するので、他の操作と同時でも取りこぼさない) */
export const buildScoreUpdates = (results: RaceResult[]): UserStatsUpdateType[] =>
  results.map((r) => ({ userId: r.userId, addScore: r.points }))

/**
 * ゲームログ (GameLog) に残す記録。走った全員ぶんを 1 件ずつ作る
 * - score: そのレースで得た得点 (1位 3 / 2位 2 / 3位 1 / それ以外 0)。サーバー側で累計ポイントになる
 * - item: 順位とゴールタイムの表示 (例: '1位 12.3秒')。ゴールしていない人はタイムなし
 * - id: レースごとの ID + userId。同じレースを再送しても、サーバーが二重に保存しない
 * ユーザーの「得点」(update-user-stats) とは別の記録で、得点の加算とは関係なく残る
 */
export const buildGameLogs = (state: RaceState, raceId: string, createdAt: number = Date.now()): GameLogType[] =>
  getFinalRanking(state).map(({ rank, racer }) => ({
    id: `${raceId}:${racer.userId}`,
    userId: racer.userId,
    userName: racer.userName,
    score: RACE_POINTS[rank - 1] ?? 0,
    item: racer.finishedAt === null ? `${rank}位` : `${rank}位 ${racer.finishedAt.toFixed(1)}秒`,
    createdAt,
  }))
