<!-- src/ui/counter/SnipeTimer/components/standard/MiniFlip.vue -->
<template>
  <div
    class="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 shadow-md"
    :style="{ background: color.background, color: color.text }"
  >
    <!-- 数字タイル -->
    <div class="flex gap-1">
      <span
        v-for="(digit, index) in digits"
        :key="index"
        class="relative flex h-8 w-6 items-center justify-center overflow-hidden rounded text-xl font-bold tabular-nums"
        :class="{ 'mini-flip-tick': running }"
        :style="{ background: tileBackground, color: color.accent }"
      >
        {{ digit }}
        <!-- 中央の分割線 -->
        <span class="absolute inset-x-0 top-1/2 h-px" :style="{ background: color.background }"></span>
      </span>
    </div>

    <!-- 目標時刻 -->
    <div class="flex flex-col leading-tight">
      <span class="text-[10px] font-bold uppercase tracking-wider" :style="{ color: color.accent }">Next</span>
      <span class="text-xs tabular-nums opacity-80">{{ state.displayTime }}</span>
    </div>
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

  const running = computed(() => props.state.status === 'running')
  const tileBackground = computed(() => `color-mix(in srgb, ${props.color.text} 12%, ${props.color.background})`)
</script>

<style scoped>
  /* 最後の桁だけ、秒が変わるたびに軽く弾む */
  .mini-flip-tick:last-child {
    animation: mini-flip-tick 1s ease-in-out infinite;
  }
  @keyframes mini-flip-tick {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }
</style>
