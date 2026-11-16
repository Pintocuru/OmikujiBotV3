// src/ui/LifeHourglass/composables/useViewerIntensity.ts
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

/** 同接の記録間隔(ミリ秒) */
export const VIEWER_SNAPSHOT_INTERVAL_MS = 5000
/** 強弱の分母の下限(最大同接がこれ未満でも、20人を 100% とみなす) */
export const VIEWER_INTENSITY_MIN_DENOMINATOR = 20

/**
 * 同接から「演出の強さ(0〜1)」を出す。
 * - maxViewer: 記録した最大同接
 * - viewerSnapshot: 5秒ごとに記録する同接
 * - intensity: 現在の同接 ÷ max(20, 最大同接)
 * - 現在の同接が viewerSnapshot を超えたら onSurge を呼ぶ(数値のポップ用)
 */
export const useViewerIntensity = (viewer: Ref<number>, onSurge: () => void) => {
  const current = computed(() => (Number.isFinite(viewer.value) ? Math.max(0, viewer.value) : 0))

  const maxViewer = ref(current.value)
  const viewerSnapshot = ref(current.value) // 起動直後に増加扱いにならないよう、現在値で初期化

  const intensity = computed(() =>
    Math.min(1, current.value / Math.max(VIEWER_INTENSITY_MIN_DENOMINATOR, maxViewer.value))
  )

  watch(current, (now) => {
    if (now > maxViewer.value) maxViewer.value = now
    if (now > viewerSnapshot.value) onSurge()
  })

  let timer: ReturnType<typeof setInterval> | null = null
  onMounted(() => {
    timer = setInterval(() => {
      viewerSnapshot.value = current.value
    }, VIEWER_SNAPSHOT_INTERVAL_MS)
  })
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { maxViewer, viewerSnapshot, intensity }
}
