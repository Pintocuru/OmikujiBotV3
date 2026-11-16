<!-- src/ui/SnipeTimer/components/standard/SimpleWhite.vue -->
<template>
  <div class="font-mono w-80 rounded-xl shadow-xl p-4" :style="{ background: color.background, color: color.text }">
    <!-- ヘッダー -->
    <div class="flex justify-center mt-4" :style="{ color: color.accent }">
      <h1 class="uppercase tracking-wider text-xl font-bold">Countdown</h1>
    </div>

    <!-- カウントダウン表示 -->
    <div class="px-4 py-2">
      <div class="rounded-xl p-4 mb-2 relative overflow-hidden" :style="{ background: panelBackground }">
        <!-- パルス(カウント中のみ) -->
        <div v-if="running" class="absolute inset-0 animate-pulse" :style="{ background: pulseBackground }"></div>

        <!-- 数字(オドメーター) -->
        <div class="flex justify-center z-10 relative">
          <div
            v-for="(digit, index) in digits"
            :key="index"
            class="w-12 h-16 mx-1 rounded-lg overflow-hidden relative shadow-inner border"
            :style="{ background: color.background, borderColor: edgeColor }"
          >
            <div
              class="absolute top-0 left-0 w-full transition-all duration-300 ease-in-out"
              :style="{ transform: `translateY(-${digit * 10}%)` }"
            >
              <span
                v-for="n in 10"
                :key="n"
                class="flex items-center justify-center h-16 text-3xl font-bold w-full"
                :style="{ color: color.accent }"
              >
                {{ n - 1 }}
              </span>
            </div>

            <!-- 上下のグラデーション -->
            <div
              class="absolute inset-x-0 top-0 h-4 z-20"
              :style="{ background: `linear-gradient(to bottom, ${color.background}, transparent)` }"
            ></div>
            <div
              class="absolute inset-x-0 bottom-0 h-4 z-20"
              :style="{ background: `linear-gradient(to top, ${color.background}, transparent)` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 目標時刻 -->
      <div class="text-center font-semibold" :style="{ color: color.accent }">
        <span class="uppercase tracking-wide" :class="{ 'animate-pulse': running }">Next {{ state.displayTime }}</span>
      </div>

      <!-- ステータス -->
      <div class="flex justify-center gap-3 mt-2 mb-1">
        <div
          v-for="n in 3"
          :key="n"
          class="w-3 h-3 rounded-full"
          :class="{ 'animate-pulse': running }"
          :style="{ background: running ? color.accent : edgeColor, opacity: running ? 1 - (n - 1) * 0.25 : 1 }"
        ></div>
      </div>
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
  const panelBackground = computed(() => `color-mix(in srgb, ${props.color.text} 6%, ${props.color.background})`)
  const pulseBackground = computed(() => `color-mix(in srgb, ${props.color.accent} 12%, transparent)`)
  const edgeColor = computed(() => `color-mix(in srgb, ${props.color.text} 18%, transparent)`)
</script>
