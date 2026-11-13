<!-- src/ui/SnipeTimer/components/standard/SimplePink.vue -->
<template>
  <div
    class="rounded-2xl px-2 py-4 border-4 shadow-lg text-center"
    :style="{ background: color.accent, borderColor: color.background }"
  >
    <!-- カウントダウン -->
    <div class="flex justify-center items-center text-4xl font-bold space-x-2 mb-4" :style="{ color: color.accent }">
      <span
        v-for="(digit, index) in digits"
        :key="index"
        class="rounded-lg px-3 py-2"
        :style="{ background: color.background }"
      >
        {{ digit }}
      </span>
    </div>

    <!-- 目標時刻 -->
    <div
      class="snipe-pill flex items-center justify-center px-4 py-1 rounded-xl text-lg"
      :class="{ 'snipe-float': running }"
      :style="{ background: color.background, color: color.text }"
    >
      Next
      <span class="snipe-heart mx-2" :style="{ color: color.accent }">♥</span>
      {{ state.displayTime }}
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
</script>

<style scoped>
  .snipe-pill {
    transition: transform 0.3s ease-in-out;
  }
  .snipe-float {
    animation: snipe-float 3s ease-in-out infinite;
  }
  .snipe-heart {
    animation: snipe-heartbeat 3s ease-in-out infinite;
  }
  @keyframes snipe-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
  }
  @keyframes snipe-heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
</style>
