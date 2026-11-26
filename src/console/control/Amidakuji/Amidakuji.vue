<!-- src/console/control/Amidakuji/Amidakuji.vue -->
<template>
  <div class="flex h-screen w-screen flex-col overflow-hidden bg-base-100 font-sans text-base-content select-none">
    <AmidakujiTopBar />

    <!-- メイン領域 (左: 設定パネル / 右: 盤面) -->
    <div class="relative flex flex-1 overflow-hidden">
      <SetupPanel v-if="phase === 'setup' && showSetup" />
      <LadderBoard />
      <!-- 完了後、「結果を見る」を押したときだけ、結果を重ねて出す -->
      <ResultList v-if="phase === 'completed' && showResult" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AmidakujiTopBar from './components/AmidakujiTopBar.vue'
  import SetupPanel from './components/SetupPanel.vue'
  import LadderBoard from './components/LadderBoard.vue'
  import ResultList from './components/ResultList.vue'
  import { createAmidakujiContext, provideAmidakuji } from './composables/useAmidakujiContext'

  // 状態は composable に集め、子コンポーネントは inject で受け取る
  const ctx = createAmidakujiContext()
  provideAmidakuji(ctx)

  const { phase, showSetup, showResult } = ctx
</script>
