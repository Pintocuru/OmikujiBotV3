// src/console/control/Amidakuji/composables/useLadderView.ts
import { computed, ref } from 'vue'

export function useLadderView() {
  const zoom = ref(1.0)
  const panX = ref(0)
  const panY = ref(0)
  const isPanning = ref(false)
  const dragStart = ref({ x: 0, y: 0 })

  const zoomIn = () => {
    zoom.value = Math.min(3.0, +(zoom.value + 0.2).toFixed(2))
  }

  const zoomOut = () => {
    zoom.value = Math.max(0.4, +(zoom.value - 0.2).toFixed(2))
  }

  const resetView = () => {
    zoom.value = 1.0
    panX.value = 0
    panY.value = 0
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }

  const startDrag = (clientX: number, clientY: number) => {
    isPanning.value = true
    dragStart.value = { x: clientX - panX.value, y: clientY - panY.value }
  }

  const onDrag = (clientX: number, clientY: number) => {
    if (!isPanning.value) return
    panX.value = clientX - dragStart.value.x
    panY.value = clientY - dragStart.value.y
  }

  const endDrag = () => {
    isPanning.value = false
  }

  /**
   * 特定の座標 (x, y) が中央に来るようにスクロール/パンを調整する (アニメーション追従用)
   */
  const focusPoint = (x: number, y: number, viewWidth: number, viewHeight: number) => {
    // 拡大率を考慮して中央に合わせる
    panX.value = viewWidth / 2 - x * zoom.value
    panY.value = viewHeight / 2 - y * zoom.value
  }

  const transformStyle = computed(() => ({
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
    transformOrigin: '0 0',
  }))

  return {
    zoom,
    panX,
    panY,
    isPanning,
    zoomIn,
    zoomOut,
    resetView,
    handleWheel,
    startDrag,
    onDrag,
    endDrag,
    focusPoint,
    transformStyle,
  }
}
