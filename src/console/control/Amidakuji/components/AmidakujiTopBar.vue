<!-- src/console/control/Amidakuji/components/AmidakujiTopBar.vue -->
<template>
  <ToolTopBar title="あみだくじ">
    <div class="badge badge-neutral text-xs gap-1">
      参加者: <span class="font-mono font-bold">{{ players.length }}</span>人
    </div>
    <div class="badge text-xs" :class="phaseBadgeClass">
      {{ phaseLabel }}
    </div>

    <template #actions>
      <!-- ズーム操作 -->
      <div class="join">
        <button type="button" class="btn btn-xs join-item" title="縮小" @click="zoomOut">－</button>
        <button type="button" class="btn btn-xs join-item font-mono" title="全体に戻す" @click="resetView">
          {{ zoomPercent }}%
        </button>
        <button type="button" class="btn btn-xs join-item" title="拡大" @click="zoomIn">＋</button>
      </div>

      <!-- 設定パネルの折りたたみ (OBS でキャプチャするときに映さないため) -->
      <button v-if="phase === 'setup'" type="button" class="btn btn-xs btn-outline" @click="showSetup = !showSetup">
        {{ showSetup ? '設定を隠す' : '設定を表示' }}
      </button>

      <!-- 一人ずつ: 辿っている間は押せない -->
      <button
        v-if="phase === 'revealing' && revealMode === 'individual'"
        type="button"
        class="btn btn-xs btn-primary font-bold"
        :disabled="busy"
        @click="nextPlayerReveal"
      >
        次の人へ
      </button>

      <!-- 完了後: 結果は、ここで開くまで出さない (着地を配信に映すため) -->
      <button
        v-if="phase === 'completed' && !showResult"
        type="button"
        class="btn btn-xs btn-success font-bold"
        @click="showResult = true"
      >
        結果を見る
      </button>

      <button v-if="phase !== 'setup'" type="button" class="btn btn-xs btn-warning font-bold" @click="resetToSetup">
        もう一度
      </button>
    </template>
  </ToolTopBar>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import ToolTopBar from '@/console/parts/ToolTopBar.vue'
  import { useAmidakujiContext } from '../composables/useAmidakujiContext'

  const ctx = useAmidakujiContext()
  const { phase, players, revealMode, showSetup, showResult, nextPlayerReveal, resetToSetup } = ctx
  const { busy } = ctx.anim
  const { zoomPercent, zoomIn, zoomOut, resetView } = ctx.view

  const phaseLabel = computed(() => {
    switch (phase.value) {
      case 'setup':
        return '準備中'
      case 'revealing':
        return '発表中'
      case 'completed':
        return '完了'
    }
  })

  const phaseBadgeClass = computed(() => {
    switch (phase.value) {
      case 'setup':
        return 'badge-info'
      case 'revealing':
        return 'badge-warning animate-pulse'
      case 'completed':
        return 'badge-success'
    }
  })
</script>
