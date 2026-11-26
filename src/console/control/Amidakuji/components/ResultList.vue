<!-- src/console/control/Amidakuji/components/ResultList.vue -->
<template>
  <div class="absolute inset-0 bg-base-300/85 backdrop-blur-xs flex items-center justify-center p-6 z-20">
    <div
      class="card bg-base-100 shadow-2xl border border-base-200 max-w-lg w-full max-h-[85vh] flex flex-col p-6 animate-scale-in"
    >
      <div class="flex items-center justify-between pb-3 border-b border-base-200">
        <h2 class="text-xl font-black flex items-center gap-2"><span>🎉</span> 結果発表</h2>
        <button type="button" class="btn btn-sm btn-warning font-bold" @click="emit('reset')">もう一度あそぶ</button>
      </div>

      <div class="flex-1 overflow-y-auto my-4 pr-1 flex flex-col gap-2">
        <div
          v-for="(res, idx) in results"
          :key="res.player.id"
          class="flex items-center justify-between p-2.5 rounded-lg border text-sm transition-all"
          :class="res.goal.isHit ? 'bg-primary/10 border-primary/40 font-bold' : 'bg-base-200/50 border-base-300'"
        >
          <div class="flex items-center gap-2.5 truncate max-w-60">
            <span class="text-xs opacity-60 w-5 font-mono">{{ idx + 1 }}.</span>
            <span class="truncate" :title="res.player.name">{{ res.player.name }}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="badge text-xs font-bold" :class="res.goal.isHit ? 'badge-primary' : 'badge-neutral'">
              {{ res.goal.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-base-200 flex justify-end">
        <button type="button" class="btn btn-primary btn-sm font-bold w-full" @click="emit('reset')">設定に戻る</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ResultEntry } from '../composables/useAmidakuji'

  defineProps<{
    results: ResultEntry[]
  }>()

  const emit = defineEmits<{
    (e: 'reset'): void
  }>()
</script>
