// src/ui/LifeHourglass/composables/usePop.ts
import { onUnmounted, ref } from 'vue'

/** 一定時間だけ true になるフラグ。連続で呼ぶとアニメーションを再生し直す */
export const usePop = (durationMs = 600) => {
  const active = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const trigger = () => {
    active.value = false
    // クラスを付け直してアニメーションを再生し直す
    requestAnimationFrame(() => {
      active.value = true
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        active.value = false
      }, durationMs)
    })
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { active, trigger }
}
