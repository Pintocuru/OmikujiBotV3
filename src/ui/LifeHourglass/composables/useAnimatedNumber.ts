// src/ui/LifeHourglass/composables/useAnimatedNumber.ts
import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/**
 * 値が変わったとき、表示用の数値を現在値から新しい値へ滑らかにカウントアップさせる。
 * 更新が間隔を置いて来ても止まって見えないよう、線形(durationMs ≒ 更新間隔)。
 */
export const useAnimatedNumber = (target: Ref<number>, durationMs = 1000) => {
  const display = ref(target.value)
  let from = display.value
  let to = display.value
  let startedAt = 0
  let raf = 0

  const step = (now: number) => {
    const t = Math.min(1, (now - startedAt) / durationMs)
    display.value = from + (to - from) * t
    raf = t < 1 ? requestAnimationFrame(step) : 0
  }

  watch(target, (value) => {
    from = display.value // 途中で新しい値が来ても、今の表示位置から続ける
    to = value
    startedAt = performance.now()
    if (!raf) raf = requestAnimationFrame(step)
  })

  onBeforeUnmount(() => {
    if (raf) cancelAnimationFrame(raf)
  })

  return display
}
