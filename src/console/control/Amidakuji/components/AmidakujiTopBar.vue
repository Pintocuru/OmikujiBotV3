<!-- src/console/control/Amidakuji/components/AmidakujiTopBar.vue -->
<template>
  <header class="flex h-12 shrink-0 items-center justify-between border-b border-base-300 bg-base-200 px-4 select-none">
    <div class="flex items-center gap-3">
      <span class="font-bold text-base tracking-wide flex items-center gap-2">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
        あみだくじ
      </span>
      <div class="badge badge-neutral text-xs gap-1">
        参加者: <span class="font-mono font-bold">{{ playerCount }}</span>人
      </div>
      <div class="badge text-xs" :class="phaseBadgeClass">
        {{ phaseLabel }}
      </div>
    </div>

    <div class="flex items-center gap-2">
      <!-- ズーム操作 -->
      <div class="join">
        <button type="button" class="btn btn-xs join-item" title="縮小" @click="emit('zoom-out')">－</button>
        <button type="button" class="btn btn-xs join-item font-mono" title="全体に戻す" @click="emit('zoom-reset')">
          {{ Math.round(zoom * 100) }}%
        </button>
        <button type="button" class="btn btn-xs join-item" title="拡大" @click="emit('zoom-in')">＋</button>
      </div>

      <!-- 設定パネルの折りたたみトグル (OBS配信用の配慮) -->
      <button v-if="phase === 'setup'" type="button" class="btn btn-xs btn-outline" @click="emit('toggle-setup')">
        {{ showSetup ? '設定を隠す' : '設定を表示' }}
      </button>

      <!-- 一人ずつモードでの「次の人」ボタン -->
      <button
        v-if="phase === 'revealing' && revealMode === 'individual'"
        type="button"
        class="btn btn-xs btn-primary font-bold"
        @click="emit('next-player')"
      >
        次の人へ
      </button>

      <!-- リセット / もう一度 -->
      <button v-if="phase !== 'setup'" type="button" class="btn btn-xs btn-warning font-bold" @click="emit('reset')">
        もう一度
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { AmidakujiPhase } from '../composables/useAmidakuji'

  const props = defineProps<{
    phase: AmidakujiPhase
    playerCount: number
    zoom: number
    showSetup: boolean
    revealMode: 'simultaneous' | 'individual'
  }>()

  const emit = defineEmits<{
    (e: 'zoom-in'): void
    (e: 'zoom-out'): void
    (e: 'zoom-reset'): void
    (e: 'toggle-setup'): void
    (e: 'next-player'): void
    (e: 'reset'): void
  }>()

  const phaseLabel = computed(() => {
    switch (props.phase) {
      case 'setup':
        return '準備中'
      case 'revealing':
        return '発表中'
      case 'completed':
        return '完了'
    }
  })

  const phaseBadgeClass = computed(() => {
    switch (props.phase) {
      case 'setup':
        return 'badge-info'
      case 'revealing':
        return 'badge-warning animate-pulse'
      case 'completed':
        return 'badge-success'
    }
  })
</script>
