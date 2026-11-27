<!-- src/console/control/Amidakuji/components/setup/RungsSection.vue -->
<template>
  <div class="card bg-base-200 shadow-sm p-3 flex flex-col gap-2">
    <div class="font-bold text-sm">横線の生成</div>
    <div class="text-[10px] opacity-60">
      盤面をクリック/ドラッグで引く・消す。Shift+ドラッグ(または右ドラッグ)で移動
    </div>
    <div class="flex items-center justify-between text-xs">
      <span>密度 (既定 30%):</span>
      <span class="font-mono font-bold">{{ Math.round(rungDensity * 100) }}%</span>
    </div>
    <input
      v-model.number="rungDensity"
      type="range"
      min="0.1"
      max="0.6"
      step="0.05"
      class="range range-xs range-primary"
    />

    <div class="grid grid-cols-2 gap-1.5 mt-1">
      <button type="button" class="btn btn-xs btn-primary" :disabled="players.length < 2" @click="generateAuto">
        自動で埋める
      </button>
      <button type="button" class="btn btn-xs btn-outline" @click="resetAutoRungs">自動分やり直し</button>
    </div>
    <button type="button" class="btn btn-xs btn-ghost text-error" @click="resetAllRungs">横線を全リセット</button>
  </div>
</template>

<script setup lang="ts">
  import { useAmidakujiContext } from '../../composables/useAmidakujiContext'

  const { players, generateAuto, rungs } = useAmidakujiContext()
  const { rungDensity, resetAutoRungs, resetAllRungs } = rungs
</script>
