// src/ui/common/progressSource.ts
// 「何で進むか」の計算(純粋な関数。store には触れない)
import type { ProgressCounterKey, ProgressSourceType } from '@/types/ui'

/** 配信の数値と変数を読む窓口(実体は useProgressTracker が store から作る) */
export type ProgressValueReader = {
  counter: (key: ProgressCounterKey) => number
  variable: (name: string) => number
}

/**
 * 配信の統計(ユーザー・コメント・ギフト・リアクション)は、配信開始時に 0 へ戻る。
 * これらは値が減ったら「リセットされた」と見て、基準を 0 に戻す。
 * (チャンネル登録・高評価は、減っても配信のリセットではないので対象外)
 */
const RESETTABLE_COUNTERS: readonly ProgressCounterKey[] = [
  'syoken',
  'commenter',
  'totalComments',
  'totalPrice',
  'reaction',
]

/** 瞬間の値なので、増加分ではなく「基準のあとの最大値」を使うもの */
const PEAK_COUNTERS: readonly ProgressCounterKey[] = ['viewer']

export type ProgressState = {
  source: ProgressSourceType
  /** 基準(この値からの増加分を進捗にする) */
  baseline: number
  /** 前回読んだ値(リセットの検知用) */
  last: number
  /** 基準のあとの最大値 */
  peak: number
}

export const readSource = (reader: ProgressValueReader, source: ProgressSourceType): number => {
  if (source.type === 'counter') return reader.counter(source.key)
  if (source.type === 'variable') return reader.variable(source.name)
  return 0
}

/** 基準を取る(カードを作ったとき・お題を入れ替えたとき) */
export const createProgressState = (source: ProgressSourceType, current: number): ProgressState => ({
  source,
  baseline: current,
  last: current,
  peak: current,
})

/**
 * 今の値を反映して、自動の進捗(元の値の単位。ギフト金額なら円)を返す
 * - manual: 常に 0
 * - 同時視聴者数: 基準のあとの最大値
 * - 統計(初見・コメント・ギフトなど): 基準からの増加分。値が減ったら配信のリセットとして基準を 0 に戻す
 * - そのほか(チャンネル登録・高評価・変数): 基準からの増加分(減った分は 0 で止める)
 */
export const stepProgress = (state: ProgressState, current: number): number => {
  const { source } = state
  if (source.type === 'manual') return 0

  if (source.type === 'counter' && PEAK_COUNTERS.includes(source.key)) {
    state.peak = Math.max(state.peak, current)
    state.last = current
    return state.peak
  }

  if (source.type === 'counter' && RESETTABLE_COUNTERS.includes(source.key) && current < state.last) {
    state.baseline = 0
  }
  state.last = current
  return Math.max(0, current - state.baseline)
}
