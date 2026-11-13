<!-- src/ui/LiverBingo/components/LiverBingoBoard.vue -->
<template>
  <div class="lb-root" :style="rootStyle">
    <LiverBingoGrid
      :cardSize="board.cardSize.value"
      :items="board.items.value"
      :progress="board.progress.value"
      :completedCells="board.completedCells.value"
      :highlightedCells="board.highlightedCells.value"
      :focusCell="board.focusCell.value"
      :animating="board.animating.value"
      @cell-click="board.increment"
      @cell-right-click="board.decrement"
      @cell-hover="board.playHover"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import type { LiverBingoType } from '@/types/ui'
  import { useLiverBingo } from '../composables/useLiverBingo'
  import { useLiverBingoSync } from '../composables/useLiverBingoSync'
  import LiverBingoGrid from './LiverBingoGrid.vue'

  const props = defineProps<{
    settings: LiverBingoType
    fontFamily?: string
    /** LiveConsole と同期するか(OBS のブラウザソースだけ true。エディターのプレビューでは false) */
    sync?: boolean
  }>()

  const board = useLiverBingo(toRef(props, 'settings'))
  if (props.sync) useLiverBingoSync(board)

  // 配色(name: ラインが成立したマスの文字 / text: マスの文字 / background: マスの地 / accent: 達成・進捗)
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
    color: var(--lb-text);
  }
</style>
