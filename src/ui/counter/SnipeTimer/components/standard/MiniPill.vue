<!-- src/ui/SnipeTimer/components/standard/MiniPill.vue -->
<template>
  <div
    class="inline-flex items-center gap-2 rounded-full border px-3 py-1 shadow-md"
    :style="{ background: color.background, color: color.text, borderColor: edgeColor }"
  >
    <!-- 状態ドット -->
    <span
      class="mini-dot h-2 w-2 rounded-full"
      :class="{ 'mini-blink': running }"
      :style="{ background: active ? color.accent : edgeColor }"
    ></span>

    <!-- 残り秒数 -->
    <span class="text-xl font-bold leading-none tabular-nums" :style="{ color: color.accent }">{{ text }}</span>

    <!-- 目標時刻 -->
    <span class="text-xs tabular-nums opacity-70">{{ state.displayTime }}</span>
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
  const active = computed(() => props.state.status === 'running' || props.state.status === 'finished')
  const text = computed(() => props.digits.join(''))
  const edgeColor = computed(() => `color-mix(in srgb, ${props.color.text} 25%, transparent)`)
</script>

<style scoped>
  .mini-blink {
    animation: mini-blink 1s ease-in-out infinite;
  }
  @keyframes mini-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
</style>
