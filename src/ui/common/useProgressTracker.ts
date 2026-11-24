// src/ui/common/useProgressTracker.ts
import { ref, shallowRef, watch, type Ref } from 'vue'
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
 * どちらも Service のリアクティブな状態なので、watch の中で読めば、変わったときに通知される
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
  const states = shallowRef<ProgressState[]>([])

  const sync = () => {
    values.value = states.value.map((state) => stepProgress(state, readSource(reader, state.source)))
  }

  // 読んでいる値 (配信の数値・変数) が変わったら、その場で進捗に反映する。bot メッセージが出ないときも更新される。
  // (viewer の最大値も、取りこぼさず拾える)
  watch(() => states.value.map((state) => readSource(reader, state.source)), sync)

  const rebase = (sources: ProgressSourceType[]) => {
    states.value = sources.map((source) => createProgressState(source, readSource(reader, source)))
    sync()
  }

  const rebaseCell = (index: number, source: ProgressSourceType) => {
    if (index < 0 || index >= states.value.length) return
    const next = [...states.value]
    next[index] = createProgressState(source, readSource(reader, source))
    states.value = next
    sync()
  }

  return { values, rebase, rebaseCell }
}
