// src/ui/FlashBanner/composables/useTickerLoop.ts
import { computed, type CSSProperties } from 'vue'
import { FLASH_BANNER_SCROLL_SPEED } from '@/types/ui'

const AVG_CHAR_WIDTH_PX = 40 // text-5xl の 1 文字あたりの概算幅
const MIN_DURATION_SECONDS = 3

const plainLength = (html: string) => html.replace(/<[^>]*>/g, '').length

/**
 * 流しっぱなしのスクロール(scroll / ticker)
 * 文言を繰り返し並べて、1 つぶん左へずらすのをループする
 */
export function useTickerLoop(getMessage: () => string, getSpeed: () => number) {
  const length = computed(() => plainLength(getMessage()))

  // 文言どうしの空白 (px)
  const gapPx = computed(() => {
    if (length.value < 20) return 120
    if (length.value < 50) return 80
    return 60
  })

  // 文言を何回並べるか
  const repeat = computed(() => {
    if (length.value < 15) return 8
    if (length.value < 40) return 6
    return 4
  })

  // 1 つぶんの概算幅 ÷ 速度(px/sec)
  const duration = computed(() => {
    const speed = getSpeed() > 0 ? getSpeed() : FLASH_BANNER_SCROLL_SPEED.default
    return Math.max(MIN_DURATION_SECONDS, (length.value * AVG_CHAR_WIDTH_PX + gapPx.value) / speed)
  })

  const tickerStyle = computed<CSSProperties>(() => ({
    '--ticker-shift': `calc(-100% / ${repeat.value})`,
    '--ticker-duration': `${duration.value}s`,
  }))

  /** 2 つめ以降の文言の左に空白を入れる */
  const segmentStyle = (index: number): CSSProperties => (index > 1 ? { paddingLeft: `${gapPx.value}px` } : {})

  return { repeat, tickerStyle, segmentStyle }
}
