// src/ui/common/useProgressTracker.ts
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { useAppStore } from '@/generator/stores/useAppStore'
import { readBuiltinCounter } from './useStreamCounters'
import type { ProgressCounterKey, ProgressSourceType } from '@/types/ui'
import {
  createProgressState,
  readSource,
  stepProgress,
  type ProgressState,
  type ProgressValueReader,
} from './progressSource'

/** store の値を確認する間隔(ミリ秒) */
const POLL_INTERVAL_MS = 1000

/**
 * 項目ごとの「自動の進捗」を持つもの
 * - values: 自動の進捗(元の値の単位。ギフト金額なら円)。manual の項目は 0
 * - rebase: 全項目の基準を今の値に取り直す(カードを作り直したとき)
 * - rebaseCell: 1 項目だけ基準を取り直す(お題を入れ替えたとき)
 */
export type ProgressTracker = {
  values: Ref<number[]>
  rebase: (sources: ProgressSourceType[]) => void
  rebaseCell: (index: number, source: ProgressSourceType) => void
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

/**
 * 配信中の数値(統計・サービスの情報)と、評価ブロックの変数を読む
 * これらは reactive ではないので、一定間隔で確認する(bot メッセージが出ないときも更新される)
 */
const useStoreReader = (): ProgressValueReader => {
  const appStore = useAppStore()

  return {
    counter: (key: ProgressCounterKey) => toNumber(readBuiltinCounter(appStore, key)),
    variable: (name: string) => toNumber(appStore.placeholderVariable.getEvaluator().get(name)),
  }
}

export const useProgressTracker = (): ProgressTracker => {
  const reader = useStoreReader()
  const values = ref<number[]>([])
  let states: ProgressState[] = []
  let timer: ReturnType<typeof setInterval> | undefined

  const tick = () => {
    values.value = states.map((state) => stepProgress(state, readSource(reader, state.source)))
  }

  const rebase = (sources: ProgressSourceType[]) => {
    states = sources.map((source) => createProgressState(source, readSource(reader, source)))
    tick()
  }

  const rebaseCell = (index: number, source: ProgressSourceType) => {
    if (index < 0 || index >= states.length) return
    states[index] = createProgressState(source, readSource(reader, source))
    tick()
  }

  onMounted(() => {
    timer = setInterval(tick, POLL_INTERVAL_MS)
  })
  onBeforeUnmount(() => clearInterval(timer))

  return { values, rebase, rebaseCell }
}
