<!-- src/ui/counter/SnipeTimer/components/standard/MiniRing.vue -->
<template>
  <div
    class="inline-flex flex-col items-center gap-1 rounded-2xl px-2 py-2 shadow-md"
    :style="{ background: color.background, color: color.text }"
  >
    <!-- リング -->
    <div class="relative h-16 w-16">
      <svg class="absolute inset-0" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke-width="4" :stroke="edgeColor" />
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke-width="4"
          stroke-linecap="round"
          :stroke="color.accent"
          :stroke-dasharray="running ? '44 132' : '176 0'"
          :opacity="status === 'idle' || status === 'paused' ? 0.4 : 1"
          :class="{ 'mini-ring-spin': running }"
        />
      </svg>
      <!-- 残り秒数 -->
      <span
        class="absolute inset-0 flex items-center justify-center text-lg font-bold tabular-nums"
        :style="{ color: color.accent }"
      >
        {{ digits.join('') }}
      </span>
    </div>

    <!-- 目標時刻 -->
    <span class="text-[10px] tabular-nums opacity-70">{{ state.displayTime }}</span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CharacterColorType } from '@/types/OmikujiData'
  import type { SnipeTimerState } from '../../types'

  const props = defineProps<{
    state: SnipeTimerState
    digits: number[]
    color: CharacterColorType
  }>()

  const status = computed(() => props.state.status)
  const running = computed(() => props.state.status === 'running')
  const edgeColor = computed(() => `color-mix(in srgb, ${props.color.text} 18%, transparent)`)
</script>

<style scoped>
  .mini-ring-spin {
    transform-origin: 32px 32px;
    animation: mini-ring-spin 3s linear infinite;
  }
  @keyframes mini-ring-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
