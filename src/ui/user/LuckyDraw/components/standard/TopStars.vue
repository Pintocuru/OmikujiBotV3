<!-- src/ui/user/LuckyDraw/components/standard/TopStars.vue -->
<!-- 当選者を 1 位(王冠つき・大きく)と 2 位以降(横並び)で表示する(旧 WinnerGroup の topStars) -->
<template>
  <div class="relative p-4">
    <!-- 背景 -->
    <div
      class="pointer-events-none absolute inset-0 rounded-2xl border-4"
      :style="{ borderColor: color.accent, background: color.background }"
    />

    <!-- 浮遊する星の装飾 -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <Star
        v-for="i in 8"
        :key="i"
        class="ld-star absolute h-5 w-5"
        :style="{ ...starPosition(i), color: color.accent, fill: color.accent }"
      />
    </div>

    <!-- 見出し -->
    <div v-if="label" class="relative z-10 mb-8 text-center">
      <div class="flex items-center justify-center gap-2">
        <Star class="h-6 w-6 animate-pulse" :style="{ color: color.accent, fill: color.accent }" />
        <h2 class="text-2xl font-bold" :style="{ color: color.name }">{{ label }}</h2>
        <Star class="h-6 w-6 animate-pulse" :style="{ color: color.accent, fill: color.accent }" />
      </div>
    </div>

    <!-- 抽選前 -->
    <div v-if="waiting" class="relative z-10 flex items-center justify-center py-6">
      <div class="text-center opacity-50" :style="{ color: color.text }">
        <Star class="mx-auto mb-3 h-16 w-16 animate-pulse" :style="{ color: color.accent }" />
        <p class="text-sm">{{ $t('uiSettings.luckyDraw.waiting') }}</p>
      </div>
    </div>

    <!-- 当選者なし -->
    <div
      v-else-if="users.length === 0"
      class="relative z-10 py-8 text-center opacity-60"
      :style="{ color: color.text }"
    >
      <Users class="mx-auto mb-3 h-12 w-12" />
      <p class="text-base">{{ $t('uiSettings.luckyDraw.topStars.noUsers') }}</p>
    </div>

    <div v-else class="relative z-10" :key="drawKey">
      <!-- 1 位 -->
      <div class="mb-4 flex justify-center">
        <div
          v-motion
          :initial="{ opacity: 0, y: -50, scale: 0.8 }"
          :enter="{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 1000, delay: 300, type: 'spring', stiffness: 80 },
          }"
          class="flex flex-col items-center"
        >
          <div class="relative">
            <Crown
              class="ld-crown absolute -top-9 left-1/2 h-9 w-9"
              :style="{ color: color.accent, fill: color.accent }"
            />
            <img
              :src="users[0].profileImage || getAvatarUrl(users[0].userName || 'Anonymous')"
              :alt="users[0].userName"
              class="relative z-10 h-[72px] w-[72px] rounded-full object-cover ring-4 ring-offset-4 shadow-xl"
              :style="{ '--tw-ring-color': color.accent }"
            />
            <div
              class="absolute -bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full px-4 py-1 shadow-lg"
              :style="{ background: color.accent, color: color.background }"
            >
              <Trophy class="h-4 w-4" />
              <span class="text-sm font-bold">1st</span>
            </div>
            <Sparkles class="absolute -right-2 top-2 h-5 w-5 animate-ping" :style="{ color: color.accent }" />
          </div>
          <div class="mt-5 text-center text-xl font-bold" :style="{ color: color.name }">{{ users[0].userName }}</div>
        </div>
      </div>

      <!-- 2 位以降 -->
      <div v-if="users.length > 1" class="grid gap-6" :class="restGridClass">
        <div
          v-for="(user, index) in users.slice(1)"
          :key="user.userId || user.userName"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 500 + index * 100 } }"
          class="flex flex-col items-center"
        >
          <div class="relative">
            <Medal
              class="absolute -top-4 left-1/2 h-6 w-6 -translate-x-1/2"
              :style="{ color: color.name, opacity: 0.7 }"
            />
            <img
              :src="user.profileImage || getAvatarUrl(user.userName || 'Anonymous')"
              :alt="user.userName"
              class="h-14 w-14 rounded-full object-cover ring-2 ring-offset-2 shadow-lg"
              :style="{ '--tw-ring-color': color.name }"
            />
            <div
              class="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-bold shadow-md"
              :style="{ background: color.name, color: color.background }"
            >
              {{ rankLabel(index + 2) }}
            </div>
          </div>
          <div class="mt-3 text-center text-base font-bold" :style="{ color: color.text }">{{ user.userName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Star, Crown, Trophy, Medal, Sparkles, Users } from '@lucide/vue'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import type { UserNameType } from '@/types/OmikenComment'
  import type { CharacterColorType } from '@/types/OmikujiData'

  const props = defineProps<{
    users: UserNameType[]
    label: string
    color: CharacterColorType
    drawKey: number
    waiting: boolean
  }>()

  const restGridClass = computed(() => {
    const n = props.users.length
    if (n === 2) return 'grid-cols-1'
    if (n === 3) return 'grid-cols-2'
    if (n === 4) return 'grid-cols-2 sm:grid-cols-3'
    return 'grid-cols-2 sm:grid-cols-4'
  })

  const rankLabel = (rank: number) => (rank === 2 ? '2nd' : rank === 3 ? '3rd' : `${rank}th`)

  const STAR_POSITIONS = [
    { top: '5%', left: '10%' },
    { top: '10%', right: '8%' },
    { top: '40%', left: '5%' },
    { top: '45%', right: '5%' },
    { bottom: '20%', left: '12%' },
    { bottom: '15%', right: '10%' },
    { top: '25%', left: '20%' },
    { top: '30%', right: '18%' },
  ]
  const starPosition = (index: number) => ({
    ...STAR_POSITIONS[index % STAR_POSITIONS.length],
    animationDelay: `${(index % 8) * 0.5}s`,
  })
</script>

<style scoped>
  .ld-crown {
    animation: ld-bounce-crown 2s ease-in-out infinite;
  }
  .ld-star {
    opacity: 0.2;
    animation: ld-float-star 5s ease-in-out infinite;
  }
  @keyframes ld-bounce-crown {
    0%,
    100% {
      transform: translateY(0) translateX(-50%) rotate(-10deg);
    }
    50% {
      transform: translateY(-10px) translateX(-50%) rotate(10deg);
    }
  }
  @keyframes ld-float-star {
    0%,
    100% {
      transform: translateY(0) rotate(0deg) scale(1);
    }
    50% {
      transform: translateY(-30px) rotate(180deg) scale(1.1);
    }
  }
</style>
