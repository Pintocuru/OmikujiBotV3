<!-- src/editor/assets/mikuji/weight/WeightItemCooldown.vue -->
<!-- クールダウン(秒)の入力。steps のみ編集でき、control は「-」を表示する -->
<template>
  <label
    v-if="item.kind === 'steps'"
    class="input input-sm input-bordered flex w-28 shrink-0 items-center gap-1"
    title="クールダウン(秒)"
  >
    <Timer class="w-3.5 h-3.5 shrink-0 opacity-60" />
    <input
      type="number"
      class="min-w-0 grow"
      :value="item.cooldownSeconds ?? 0"
      min="0"
      step="0.1"
      @change="updateCooldown"
    />
    <span class="text-xs opacity-60">秒</span>
  </label>
  <div v-else class="w-28 shrink-0 text-center opacity-40">-</div>
</template>

<script setup lang="ts">
  import { Timer } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/'

  const props = defineProps<{
    item: OmikujiItemType
  }>()

  const emit = defineEmits<{
    'update:item': [item: OmikujiItemType]
  }>()

  const updateCooldown = (event: Event) => {
    if (props.item.kind !== 'steps') return
    const num = parseFloat((event.target as HTMLInputElement).value)
    emit('update:item', { ...props.item, cooldownSeconds: isNaN(num) || num < 0 ? 0 : num })
  }
</script>
