<!-- src/editor/assets/mikuji/weight/WeightBar.vue -->
<template>
  <div v-if="omikujiItems.length > 0" class="">
    <!-- 凡例（ドラッグ可能） -->
    <VueDraggable v-model="draggableItems" handle=".legend-drag-handle" :animation="200" class="w-full space-y-2">
      <WeightItem
        v-for="(item, index) in draggableItems"
        :key="item.id ?? `legend-${index}`"
        :item="item"
        :color="getColorForIndex(index)"
        :percentage="String(localItems[index]?.weightPercent)"
        :isSelected="selectedOmikujiId === item.id"
        @update:weight="$emit('update:weight', { index, weight: $event })"
        @select="$emit('select', item.id)"
        @duplicate="duplicateItem(index)"
        @delete="removeItem(index)"
        @update:item="updateItem(index, $event)"
      />
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import type { OmikujiItemType } from '@/types/OmikujiData/'
  import WeightItem from './WeightItem.vue'
  import { addWeightPercentages } from '@/engine/DrawOmikuji/DrawOmikuji'
  import { getColorForIndex, duplicateItemAt, removeItemAt } from '../composables/useOmikujiWeight'

  const props = defineProps<{
    omikujiItems: OmikujiItemType[]
    selectedOmikujiId: string | null
  }>()

  const emit = defineEmits<{
    'update:items': [items: OmikujiItemType[]]
    'update:weight': [payload: { index: number; weight: number }]
    select: [id: string]
  }>()

  const localItems = computed(() => addWeightPercentages(props.omikujiItems))

  const draggableItems = computed({
    get: () => props.omikujiItems,
    set: (val: OmikujiItemType[]) => emit('update:items', val),
  })

  const duplicateItem = (index: number) => emit('update:items', duplicateItemAt(props.omikujiItems, index))
  const removeItem = (index: number) => emit('update:items', removeItemAt(props.omikujiItems, index))
  // 1 件分の更新を、一覧全体の更新として返す
  const updateItem = (index: number, item: OmikujiItemType) =>
    emit(
      'update:items',
      props.omikujiItems.map((v, i) => (i === index ? item : v))
    )
</script>
