<!-- src/console/control/Amidakuji/components/LadderBoard.vue -->
<template>
  <div
    ref="containerRef"
    class="relative h-full w-full flex-1 overflow-hidden bg-base-300 select-none"
    :class="cursorClass"
    @wheel.prevent="onWheel"
    @mousedown="onMouseDown"
    @mousemove="onHover"
    @mouseleave="hoverSlot = null"
    @contextmenu.prevent
  >
    <div :style="transformStyle" class="origin-top-left">
      <svg ref="svgRef" :width="svgWidth" :height="svgHeight" class="overflow-visible">
        <!-- 縦線 -->
        <g>
          <line
            v-for="c in colCount"
            :key="`vline-${c - 1}`"
            :x1="colToX(c - 1)"
            :y1="TOP_MARGIN"
            :x2="colToX(c - 1)"
            :y2="TOP_MARGIN + LADDER_HEIGHT"
            stroke="currentColor"
            stroke-width="3"
            class="text-base-content/30"
          />
        </g>

        <!-- 横線 (引く・消すは、盤面の座標から計算する。線ごとのイベントは持たない) -->
        <g class="pointer-events-none">
          <line
            v-for="rung in allRungs"
            :key="`rung-${rung.col}-${rung.row}`"
            :x1="colToX(rung.col)"
            :y1="rowToY(rung.row)"
            :x2="colToX(rung.col + 1)"
            :y2="rowToY(rung.row)"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            class="text-primary"
          />
          <!-- 準備中: 今の位置に、引ける場所のガイドを出す -->
          <line
            v-if="phase === 'setup' && hoverSlot"
            :x1="colToX(hoverSlot.col)"
            :y1="rowToY(hoverSlot.row)"
            :x2="colToX(hoverSlot.col + 1)"
            :y2="rowToY(hoverSlot.row)"
            stroke="currentColor"
            stroke-width="4"
            stroke-dasharray="6 6"
            stroke-linecap="round"
            :class="hoverHasRung ? 'text-error/60' : 'text-primary/50'"
          />
        </g>

        <!-- 発表中の軌跡と先端 -->
        <g v-if="phase !== 'setup'" class="pointer-events-none">
          <template v-for="(path, i) in paths" :key="`trace-${i}`">
            <polyline
              :points="polylinePoints(i)"
              fill="none"
              :stroke="getPlayerColor(i)"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
              :opacity="isDimmed(i) ? 0.3 : 1"
            />
            <circle
              v-if="isMoving(i)"
              :cx="colToX(tip(i).col)"
              :cy="rowProgressToY(tip(i).row)"
              r="7"
              :fill="getPlayerColor(i)"
            />
          </template>
        </g>

        <!-- 上端: 参加者の番号と名前 (縦書き) -->
        <g>
          <g
            v-for="(player, idx) in players"
            :key="player.id"
            :transform="`translate(${colToX(idx)}, ${TOP_MARGIN})`"
            :class="canSelect ? 'cursor-pointer' : ''"
            @click.stop="onHeaderClick(idx)"
          >
            <title>{{ player.name }}</title>
            <rect x="-22" y="-145" width="44" height="140" fill="transparent" />
            <circle cx="0" cy="-130" r="12" :fill="getPlayerColor(idx)" />
            <text x="0" y="-126" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">
              {{ idx + 1 }}
            </text>
            <text
              x="0"
              y="-112"
              font-size="13"
              font-weight="bold"
              fill="currentColor"
              class="text-base-content"
              style="writing-mode: vertical-rl; text-orientation: upright"
            >
              {{ formatPlayerName(player.name) }}
            </text>
          </g>
        </g>

        <!-- 下端: ゴール -->
        <g>
          <g
            v-for="c in colCount"
            :key="`goal-${c - 1}`"
            :transform="`translate(${colToX(c - 1)}, ${TOP_MARGIN + LADDER_HEIGHT + 20})`"
          >
            <rect x="-32" y="0" width="64" height="40" rx="6" :class="goalBoxClass(c - 1)" stroke-width="2" />
            <text x="0" y="24" text-anchor="middle" font-size="11" font-weight="bold" :class="goalTextClass(c - 1)">
              {{ goalLabel(c - 1) }}
            </text>
          </g>
        </g>
      </svg>
    </div>

    <!-- 参加者不足時のプレースホルダー -->
    <div
      v-if="colCount < 2"
      class="absolute inset-0 flex items-center justify-center flex-col gap-2 text-base-content/50 pointer-events-none"
    >
      <div class="text-4xl">🎋</div>
      <div class="font-bold text-lg">参加者を2人以上集めると、あみだくじが描かれます</div>
      <div class="text-sm">左側のパネルからコメント募集または手動追加してください</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { rungKey } from '../scripts/ladder'
  import { pointAt, polylineUpTo } from '../scripts/trace'
  import { useAmidakujiContext } from '../composables/useAmidakujiContext'

  const ctx = useAmidakujiContext()
  const { phase, players, rowCount, hideGoalsBeforeReveal, setRung, selectPlayerReveal } = ctx
  const { allRungs } = ctx.rungs
  const { paths, goals, playerY, arrivedCols, followIndex, busy } = ctx.anim
  const { zoom, isPanning, transformStyle } = ctx.view

  const containerRef = ref<HTMLElement | null>(null)
  const svgRef = ref<SVGSVGElement | null>(null)

  // 盤面ジオメトリ
  const TOP_MARGIN = 160
  const BOTTOM_MARGIN = 80
  const SIDE_MARGIN = 80
  const COL_WIDTH = 70
  const LADDER_HEIGHT = 380

  const colCount = computed(() => players.value.length)
  const svgWidth = computed(() => Math.max(800, colCount.value * COL_WIDTH + SIDE_MARGIN * 2))
  const svgHeight = TOP_MARGIN + LADDER_HEIGHT + BOTTOM_MARGIN

  const colToX = (c: number): number => SIDE_MARGIN + c * COL_WIDTH
  const rowStep = computed(() => (rowCount.value > 0 ? LADDER_HEIGHT / rowCount.value : LADDER_HEIGHT))
  /** 横線の高さ (その行の中央) */
  const rowToY = (r: number): number => TOP_MARGIN + (r + 0.5) * rowStep.value
  /** 経路の高さ (0 = 上端, rowCount = 下端) */
  const rowProgressToY = (r: number): number => TOP_MARGIN + r * rowStep.value

  const PALETTE = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#d946ef',
    '#ec4899',
  ]
  const getPlayerColor = (idx: number): string => PALETTE[idx % PALETTE.length]

  const truncate = (text: string, max: number): string => (text.length > max ? text.slice(0, max - 1) + '…' : text)
  const formatPlayerName = (name: string): string => truncate(name, 7)
  const formatGoalName = (name: string): string => truncate(name, 5)

  // --- 軌跡 ---
  const polylinePoints = (i: number): string =>
    polylineUpTo(paths.value[i], playerY.value[i] ?? 0, rowCount.value)
      .map((p) => `${colToX(p.col)},${rowProgressToY(p.row)}`)
      .join(' ')

  const tip = (i: number) => pointAt(paths.value[i], playerY.value[i] ?? 0, rowCount.value)

  const isMoving = (i: number): boolean => {
    const y = playerY.value[i] ?? 0
    return y > 0 && y < rowCount.value
  }

  // 一人ずつ辿っているあいだ、ほかの人は薄くする
  const isDimmed = (i: number): boolean => followIndex.value !== null && followIndex.value !== i

  // --- ゴール ---
  const goalHidden = (c: number): boolean => {
    if (phase.value === 'setup') return true
    return hideGoalsBeforeReveal.value && phase.value === 'revealing' && !arrivedCols.value.has(c)
  }

  const goalLabel = (c: number): string => {
    if (phase.value === 'setup') return hideGoalsBeforeReveal.value ? '？' : 'ゴール'
    const goal = goals.value[c]
    if (!goal || goalHidden(c)) return '？'
    return formatGoalName(goal.name)
  }

  const goalBoxClass = (c: number): string => {
    const goal = goals.value[c]
    if (!goal || goalHidden(c)) return 'fill-base-200 stroke-base-content/20'
    return goal.isHit ? 'fill-primary/20 stroke-primary' : 'fill-base-200 stroke-base-content/30'
  }

  const goalTextClass = (c: number): string => {
    const goal = goals.value[c]
    if (!goal || goalHidden(c)) return 'fill-base-content/70'
    return goal.isHit ? 'fill-primary font-black' : 'fill-base-content/80'
  }

  // --- 横線を引く・消す (クリック / ドラッグ) ---
  type Slot = { col: number; row: number }
  const hoverSlot = ref<Slot | null>(null)
  const rungKeys = computed(() => new Set(allRungs.value.map((r) => rungKey(r.col, r.row))))
  const hoverHasRung = computed(() => !!hoverSlot.value && rungKeys.value.has(rungKey(hoverSlot.value.col, hoverSlot.value.row)))

  /** 画面の座標から、横線を引ける場所 (縦線の間 × 行) を求める */
  const slotAt = (clientX: number, clientY: number): Slot | null => {
    const rect = svgRef.value?.getBoundingClientRect()
    if (!rect) return null
    const x = (clientX - rect.left) / zoom.value
    const y = (clientY - rect.top) / zoom.value
    const col = Math.floor((x - SIDE_MARGIN) / COL_WIDTH)
    const row = Math.floor((y - TOP_MARGIN) / rowStep.value)
    if (col < 0 || col >= colCount.value - 1 || row < 0 || row >= rowCount.value) return null
    return { col, row }
  }

  const onHover = (e: MouseEvent) => {
    hoverSlot.value = phase.value === 'setup' ? slotAt(e.clientX, e.clientY) : null
  }

  // --- マウス操作 ---
  // 準備中: 左ドラッグで横線 / Shift・中・右ボタンのドラッグで移動。発表中: 左ドラッグで移動
  let dragMode: 'pan' | 'paint' | null = null
  let paintAdd = true
  let lastPaintKey = ''
  let dragOrigin = { x: 0, y: 0 }
  let dragMoved = 0

  const paintAt = (clientX: number, clientY: number) => {
    const slot = slotAt(clientX, clientY)
    if (!slot) return
    const key = rungKey(slot.col, slot.row)
    if (key === lastPaintKey) return
    lastPaintKey = key
    setRung(slot.col, slot.row, paintAdd)
  }

  const onMouseDown = (e: MouseEvent) => {
    const wantsPan = e.button !== 0 || e.shiftKey || phase.value !== 'setup'
    if (e.button === 1) e.preventDefault()
    dragOrigin = { x: e.clientX, y: e.clientY }
    dragMoved = 0

    if (wantsPan) {
      dragMode = 'pan'
      ctx.view.startDrag(e.clientX, e.clientY)
    } else {
      const slot = slotAt(e.clientX, e.clientY)
      if (!slot) return
      // 最初に押した場所に横線があれば「消す」ドラッグ、なければ「引く」ドラッグ
      paintAdd = !rungKeys.value.has(rungKey(slot.col, slot.row))
      lastPaintKey = ''
      dragMode = 'paint'
      paintAt(e.clientX, e.clientY)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMove = (e: MouseEvent) => {
    dragMoved = Math.max(dragMoved, Math.hypot(e.clientX - dragOrigin.x, e.clientY - dragOrigin.y))
    if (dragMode === 'pan') ctx.view.onDrag(e.clientX, e.clientY)
    else if (dragMode === 'paint') paintAt(e.clientX, e.clientY)
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    if (dragMode === 'pan') ctx.view.endDrag()
    dragMode = null
  }

  const onWheel = (e: WheelEvent) => {
    if (containerRef.value) ctx.view.handleWheel(e, containerRef.value.getBoundingClientRect())
  }

  const canSelect = computed(() => phase.value === 'revealing' && ctx.revealMode.value === 'individual' && !busy.value)

  // 移動のドラッグ後に、名前をクリックしたことにしない
  const onHeaderClick = (idx: number) => {
    if (dragMoved > 4) return
    selectPlayerReveal(idx)
  }

  const cursorClass = computed(() => {
    if (phase.value === 'setup') return 'cursor-crosshair'
    return isPanning.value ? 'cursor-grabbing' : 'cursor-grab'
  })

  // --- 表示サイズ・追従 ---
  let observer: ResizeObserver | null = null

  const syncSizes = () => {
    const el = containerRef.value
    if (!el) return
    ctx.view.setSizes(el.clientWidth, el.clientHeight, svgWidth.value, svgHeight)
  }

  onMounted(() => {
    syncSizes()
    if (containerRef.value) {
      observer = new ResizeObserver(syncSizes)
      observer.observe(containerRef.value)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  })

  watch(svgWidth, syncSizes)

  // 一人ずつ辿っているあいだ、先端を表示の中央に保つ
  watch([playerY, followIndex], () => {
    const i = followIndex.value
    if (i === null || !paths.value[i]) return
    const p = tip(i)
    ctx.view.focusPoint(colToX(p.col), rowProgressToY(p.row))
  })

</script>
