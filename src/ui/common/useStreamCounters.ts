// src/ui/common/useStreamCounters.ts
import { computed, getCurrentScope, onScopeDispose, reactive, ref, toRefs, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'

/**
 * useStreamCounters が最初から持っているカウンターのキー(組み込みカウンター)。
 * これ以外のキーは「変数カウンター」(評価ブロックの変数)として扱う。
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
 * 組み込みカウンター 1 つの現在値を Service から読む。
 * キーと Service の対応はここだけに書く (useProgressTracker などもこれを使う)。
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
 * 組み込みカウンターのスナップショット(store ごとに 1 つ、全 UI で共有する)
 * Service が正本。Service は変更をリアクティブに知らせる仕組みを持たないため、
 * 各 Service の変更通知(onChange / subscribe)を受けて、ここへ読み取り直す。
 */
type SharedCounters = {
  base: Record<BuiltinCounterKey, number>
  /** base を読み取り直すたびに増やす (変数カウンターの再取得のきっかけ) */
  revision: Ref<number>
  /** 使っているインスタンス数。0 → 1 で購読を始め、1 → 0 で購読を止める */
  users: number
  stop: (() => void) | null
}

const sharedByStore = new WeakMap<AppStore, SharedCounters>()

const refreshBase = (store: AppStore, shared: SharedCounters) => {
  for (const key of BUILTIN_COUNTER_KEYS) shared.base[key] = readBuiltinCounter(store, key)
  shared.revision.value++
}

const acquireShared = (store: AppStore): SharedCounters => {
  let shared = sharedByStore.get(store)
  if (!shared) {
    shared = {
      base: reactive(Object.fromEntries(BUILTIN_COUNTER_KEYS.map((key) => [key, 0]))) as Record<
        BuiltinCounterKey,
        number
      >,
      revision: ref(0),
      users: 0,
      stop: null,
    }
    sharedByStore.set(store, shared)
  }

  if (shared.users++ === 0) {
    const target = shared
    const refresh = () => refreshBase(store, target)
    refresh() // マウントを待たず、最初の描画から正しい値を出す
    const unsubscribers = [
      store.streamStats.onChange(refresh),
      store.reactionStats.onChange(refresh),
      // commenter(ユーザー数)。配信リセットで userStats が消えたときも通知される
      store.userStats.onChange(refresh),
      // upVote / viewer / follower
      store.serviceMetaStore.subscribe(refresh),
    ]
    shared.stop = () => unsubscribers.forEach((off) => off())
  }
  return shared
}

const releaseShared = (shared: SharedCounters) => {
  if (--shared.users > 0) return
  shared.stop?.()
  shared.stop = null
}

/**
 * カウンター取得コンポーザブル
 * - 組み込みカウンター: 共有スナップショットを参照する (インスタンスごとのコピーも購読も持たない)
 * - 変数カウンター(評価ブロック): variableLabelMap のキーを、評価ブロックの変数から取得する
 * コンポーネントの setup(または effectScope)内で呼ぶこと。
 */
export function useStreamCounters(variableLabelMap: Ref<Record<string, string>>) {
  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)

  const shared = acquireShared(appStore)
  if (getCurrentScope()) onScopeDispose(() => releaseShared(shared))

  // 組み込みカウンターは共有スナップショットへの参照。変数カウンターだけ、このインスタンスが書き込む
  const counters = reactive({ ...toRefs(shared.base) }) as Record<string, number>

  // variableLabels （variableLabelMap をそのまま公開）
  const variableLabels = computed<Record<string, string>>(() => variableLabelMap.value)

  // 評価ブロックから値を取得
  const updateVariableCounters = () => {
    const evaluator = appStore.placeholderVariable.getEvaluator()
    for (const key of Object.keys(variableLabelMap.value)) {
      if (BUILTIN_KEY_SET.has(key)) continue // 組み込みカウンターの値を、変数で上書きしない
      const v = evaluator.get(key)
      counters[key] = typeof v === 'number' ? v : 0
    }
  }

  // bot メッセージの変化、または組み込みカウンターの更新をきっかけに、変数カウンターを取得し直す
  watchEffect(() => {
    void botMessages.value.length
    void shared.revision.value
    updateVariableCounters()
  })

  return {
    counters,
    variableLabels,
  }
}
