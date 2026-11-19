<!-- src/console/game/UserRace/components/RaceTrack.vue -->
<!-- コース (レーンごとの名前・走者・ゴール)。表示だけで、進行は持たない -->
<template>
  <div class="flex h-full w-full flex-col justify-center gap-2 px-6 py-4">
    <div v-for="racer in racers" :key="racer.userId" class="flex items-center gap-3">
      <span class="w-40 shrink-0 truncate text-right text-lg font-bold" :title="racer.userName">{{
        racer.userName
      }}</span>

      <!-- レーン。走者は left で動かす (位置 0〜1 を、レーンの幅 - 走者の幅 に割り当てる) -->
      <div class="relative h-12 grow rounded-full bg-white/10">
        <div class="absolute inset-y-1/2 right-0 left-2 border-t-2 border-dashed border-white/20" />
        <div class="finish-line absolute inset-y-0 right-0 w-3 rounded-r-full" />

        <div
          class="runner absolute top-1 flex size-10 items-center justify-center overflow-hidden rounded-full text-lg font-bold shadow-lg"
          :class="LANE_COLORS[racer.lane % LANE_COLORS.length]"
          :style="{ left: `calc((100% - 2.5rem) * ${racer.position})` }"
        >
          {{ initialOf(racer.userName) }}
          <img
            v-if="racer.profileImage && !failedImages.has(racer.userId)"
            :src="racer.profileImage"
            alt=""
            class="absolute inset-0 size-full object-cover"
            @error="failedImages.add(racer.userId)"
          />
        </div>
      </div>

      <!-- ゴールした順位 -->
      <span class="w-10 shrink-0 text-2xl">{{ rankMark(ranks.get(racer.userId)) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import type { Racer } from '../scripts/raceEngine'

  defineProps<{ racers: Racer[]; ranks: Map<string, number> }>()

  // Tailwind がクラス名を見つけられるよう、文字列のまま書いておく
  const LANE_COLORS = [
    'bg-primary text-primary-content',
    'bg-secondary text-secondary-content',
    'bg-accent text-accent-content',
    'bg-info text-info-content',
    'bg-success text-success-content',
    'bg-warning text-warning-content',
    'bg-error text-error-content',
    'bg-neutral-content text-neutral',
  ]

  // 読み込めなかったアイコンは、頭文字の表示に戻す
  const failedImages = reactive(new Set<string>())

  // 絵文字などの 1 文字が崩れないよう、コードポイント単位で先頭を取る
  const initialOf = (name: string) => Array.from(name)[0] ?? '?'

  const MEDALS = ['🥇', '🥈', '🥉']
  const rankMark = (rank?: number) => (rank === undefined ? '' : (MEDALS[rank - 1] ?? `${rank}`))
</script>

<style scoped>
  /* チェッカー柄のゴールライン */
  .finish-line {
    background: repeating-conic-gradient(#fff 0% 25%, #111 0% 50%) 50% / 12px 12px;
  }
</style>
