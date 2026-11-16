<!-- src/ui/DeadAir/editor/DeadAirPreviewControls.vue -->
<template>
  <div class="flex flex-col gap-1 p-1.5 rounded-box bg-base-200">
    <!-- 倍速 -->
    <div class="flex items-center gap-2">
      <span class="text-xs opacity-70">{{ $t('uiSettings.deadAir.preview.speed') }}</span>
      <div class="join">
        <button
          v-for="s in DEAD_AIR_PREVIEW_SPEEDS"
          :key="s"
          class="btn btn-xs join-item"
          :class="{ 'btn-primary': speed === s }"
          @click="speed = s"
        >
          ×{{ s }}
        </button>
      </div>
    </div>

    <!-- カウンターを増やす(イベントルールの確認用) -->
    <div v-if="counterKeys.length" class="flex flex-wrap items-center gap-1">
      <span class="text-xs opacity-70">{{ $t('uiSettings.deadAir.preview.counter') }}</span>
      <button v-for="c in counterKeys" :key="c.key" class="btn btn-xs btn-warning" @click="emit('bump', c.key, c.step)">
        {{ c.key }} +{{ c.step }}
      </button>
    </div>

    <!-- 最初から -->
    <div class="flex justify-end">
      <button class="btn btn-xs btn-ghost" @click="emit('restart')">
        {{ $t('uiSettings.deadAir.preview.restart') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { DEAD_AIR_PREVIEW_SPEEDS } from './useDeadAirPreview'

  const speed = defineModel<number>('speed', { required: true })

  defineProps<{
    /** 増やせるカウンターと、1 回で増やす量(そのキーのルールの最小しきい値) */
    counterKeys: { key: string; step: number }[]
  }>()

  const emit = defineEmits<{
    bump: [key: string, amount: number]
    restart: []
  }>()
</script>
