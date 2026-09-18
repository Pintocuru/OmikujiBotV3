<!-- src/editor/assets/box/OmikujiWeightProgressBar.vue -->
<template>
  <div v-if="omikujiItems.length > 0" class="space-y-2">
    <!-- 凡例（ドラッグ可能） -->
    <VueDraggable
      v-model="draggableItems"
      handle=".legend-drag-handle"
      :animation="200"
      class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
    >
      <OmikujiLegendItem
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
      />
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import OmikujiLegendItem from './OmikujiLegendItem.vue'
  import { addWeightPercentages } from '@/common/omikuji/DrawOmikuji'
  import { getColorForIndex } from './useOmikujiWeight.js'
  import { generateId } from '@/types/core'

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
    set: (val: OmikujiItemType[]) => {
      emit('update:items', val)
    },
  })

  const duplicateItem = (index: number) => {
    const item = props.omikujiItems[index]
    if (!item) return

    const id = generateId()
    const duplicated = {
      ...structuredClone(item),
      id,
      key: id,
      name: `${item.name}(コピー)`,
    }

    const newList = [...props.omikujiItems]
    newList.splice(index + 1, 0, duplicated)
    emit('update:items', newList)
  }

  const removeItem = (index: number) => {
    const newList = props.omikujiItems.filter((_, i) => i !== index)
    emit('update:items', newList)
  }
</script>
