<!-- src/ui/LifeHourglass/components/standard/parts/SandBowlStats.vue -->
<template>
  <!-- 同接・ギフト合計・配信時間(配信時間は小さく) -->
  <div class="lh-stats flex items-center gap-3 whitespace-nowrap tabular-nums">
    <span class="flex items-center gap-1 text-sm font-bold">
      <Users :size="14" />{{ formatGrains(safe(viewer)) }}
    </span>
    <span class="flex items-center gap-1 text-sm font-bold">
      <Gift :size="14" />¥{{ formatGrains(safe(giftTotal)) }}
    </span>
    <span class="flex items-center gap-1 text-xs opacity-70">
      <Clock :size="12" />{{ formatStreamTime(streamSeconds) }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { Clock, Gift, Users } from 'lucide-vue-next'
  import { formatGrains, formatStreamTime } from '../../../composables/bowls'

  defineProps<{ viewer: number; giftTotal: number; streamSeconds: number }>()

  const safe = (n: number) => (Number.isFinite(n) ? n : 0)
</script>

<style scoped>
  .lh-stats {
    color: var(--lh-text);
  }
</style>
