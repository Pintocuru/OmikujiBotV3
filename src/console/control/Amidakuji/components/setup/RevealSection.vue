<!-- src/console/control/Amidakuji/components/setup/RevealSection.vue -->
<template>
  <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
    <div class="font-bold text-sm">発表設定</div>
    <div class="flex items-center justify-between text-xs">
      <span>発表方式:</span>
      <div class="join">
        <input
          v-model="revealMode"
          type="radio"
          name="revealMode"
          value="simultaneous"
          aria-label="一斉"
          class="btn btn-xs join-item"
        />
        <input
          v-model="revealMode"
          type="radio"
          name="revealMode"
          value="individual"
          aria-label="一人ずつ"
          class="btn btn-xs join-item"
        />
      </div>
    </div>

    <div class="flex items-center justify-between text-xs">
      <span>速度:</span>
      <select v-model="followSpeed" class="select select-xs select-bordered">
        <option value="slow">ゆっくり</option>
        <option value="normal">ふつう</option>
        <option value="fast">はやい</option>
      </select>
    </div>

    <div v-if="validationMessage" class="text-error text-xs">
      {{ validationMessage }}
    </div>

    <button
      type="button"
      class="btn btn-sm btn-accent font-bold mt-2 text-white"
      :disabled="!canStartReveal"
      @click="startReveal"
    >
      あみだくじ スタート！
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PLAYER_MIN } from '../../scripts/amidakujiConstants'
  import { useAmidakujiContext } from '../../composables/useAmidakujiContext'

  const { players, totalPrizes, revealMode, followSpeed, canStartReveal, startReveal } = useAmidakujiContext()

  const validationMessage = computed(() => {
    if (players.value.length < PLAYER_MIN) return `参加者を${PLAYER_MIN}人以上集めてください`
    if (totalPrizes.value > players.value.length) return '当たりの合計数が参加者数を超えています'
    return ''
  })
</script>
