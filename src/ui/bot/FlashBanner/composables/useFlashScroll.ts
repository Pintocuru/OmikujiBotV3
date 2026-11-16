// src/ui/bot/FlashBanner/composables/useFlashScroll.ts
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { FlashBannerType } from '@/types/ui'
import { FLASH_BANNER_SCROLL_SPEED } from '@/types/ui'

interface UseFlashScrollOptions {
  /** 実際に表示している文言(切り替えアニメーションの後に変わる値を渡す) */
  getMessage: () => string
  getSettings: () => FlashBannerType
}

const DOM_RENDER_DELAY = 50
const SCROLL_THRESHOLD = 20
const SCROLL_DISTANCE_RATE = 0.6 // fb-scroll の translateX(-60%) に合わせる

/**
 * 往復スクロール(長文のときだけ動く)の制御
 * 文字が枠より長いときだけ、スクロール用のクラスを返す
 */
export function useFlashScroll({ getMessage, getSettings }: UseFlashScrollOptions) {
  const textRef = ref<HTMLElement | null>(null)
  const containerRef = ref<HTMLElement | null>(null)
  const scrollDuration = ref(14)
  const scrollClass = ref<'fb-scroll-loop' | 'fb-scroll-fade' | ''>('')

  const checkScrollNeeded = async () => {
    await nextTick()
    await new Promise<void>((resolve) => setTimeout(resolve, DOM_RENDER_DELAY))

    if (!textRef.value || !containerRef.value) {
      scrollClass.value = ''
      return
    }

    const textWidth = textRef.value.scrollWidth
    const containerWidth = containerRef.value.clientWidth
    if (textWidth <= containerWidth + SCROLL_THRESHOLD) {
      scrollClass.value = ''
      return
    }

    const settings = getSettings()
    const speed = settings.scrollSpeed > 0 ? settings.scrollSpeed : FLASH_BANNER_SCROLL_SPEED.default
    scrollDuration.value = Math.max(3, (textWidth * SCROLL_DISTANCE_RATE) / speed)
    scrollClass.value = settings.scrollReturnMode === 'fade' ? 'fb-scroll-fade' : 'fb-scroll-loop'
  }

  // 文言・速度・戻り方が変わったら測り直す(測っている間はスクロールを止める)
  watch(
    () => [getMessage(), getSettings().scrollSpeed, getSettings().scrollReturnMode],
    () => {
      scrollClass.value = ''
      void checkScrollNeeded()
    },
    { immediate: true }
  )

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(() => void checkScrollNeeded())
      resizeObserver.observe(containerRef.value)
    }
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return { textRef, containerRef, scrollDuration, scrollClass, checkScrollNeeded }
}
