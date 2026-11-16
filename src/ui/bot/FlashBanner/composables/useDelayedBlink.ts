// src/ui/FlashBanner/composables/useDelayedBlink.ts
import { ref } from 'vue'

export interface UseDelayedBlinkOptions {
  transitionDuration?: number // 切り替えアニメーションの完了待ち時間(ミリ秒)
  blinkDuration?: number // 点滅の継続時間(ミリ秒)
  blinkClassName?: string // 点滅用の CSS クラス名
}

/** ラベルの点滅用クラスを、一定時間だけ付ける */
export function useDelayedBlink(options: UseDelayedBlinkOptions = {}) {
  const { transitionDuration = 350, blinkDuration = 750, blinkClassName = 'fb-blink' } = options

  const blinkClass = ref('')
  let timer: ReturnType<typeof setTimeout> | null = null

  const clearTimer = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }

  /** 点滅を始める(連続で呼ばれたら、最後の 1 回だけ有効) */
  const triggerBlink = (withDelay = true) => {
    clearTimer()
    timer = setTimeout(
      () => {
        blinkClass.value = blinkClassName
        timer = setTimeout(() => {
          blinkClass.value = ''
          timer = null
        }, blinkDuration)
      },
      withDelay ? transitionDuration : 0
    )
  }

  /** 点滅を止める(アンマウント時) */
  const stopBlink = () => {
    clearTimer()
    blinkClass.value = ''
  }

  return { blinkClass, triggerBlink, stopBlink }
}
