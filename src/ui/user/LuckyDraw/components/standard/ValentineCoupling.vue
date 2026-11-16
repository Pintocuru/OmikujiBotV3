<!-- src/ui/LuckyDraw/components/standard/ValentineCoupling.vue -->
<!-- 2 名をペアにして、ハートで結んで表示する(旧 WinnerGroup の valentineCoupling) -->
<template>
  <div
    class="relative rounded-2xl border-2 p-4"
    :style="{ borderColor: color.accent, background: color.background, color: color.text }"
  >
    <div class="relative z-10 space-y-3">
      <!-- 見出し -->
      <div v-if="label" class="space-y-1 text-center">
        <h2 class="text-2xl font-bold" :style="{ color: color.name }">{{ label }}</h2>
        <div class="flex items-center justify-center gap-2">
          <div class="h-px w-12" :style="{ background: `linear-gradient(to right, transparent, ${color.accent})` }" />
          <Heart class="h-4 w-4" :style="{ color: color.accent }" />
          <div class="h-px w-12" :style="{ background: `linear-gradient(to left, transparent, ${color.accent})` }" />
        </div>
      </div>

      <!-- 抽選前 -->
      <div v-if="waiting" class="flex min-h-[200px] items-center justify-center">
        <div class="text-center opacity-50">
          <Heart class="mx-auto mb-3 h-16 w-16 animate-pulse" :style="{ color: color.accent }" />
          <p class="text-sm">{{ $t('uiSettings.luckyDraw.waiting') }}</p>
        </div>
      </div>

      <!-- 2 名そろっているとき -->
      <div v-else-if="users.length >= 2" class="relative">
        <!-- 中央のハート -->
        <div
          :key="`heart-${drawKey}`"
          v-motion
          :initial="{ scale: 0, rotate: -180 }"
          :enter="{ scale: 1, rotate: 0, transition: { duration: 1000, delay: 800, type: 'spring', stiffness: 100 } }"
          class="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <Heart class="ld-heartbeat h-12 w-12" :style="{ color: color.accent, fill: color.accent }" />
        </div>

        <div class="grid grid-cols-2 items-center gap-8 sm:gap-12">
          <div :key="`left-${drawKey}`" v-motion :initial="cardInitial('left')" :enter="cardEnter" class="flex justify-end">
            <UserCard :user="users[0]" :color="color" :border="color.accent" />
          </div>
          <div :key="`right-${drawKey}`" v-motion :initial="cardInitial('right')" :enter="cardEnter" class="flex justify-start">
            <UserCard :user="users[1]" :color="color" :border="color.name" />
          </div>
        </div>
      </div>

      <!-- 人数が足りないとき -->
      <div v-else class="py-8 text-center opacity-60">
        <HeartCrack class="mx-auto mb-3 h-12 w-12" />
        <p class="text-base">{{ $t('uiSettings.luckyDraw.coupling.notEnough') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Heart, HeartCrack } from 'lucide-vue-next'
  import type { UserNameType } from '@/types/OmikenComment'
  import type { CharacterColorType } from '@/types/OmikujiData'
  import UserCard from './parts/CouplingUserCard.vue'

  defineProps<{
    users: UserNameType[]
    label: string
    color: CharacterColorType
    drawKey: number
    waiting: boolean
  }>()

  const cardInitial = (side: 'left' | 'right') => ({
    opacity: 0,
    x: side === 'left' ? -100 : 100,
  })
  const cardEnter = { opacity: 1, x: 0, transition: { duration: 1000, delay: 400 } }
</script>

<style scoped>
  .ld-heartbeat {
    animation: ld-heartbeat 1.5s ease-in-out infinite;
  }
  @keyframes ld-heartbeat {
    0%,
    100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1);
    }
    75% {
      transform: scale(1.15);
    }
  }
</style>
