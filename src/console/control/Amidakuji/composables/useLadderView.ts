// src/console/control/Amidakuji/composables/useLadderView.ts
// 盤面の拡大・移動。全体が見える倍率 (fit) を下限にして、ウィンドウに合わせる
import { computed, ref } from 'vue'

const MAX_ZOOM = 3

export function useLadderView() {
  const zoom = ref(1)
  const panX = ref(0)
  const panY = ref(0)
  const isPanning = ref(false)
  const viewSize = ref({ w: 0, h: 0 })
  const contentSize = ref({ w: 0, h: 0 })
  /** true の間は、ウィンドウや人数が変わっても全体表示を保つ */
  const autoFit = ref(true)
  let dragStart = { x: 0, y: 0 }

  /** 全体が収まる倍率 (拡大はしない) */
  const fitZoom = computed(() => {
    const v = viewSize.value
    const c = contentSize.value
    if (!v.w || !v.h || !c.w || !c.h) return 1
    return Math.min(1, v.w / c.w, v.h / c.h)
  })

  const zoomPercent = computed(() => Math.round(zoom.value * 100))

  /** 全体表示に戻す (中央寄せ) */
  const resetView = () => {
    zoom.value = fitZoom.value
    panX.value = (viewSize.value.w - contentSize.value.w * zoom.value) / 2
    panY.value = (viewSize.value.h - contentSize.value.h * zoom.value) / 2
    autoFit.value = true
  }

  const setSizes = (viewW: number, viewH: number, contentW: number, contentH: number) => {
    viewSize.value = { w: viewW, h: viewH }
    contentSize.value = { w: contentW, h: contentH }
    if (autoFit.value) resetView()
  }

  /** (cx, cy) (盤面の表示領域内の座標) を動かさずに、倍率を factor 倍にする */
  const zoomAt = (factor: number, cx: number, cy: number) => {
    const next = Math.min(MAX_ZOOM, Math.max(fitZoom.value, zoom.value * factor))
    const k = next / zoom.value
    panX.value = cx - (cx - panX.value) * k
    panY.value = cy - (cy - panY.value) * k
    zoom.value = next
    autoFit.value = false
  }

  const zoomIn = () => zoomAt(1.2, viewSize.value.w / 2, viewSize.value.h / 2)
  const zoomOut = () => zoomAt(1 / 1.2, viewSize.value.w / 2, viewSize.value.h / 2)

  /** 表示の中心で、倍率を指定の値にする */
  const zoomTo = (target: number) => zoomAt(target / zoom.value, viewSize.value.w / 2, viewSize.value.h / 2)

  /** rect: 盤面の表示領域 (getBoundingClientRect) */
  const handleWheel = (e: WheelEvent, rect: DOMRect) => {
    zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - rect.left, e.clientY - rect.top)
  }

  const startDrag = (clientX: number, clientY: number) => {
    isPanning.value = true
    autoFit.value = false
    dragStart = { x: clientX - panX.value, y: clientY - panY.value }
  }

  const onDrag = (clientX: number, clientY: number) => {
    if (!isPanning.value) return
    panX.value = clientX - dragStart.x
    panY.value = clientY - dragStart.y
  }

  const endDrag = () => {
    isPanning.value = false
  }

  /** 盤面の座標 (x, y) が、表示の中央に来るようにする (辿る線への追従用) */
  const focusPoint = (x: number, y: number) => {
    panX.value = viewSize.value.w / 2 - x * zoom.value
    panY.value = viewSize.value.h / 2 - y * zoom.value
    autoFit.value = false
  }

  const transformStyle = computed(() => ({
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
    transformOrigin: '0 0',
  }))

  return {
    zoom,
    zoomPercent,
    isPanning,
    viewSize,
    transformStyle,
    setSizes,
    resetView,
    zoomIn,
    zoomOut,
    zoomTo,
    handleWheel,
    startDrag,
    onDrag,
    endDrag,
    focusPoint,
  }
}
