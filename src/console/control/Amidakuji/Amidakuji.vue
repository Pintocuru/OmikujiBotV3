<!-- src/console/control/Amidakuji/Amidakuji.vue -->
<template>
  <div class="flex h-screen w-screen flex-col overflow-hidden bg-base-100 font-sans text-base-content select-none">
    <!-- 上部バー -->
    <AmidakujiTopBar
      :phase="phase"
      :player-count="players.length"
      :zoom="zoom"
      :show-setup="showSetup"
      :reveal-mode="revealMode"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @zoom-reset="resetView"
      @toggle-setup="showSetup = !showSetup"
      @next-player="nextPlayerReveal"
      @reset="resetToSetup"
    />

    <!-- メイン領域 (左: 設定パネル / 右: 盤面) -->
    <div class="flex flex-1 overflow-hidden relative">
      <SetupPanel
        v-if="phase === 'setup' && showSetup"
        :players="players"
        :prizes="prizes"
        :lose-label="loseLabel"
        :hide-goals="hideGoalsBeforeReveal"
        :rung-density="rungDensity"
        :follow-speed="followSpeed"
        :reveal-mode="revealMode"
        :total-prizes="totalPrizes"
        :can-start-reveal="canStartReveal"
        :comment-join="commentJoin"
        @update:lose-label="loseLabel = $event"
        @update:hide-goals="hideGoalsBeforeReveal = $event"
        @update:rung-density="rungDensity = $event"
        @update:follow-speed="followSpeed = $event"
        @update:reveal-mode="revealMode = $event"
        @add-manual-players="addManualPlayers"
        @remove-player="removePlayer"
        @add-prize="addPrize"
        @remove-prize="removePrize"
        @generate-auto="generateAuto"
        @reset-auto="resetAutoRungs"
        @reset-all-rungs="resetAllRungs"
        @start-reveal="startReveal"
      />

      <LadderBoard
        :phase="phase"
        :players="players"
        :all-rungs="allRungs"
        :row-count="rowCount"
        :active-paths="activePaths"
        :shuffled-goals="shuffledGoals"
        :player-progress="playerProgress"
        :current-revealing-index="currentRevealingPlayerIndex"
        :hide-goals="hideGoalsBeforeReveal"
        :zoom="zoom"
        :pan-x="panX"
        :pan-y="panY"
        :is-panning="isPanning"
        :transform-style="transformStyle"
        @toggle-rung="onToggleRung"
        @select-player="selectPlayerReveal"
        @wheel="handleWheel"
        @start-drag="startDrag"
        @drag="onDrag"
        @end-drag="endDrag"
        @focus-point="focusPoint"
      />

      <!-- 完了時の結果オーバーレイ表示 -->
      <ResultList
        v-if="phase === 'completed'"
        :results="results"
        @reset="resetToSetup"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AmidakujiTopBar from './components/AmidakujiTopBar.vue'
import SetupPanel from './components/SetupPanel.vue'
import LadderBoard from './components/LadderBoard.vue'
import ResultList from './components/ResultList.vue'
import { useAmidakuji } from './composables/useAmidakuji'
import { useLadderView } from './composables/useLadderView'

const {
  phase,
  players,
  prizes,
  loseLabel,
  hideGoalsBeforeReveal,
  allRungs,
  rungDensity,
  followSpeed,
  revealMode,
  activePaths,
  shuffledGoals,
  currentRevealingPlayerIndex,
  playerProgress,
  results,
  totalPrizes,
  rowCount,
  canStartReveal,
  commentJoin,
  addManualPlayers,
  removePlayer,
  addPrize,
  removePrize,
  onToggleRung,
  generateAuto,
  resetAutoRungs,
  resetAllRungs,
  startReveal,
  nextPlayerReveal,
  selectPlayerReveal,
  resetToSetup,
} = useAmidakuji()

const {
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
} = useLadderView()

const showSetup = ref(true)
</script>
