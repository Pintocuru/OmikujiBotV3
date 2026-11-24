// src/editor/preview/EvaluationBlock/composables/useVariableEntries.ts
import { onMounted, ref, shallowRef, watch } from 'vue'
import { useAppStore } from '@/generator/stores/useAppStore'
import type { VarEntry, VarValue } from '../evaluationStats'

/**
 * 評価ブロックの変数の一覧
 * PlaceholderVariable の保存先がリアクティブなので、変数が変わったら、その場で一覧を更新する。
 * paused の間は一覧を止めておき、戻したときに最新へ更新する。
 */
export function useVariableEntries(onChanged: (keys: string[]) => void) {
  const appStore = useAppStore()
  const entries = shallowRef<VarEntry[]>([])
  const paused = ref(false)

  let prev = new Map<string, VarValue>()

  function refresh() {
    const next = Array.from(appStore.placeholderVariable.getEvaluator().entries()).sort(([a], [b]) => a.localeCompare(b))

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
    appStore.placeholderVariable.delete(key)
    refresh()
  }

  watch(
    () => Array.from(appStore.placeholderVariable.getEvaluator().entries()),
    () => {
      if (!paused.value) refresh()
    }
  )
  watch(paused, (isPaused) => {
    if (!isPaused) refresh()
  })

  onMounted(refresh)

  return { entries, paused, set, remove }
}
