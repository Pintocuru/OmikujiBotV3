<!-- src/ui/LiverBingo/components/LiverBingoGrid.vue -->
<template>
  <div class="lb-grid" :style="gridStyle">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="lb-cell"
      :class="{
        'lb-cell--done': completedCells[index],
        'lb-cell--line': highlightedCells.includes(index),
        'lb-cell--focus': focusCell === index,
      }"
      @click="emit('cell-click', index)"
      @contextmenu.prevent="emit('cell-right-click', index)"
      @mouseenter="emit('cell-hover')"
    >
      <div class="lb-cell__title">{{ formatTitle(item.title) }}</div>

      <!-- 数値(クリック時に拡大) -->
      <div class="lb-cell__count">
        <span class="lb-cell__value" :class="{ 'lb-cell__value--pop': animating[index] }">
          {{ (progress[index] ?? 0) * item.unit }}
        </span>
        / {{ item.target * item.unit }}
      </div>

      <!-- 進捗バー -->
      <div class="lb-cell__bar" aria-hidden="true">
        <div class="lb-cell__bar-fill" :style="{ width: `${percent(progress[index] ?? 0, item.target)}%` }"></div>
      </div>

      <!-- クリック時・ランダム選択時のアニメーション -->
      <div v-if="animating[index]" class="lb-cell__ring" aria-hidden="true"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { LiverBingoItemType } from '@/types/ui'

  const props = defineProps<{
    cardSize: number
    items: LiverBingoItemType[]
    progress: number[]
    completedCells: boolean[]
    highlightedCells: number[]
    focusCell: number | null
    animating: boolean[]
  }>()

  const emit = defineEmits<{
    'cell-click': [index: number]
    'cell-right-click': [index: number]
    'cell-hover': []
  }>()

  /** マスの一辺(カードが大きいほど小さくする) */
  const CELL_SIZE_REM: Record<number, number> = { 3: 8, 4: 7.5, 5: 7 }
  const cellSize = computed(() => CELL_SIZE_REM[props.cardSize] ?? 6)

  const gridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${props.cardSize}, ${cellSize.value}rem)`,
    gridAutoRows: `${cellSize.value}rem`,
  }))

  const MAX_TITLE_LENGTH = 24
  const formatTitle = (text: string) =>
    text.length > MAX_TITLE_LENGTH ? `${text.slice(0, MAX_TITLE_LENGTH - 3)}...` : text

  // target が 0 のときは達成済みとして 100%
  const percent = (value: number, target: number) =>
    target <= 0 ? 100 : Math.min(100, Math.max(0, (value / target) * 100))
</script>

<style scoped>
  .lb-grid {
    display: grid;
    gap: 0.25rem;
  }
  .lb-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: 1px solid color-mix(in srgb, var(--lb-text) 30%, transparent);
    border-radius: 0.5rem;
    background: var(--lb-bg);
    color: var(--lb-text);
    text-align: center;
    cursor: pointer;
    user-select: none;
    transition:
      transform 0.15s,
      background-color 0.3s;
  }
  .lb-cell:hover {
    z-index: 999;
    transform: scale(1.5);
  }
  /* 達成したマス */
  .lb-cell--done {
    border: 2px solid var(--lb-accent);
    background: color-mix(in srgb, var(--lb-accent) 35%, var(--lb-bg));
  }
  /* ビンゴが成立したラインのマス */
  .lb-cell--line {
    background: var(--lb-accent);
    color: var(--lb-name);
    box-shadow: 0 0 0 2px var(--lb-text);
  }
  /* LiveConsole で注目されたマス */
  .lb-cell--focus {
    outline: 4px solid var(--lb-accent);
    animation: lb-pulse 1s ease-in-out infinite;
  }

  .lb-cell__title {
    font-size: 1rem;
    line-height: 1.25rem;
    word-break: break-all;
  }
  .lb-cell__count {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .lb-cell__value {
    display: inline-block;
    transition: transform 0.2s;
  }
  .lb-cell__value--pop {
    transform: scale(1.6);
    font-weight: 800;
  }

  .lb-cell__bar {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.375rem;
    overflow: hidden;
    border-radius: 0 0 0.5rem 0.5rem;
    background: color-mix(in srgb, var(--lb-text) 15%, transparent);
  }
  .lb-cell__bar-fill {
    height: 100%;
    background: var(--lb-accent);
    transition: width 0.3s;
  }

  .lb-cell__ring {
    position: absolute;
    inset: 0;
    border: 3px solid var(--lb-accent);
    border-radius: 0.5rem;
    pointer-events: none;
    animation: lb-ring 0.8s ease-out forwards;
  }

  @keyframes lb-ring {
    from {
      transform: scale(0.7);
      opacity: 1;
    }
    to {
      transform: scale(1.3);
      opacity: 0;
    }
  }
  @keyframes lb-pulse {
    50% {
      opacity: 0.6;
    }
  }
</style>
