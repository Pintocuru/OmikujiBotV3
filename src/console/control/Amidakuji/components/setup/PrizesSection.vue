<!-- src/console/control/Amidakuji/components/setup/PrizesSection.vue -->
<template>
  <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
    <div class="font-bold text-sm flex items-center justify-between">
      <span>当たり賞品の設定</span>
      <button type="button" class="btn btn-xs btn-ghost text-primary" @click="addPrize">＋追加</button>
    </div>

    <div class="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
      <div v-for="prize in prizes" :key="prize.id" class="flex items-center gap-1.5 bg-base-100 p-1.5 rounded">
        <input v-model="prize.name" type="text" placeholder="賞品名" class="input input-xs input-bordered flex-1" />
        <input
          v-model.number="prize.count"
          type="number"
          min="1"
          step="1"
          class="input input-xs input-bordered w-14 font-mono text-center"
        />
        <span class="text-xs">個</span>
        <button
          v-if="prizes.length > 1"
          type="button"
          class="btn btn-ghost btn-xs text-error px-1"
          @click="removePrize(prize.id)"
        >
          ×
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between border-t border-base-300 pt-2 text-xs">
      <span class="opacity-80">はずれの表示名:</span>
      <input v-model="loseLabel" type="text" class="input input-xs input-bordered w-24 text-center" />
    </div>

    <div class="flex items-center justify-between text-xs">
      <span class="opacity-80">当たり合計 / 参加者数:</span>
      <span class="font-bold font-mono" :class="totalPrizes > players.length ? 'text-error' : ''">
        {{ totalPrizes }} / {{ players.length }}
      </span>
    </div>

    <label class="label cursor-pointer justify-start gap-2 pt-0 pb-0 text-xs">
      <input v-model="hideGoalsBeforeReveal" type="checkbox" class="checkbox checkbox-xs" />
      <span class="label-text text-xs">発表前はゴールを隠す</span>
    </label>
  </div>
</template>

<script setup lang="ts">
  import { useAmidakujiContext } from '../../composables/useAmidakujiContext'

  const { players, prizes, loseLabel, totalPrizes, hideGoalsBeforeReveal, addPrize, removePrize } =
    useAmidakujiContext()
</script>
