<!-- src/ui/StreamCounter/editor/CounterSelector/CounterOrderSection.vue -->
<template>
  <div v-if="counters.length > 0" class="mt-4 p-4 bg-base-200 rounded-box text-sm">
    <div class="font-bold mb-2">表示順（最大 {{ maxCounters }} 個）: 現在 {{ counters.length }}個</div>
    <VueDraggable v-model="draggableCounters" :animation="150" handle=".drag-handle" class="flex flex-wrap gap-1">
      <div
        v-for="(c, i) in draggableCounters"
        :key="c.id"
        class="badge badge-primary gap-1 drag-handle cursor-grab active:cursor-grabbing"
      >
        <span class="opacity-50 text-xs">{{ i + 1 }}</span>
        {{ c.label }}
        <button class="btn btn-ghost btn-xs px-0 min-h-0 h-auto" @click.stop="emit('remove', c.id)">×</button>
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CounterItem } from './counterTypes'
  import { VueDraggable } from 'vue-draggable-plus'

  const props = defineProps<{
    counters: CounterItem[]
    maxCounters: number
  }>()

  const emit = defineEmits<{
    remove: [id: string]
    reorder: [items: CounterItem[]]
  }>()

  const draggableCounters = computed({
    get: () => [...props.counters],
    set: (v) => emit('reorder', v),
  })
</script>
