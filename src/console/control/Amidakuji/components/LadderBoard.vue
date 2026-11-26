<!-- src/console/control/Amidakuji/components/LadderBoard.vue -->
<template>
  <div
    ref="containerRef"
    class="relative flex-1 h-full w-full overflow-hidden bg-base-300 cursor-grab select-none"
    :class="isPanning ? 'cursor-grabbing' : ''"
    @wheel="handleWheel"
    @mousedown="onMouseDown"
  >
    <!-- メインSVGグラフィック -->
    <div :style="transformStyle" class="origin-top-left transition-transform duration-75">
      <svg :width="svgWidth" :height="svgHeight" class="overflow-visible">
        <!-- 縦線描画 -->
        <g class="vertical-lines">
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

        <!-- 横線描画 (手動/自動) -->
        <g class="rungs">
          <g
            v-for="rung in allRungs"
            :key="`rung-${rung.col}-${rung.row}`"
            class="cursor-pointer group"
            @click.stop="emit('toggle-rung', rung.col, rung.row)"
          >
            <!-- クリックしやすい透明なヒットエリア -->
            <line
              :x1="colToX(rung.col)"
              :y1="rowToY(rung.row)"
              :x2="colToX(rung.col + 1)"
              :y2="rowToY(rung.row)"
              stroke="transparent"
              stroke-width="16"
            />
            <!-- 実際の線 -->
            <line
              :x1="colToX(rung.col)"
              :y1="rowToY(rung.row)"
              :x2="colToX(rung.col + 1)"
              :y2="rowToY(rung.row)"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              class="text-primary transition-all group-hover:stroke-error"
            />
          </g>
        </g>

        <!-- 準備中にクリックで横線を追加できるガイド線/スロット -->
        <g v-if="phase === 'setup'" class="guide-slots opacity-0 hover:opacity-100 transition-opacity">
          <template v-for="r in rowCount" :key="`row-slot-${r - 1}`">
            <template v-for="c in colCount - 1" :key="`slot-${c - 1}-${r - 1}`">
              <line
                :x1="colToX(c - 1)"
                :y1="rowToY(r - 1)"
                :x2="colToX(c)"
                :y2="rowToY(r - 1)"
                stroke="currentColor"
                stroke-width="2"
                stroke-dasharray="4 4"
                class="text-base-content/10 hover:text-primary cursor-pointer hover:stroke-4"
                @click.stop="emit('toggle-rung', c - 1, r - 1)"
              />
            </template>
          </template>
        </g>

        <!-- 発表中のアニメーショントレース線 & マーカー -->
        <g v-if="phase !== 'setup'" class="trace-paths">
          <!-- 参加者ごとの辿った軌跡 -->
          <template v-for="(path, pIdx) in activePaths" :key="`trace-${pIdx}`">
            <!-- 個別モードかつ未選択の人は薄く -->
            <path
              v-if="playerProgress[pIdx]"
              :d="buildSubPathD(path, playerProgress[pIdx])"
              fill="none"
              :stroke="getPlayerColor(pIdx)"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
              :opacity="isHighlighted(pIdx) ? 1 : 0.3"
            />
            <!-- 先端を動くマーカー (アバターまたは円) -->
            <circle
              v-if="playerProgress[pIdx] && !playerProgress[pIdx].finished"
              :cx="colToX(playerProgress[pIdx].col)"
              :cy="rowProgressToY(playerProgress[pIdx].row)"
              r="7"
              :fill="getPlayerColor(pIdx)"
              class="animate-pulse"
            />
          </template>
        </g>

        <!-- 上端: 参加者の名前とアバター -->
        <g class="player-headers">
          <g
            v-for="(player, idx) in players"
            :key="player.id"
            :transform="`translate(${colToX(idx)}, ${TOP_MARGIN - 20})`"
            class="cursor-pointer"
            @click="emit('select-player', idx)"
          >
            <!-- クリック可能エリア -->
            <rect x="-35" y="-40" width="70" height="55" fill="transparent" />
            <!-- インデックス・マーク -->
            <circle cx="0" cy="-25" r="12" :fill="getPlayerColor(idx)" class="transition-transform hover:scale-110" />
            <text x="0" y="-21" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">
              {{ idx + 1 }}
            </text>
            <!-- 名前 (縦書きまたは回転で重なり防止) -->
            <text
              x="0"
              y="-3"
              text-anchor="middle"
              font-size="12"
              font-weight="bold"
              fill="currentColor"
              class="text-base-content"
            >
              {{ formatPlayerName(player.name) }}
            </text>
          </g>
        </g>

        <!-- 下端: ゴール枠 -->
        <g class="goal-footers">
          <g
            v-for="c in colCount"
            :key="`goal-${c - 1}`"
            :transform="`translate(${colToX(c - 1)}, ${TOP_MARGIN + LADDER_HEIGHT + 20})`"
          >
            <!-- 背景枠 -->
            <rect x="-40" y="0" width="80" height="40" rx="6" :class="getGoalBoxClass(c - 1)" stroke-width="2" />
            <!-- テキスト (隠すモードのときは？) -->
            <text x="0" y="24" text-anchor="middle" font-size="12" font-weight="bold" :class="getGoalTextClass(c - 1)">
              {{ getGoalDisplayLabel(c - 1) }}
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
  import { computed, ref, watch } from 'vue'
  import type { AmidakujiPlayer } from '../composables/useJoinComments'
  import type { Rung, TracePath } from '../scripts/ladder'
  import type { GoalItem } from '../scripts/goals'
  import type { AmidakujiPhase } from '../composables/useAmidakuji'

  const props = defineProps<{
    phase: AmidakujiPhase
    players: AmidakujiPlayer[]
    allRungs: Rung[]
    rowCount: number
    activePaths: TracePath[]
    shuffledGoals: GoalItem[]
    playerProgress: Record<number, { col: number; row: number; finished: boolean }>
    currentRevealingIndex: number | null
    hideGoals: boolean
    zoom: number
    panX: number
    panY: number
    isPanning: boolean
    transformStyle: Record<string, string>
  }>()

  const emit = defineEmits<{
    (e: 'toggle-rung', col: number, row: number): void
    (e: 'select-player', idx: number): void
    (e: 'wheel', evt: WheelEvent): void
    (e: 'start-drag', clientX: number, clientY: number): void
    (e: 'drag', clientX: number, clientY: number): void
    (e: 'end-drag'): void
    (e: 'focus-point', x: number, y: number, w: number, h: number): void
  }>()

  const containerRef = ref<HTMLElement | null>(null)

  // 盤面ジオメトリ定義
  const TOP_MARGIN = 90
  const BOTTOM_MARGIN = 80
  const SIDE_MARGIN = 80
  const COL_WIDTH = 70
  const LADDER_HEIGHT = 380

  const colCount = computed(() => props.players.length)

  const svgWidth = computed(() => {
    return Math.max(800, colCount.value * COL_WIDTH + SIDE_MARGIN * 2)
  })

  const svgHeight = computed(() => {
    return TOP_MARGIN + LADDER_HEIGHT + BOTTOM_MARGIN
  })

  const colToX = (c: number): number => {
    return SIDE_MARGIN + c * COL_WIDTH
  }

  const rowToY = (r: number): number => {
    if (props.rowCount <= 0) return TOP_MARGIN
    const step = LADDER_HEIGHT / props.rowCount
    return TOP_MARGIN + (r + 0.5) * step
  }

  const rowProgressToY = (r: number): number => {
    if (props.rowCount <= 0) return TOP_MARGIN
    const step = LADDER_HEIGHT / props.rowCount
    return TOP_MARGIN + r * step
  }

  // 参加者カラーパレット
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
  const getPlayerColor = (idx: number): string => {
    return PALETTE[idx % PALETTE.length]
  }

  const formatPlayerName = (name: string): string => {
    if (name.length > 7) {
      return name.slice(0, 6) + '…'
    }
    return name
  }

  // マウスドラッグ操作
  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return
    emit('start-drag', e.clientX, e.clientY)

    const onMouseMove = (ev: MouseEvent) => {
      emit('drag', ev.clientX, ev.clientY)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      emit('end-drag')
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleWheel = (e: WheelEvent) => {
    emit('wheel', e)
  }

  // 部分的な経路の SVG Path 文字列を構築
  const buildSubPathD = (path: TracePath, progress: { col: number; row: number; finished: boolean }): string => {
    let d = `M ${colToX(path.startCol)} ${TOP_MARGIN}`
    for (const st of path.steps) {
      if (st.row > progress.row) {
        break
      }
      d += ` L ${colToX(st.col)} ${rowProgressToY(st.row)}`
    }
    // 現在の進行先端
    d += ` L ${colToX(progress.col)} ${rowProgressToY(progress.row)}`
    return d
  }

  const isHighlighted = (pIdx: number): boolean => {
    if (props.currentRevealingIndex === null) return true
    return props.currentRevealingIndex === pIdx
  }

  // 1人ずつモード時に先端を追従
  watch(
    () => props.currentRevealingIndex,
    (newIdx) => {
      if (newIdx !== null && props.playerProgress[newIdx] && containerRef.value) {
        const prog = props.playerProgress[newIdx]
        const targetX = colToX(prog.col)
        const targetY = rowProgressToY(prog.row)
        const rect = containerRef.value.getBoundingClientRect()
        emit('focus-point', targetX, targetY, rect.width, rect.height)
      }
    }
  )

  // ゴール表示
  const getGoalDisplayLabel = (c: number): string => {
    if (props.phase === 'setup') {
      return props.hideGoals ? '？' : 'ゴール'
    }
    const goal = props.shuffledGoals[c]
    if (!goal) return '？'

    if (props.hideGoals && props.phase === 'revealing') {
      // 誰かが到着しているゴールだけ明かす
      const arrived = Object.values(props.playerProgress).some((p) => p.finished && Math.round(p.col) === c)
      if (!arrived) return '？'
    }

    return goal.name
  }

  const getGoalBoxClass = (c: number): string => {
    if (props.phase === 'setup') {
      return 'fill-base-200 stroke-base-content/20'
    }
    const goal = props.shuffledGoals[c]
    if (!goal) return 'fill-base-200 stroke-base-content/20'

    if (props.hideGoals && props.phase === 'revealing') {
      const arrived = Object.values(props.playerProgress).some((p) => p.finished && Math.round(p.col) === c)
      if (!arrived) return 'fill-base-200 stroke-base-content/20'
    }

    return goal.isHit ? 'fill-primary/20 stroke-primary' : 'fill-base-200 stroke-base-content/30'
  }

  const getGoalTextClass = (c: number): string => {
    if (props.phase === 'setup') return 'fill-base-content/70'
    const goal = props.shuffledGoals[c]
    if (!goal) return 'fill-base-content/70'

    if (props.hideGoals && props.phase === 'revealing') {
      const arrived = Object.values(props.playerProgress).some((p) => p.finished && Math.round(p.col) === c)
      if (!arrived) return 'fill-base-content/70'
    }

    return goal.isHit ? 'fill-primary font-black' : 'fill-base-content/80'
  }
</script>
