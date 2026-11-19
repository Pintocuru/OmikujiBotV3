// src/editor/preview/EvaluationBlock/composables/useVariablePolling.ts
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { useAppStore } from '@/generator/stores/useAppStore'
import type { VarEntry, VarValue } from '../evaluationStats'

// PlaceholderVariable はリアクティブではないため、一定間隔で読み直す
const POLL_MS = 500

export function useVariablePolling(onChanged: (keys: string[]) => void) {
  const appStore = useAppStore()
  const entries = shallowRef<VarEntry[]>([])
  const paused = ref(false)

  let prev = new Map<string, VarValue>()
  let timer: ReturnType<typeof setInterval> | null = null

  function refresh() {
    const next = Object.entries(appStore.placeholderVariable.getAll()).sort(([a], [b]) => a.localeCompare(b))

    // 前回から増えた・変わった変数を通知
    const changed = next.filter(([key, value]) => prev.get(key) !== value).map(([key]) => key)
    if (prev.size > 0 && changed.length > 0) onChanged(changed)

    prev = new Map(next)
    entries.value = next
  }

  function set(key: string, value: VarValue) {
    appStore.placeholderVariable.getEvaluator().set(key, value)
    refresh()
  }

  function remove(key: string) {
    appStore.placeholderVariable.remove(key)
    refresh()
  }

  onMounted(() => {
    refresh()
    timer = setInterval(() => {
      if (!paused.value) refresh()
    }, POLL_MS)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { entries, paused, set, remove }
}
