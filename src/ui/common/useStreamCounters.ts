// src/ui/common/useStreamCounters.ts
import { computed } from 'vue'
import type { Ref } from 'vue'
import { useAppStore } from '@/generator/stores/useAppStore'

/**
 * useStreamCounters が最初から持っているカウンターのキー(組み込みカウンター)。
 * これ以外のキーは「変数カウンター」(評価ブロックの変数)として扱う。
 *
 * 新しいカウンターを足すときは、次の 2 つを書く (購読や更新通知は要らない)。
 *   1. 値を持つ Service に、リアクティブな状態として持たせる (createAppServices の説明を参照)
 *   2. このキーと、下の readBuiltinCounter に、キーと読み取り方を足す
 * DeadAir・LiverBingo のキー一覧との食い違いは、useStreamCounters.test.ts が検知する。
 */
export const BUILTIN_COUNTER_KEYS = [
  'upVote',
  'viewer',
  'follower',
  'syoken',
  'commenter',
  'lc',
  'totalComments',
  'totalPrice',
  'reaction',
] as const
export type BuiltinCounterKey = (typeof BUILTIN_COUNTER_KEYS)[number]

const BUILTIN_KEY_SET: ReadonlySet<string> = new Set(BUILTIN_COUNTER_KEYS)

type AppStore = ReturnType<typeof useAppStore>

/**
 * 組み込みカウンター 1 つの現在値を、Service から読む。
 * キーと Service の対応はここだけに書く (useProgressTracker などもこれを使う)。
 * Service の値はリアクティブなので、computed / watch の中で呼べば、値が変わると再計算される。
 */
export function readBuiltinCounter(store: AppStore, key: BuiltinCounterKey): number {
  switch (key) {
    case 'upVote':
    case 'viewer':
    case 'follower':
      return store.serviceMetaStore.getCurrent()?.[key] ?? 0
    case 'syoken':
    case 'totalComments':
    case 'totalPrice':
      return store.streamStats.getStats()[key]
    case 'lc':
      return store.streamStats.getStats().liveComments
    case 'commenter':
      return store.userStats.getUniqueCount()
    case 'reaction':
      return store.reactionStats.getGrandTotal()
  }
}

/**
 * カウンター取得コンポーザブル
 * Service が正本で、ここは値を持たない (コピーも購読もしない)。counters は Service の値から作る computed。
 * - 組み込みカウンター: readBuiltinCounter
 * - 変数カウンター(評価ブロック): variableLabelMap のキーを、評価ブロックの変数から取得する
 */
export function useStreamCounters(variableLabelMap: Ref<Record<string, string>>) {
  const appStore = useAppStore()

  // variableLabels （variableLabelMap をそのまま公開）
  const variableLabels = computed<Record<string, string>>(() => variableLabelMap.value)

  const counters = computed<Record<string, number>>(() => {
    const result: Record<string, number> = {}
    for (const key of BUILTIN_COUNTER_KEYS) result[key] = readBuiltinCounter(appStore, key)

    const evaluator = appStore.placeholderVariable.getEvaluator()
    for (const key of Object.keys(variableLabelMap.value)) {
      if (BUILTIN_KEY_SET.has(key)) continue // 組み込みカウンターの値を、変数で上書きしない
      const v = evaluator.get(key)
      result[key] = typeof v === 'number' ? v : 0
    }
    return result
  })

  return {
    counters,
    variableLabels,
  }
}
