// src/ui/common/useStreamCounters.ts
import { reactive, computed, watchEffect, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'

/**
 * カウンター取得コンポーザブル
 */
export function useStreamCounters(variableLabelMap: Ref<Record<string, string>>) {
  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)

  // カウンター state
  // TODO:これってstoreのやつを使えないのか?
  const counters = reactive<Record<string, number>>({
    upVote: 0,
    viewer: 0,
    follower: 0,
    syoken: 0,
    commenter: 0,
    lc: 0,
    totalComments: 0,
    totalPrice: 0,
    reaction: 0,
  })

  // variableLabels （variableLabelMap をそのまま公開）
  const variableLabels = computed<Record<string, string>>(() => variableLabelMap.value)

  // 取得関数
  const fetchStats = () => {
    const { liveComments, totalComments, syoken, totalPrice } = appStore.streamStats.getStats()
    const reaction = appStore.reactionStats.getGrandTotal()
    Object.assign(counters, {
      lc: liveComments,
      totalComments,
      commenter: appStore.userStats.getUniqueCount(),
      syoken,
      totalPrice,
      reaction,
    })
  }

  // 評価ブロックから値を取得
  const updateVariableCounters = () => {
    const evaluator = appStore.placeholderVariable.getEvaluator()
    for (const key of Object.keys(variableLabelMap.value)) {
      const v = evaluator.get(key)
      counters[key] = typeof v === 'number' ? v : 0
    }
  }

  // リアクティブ更新（botMessages の変化をトリガーに統計を再取得）
  const previewTick = computed(() => botMessages.value.length)

  watchEffect(() => {
    const _ = previewTick.value
    fetchStats()
    updateVariableCounters()
  })

  // Meta（upVote / viewer / follower）の購読
  let unsubscribeMeta: (() => void) | null = null

  onMounted(() => {
    const initial = appStore.serviceMetaStore.getCurrent()
    Object.assign(counters, {
      upVote: initial?.upVote ?? 0,
      viewer: initial?.viewer ?? 0,
      follower: initial?.follower ?? 0,
    })

    unsubscribeMeta = appStore.serviceMetaStore.subscribe((event) => {
      Object.assign(counters, {
        upVote: event.current.upVote,
        viewer: event.current.viewer,
        follower: event.current.follower,
      })
    })

    appStore.streamStats.setOnReset(fetchStats)
  })

  onUnmounted(() => {
    appStore.streamStats.setOnReset(null)
    unsubscribeMeta?.()
  })

  return {
    counters,
    variableLabels,
  }
}
