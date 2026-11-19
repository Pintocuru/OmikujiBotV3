// src/editor/preview/EvaluationBlock/composables/useFlashKeys.ts
import { onUnmounted, shallowRef } from 'vue'

const FLASH_MS = 1200

export function useFlashKeys() {
  const flashKeys = shallowRef<Set<string>>(new Set())
  const timers = new Set<ReturnType<typeof setTimeout>>()

  function flash(keys: string[]) {
    flashKeys.value = new Set([...flashKeys.value, ...keys])
    const timer = setTimeout(() => {
      timers.delete(timer)
      const rest = new Set(flashKeys.value)
      keys.forEach((key) => rest.delete(key))
      flashKeys.value = rest
    }, FLASH_MS)
    timers.add(timer)
  }

  onUnmounted(() => timers.forEach(clearTimeout))

  return { flashKeys, flash }
}
