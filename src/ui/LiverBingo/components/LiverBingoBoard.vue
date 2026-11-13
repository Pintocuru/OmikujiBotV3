<!-- src/ui/LiverBingo/components/LiverBingoBoard.vue -->
<template>
  <div class="lb-root" :style="rootStyle">
    <LiverBingoTitle
      :title="settings.title"
      :lineCount="lineCount"
      :showEffect="showBingoEffect"
      @random-select="randomSelect"
      @generate="generate"
    />
    <LiverBingoGrid
      :cardSize="cardSize"
      :items="items"
      :progress="progress"
      :completedCells="completedCells"
      :highlightedCells="highlightedCells"
      :randomCell="randomCell"
      :animating="animating"
      @cell-click="increment"
      @cell-right-click="decrement"
      @cell-hover="playHover"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import type { LiverBingoType } from '@/types/ui'
  import { useLiverBingo } from '../composables/useLiverBingo'
  import LiverBingoTitle from './LiverBingoTitle.vue'
  import LiverBingoGrid from './LiverBingoGrid.vue'

  const props = defineProps<{
    settings: LiverBingoType
    fontFamily?: string
  }>()

  const {
    cardSize,
    items,
    progress,
    animating,
    randomCell,
    showBingoEffect,
    completedCells,
    lineCount,
    highlightedCells,
    increment,
    decrement,
    generate,
    randomSelect,
    playHover,
  } = useLiverBingo(toRef(props, 'settings'))

  // 配色(name: タイトル・強調部分の文字 / text: マスの文字 / background: マスの地 / accent: タイトルバー・達成)
  const rootStyle = computed(() => ({
    '--lb-name': props.settings.color.name,
    '--lb-text': props.settings.color.text,
    '--lb-bg': props.settings.color.background,
    '--lb-accent': props.settings.color.accent,
    fontFamily: props.fontFamily || undefined,
  }))
</script>

<style scoped>
  .lb-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: var(--lb-text);
  }
</style>
