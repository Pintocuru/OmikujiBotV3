<!-- src/ui/LiverBingo/editor/LiverBingoRandomItems.vue -->
<template>
  <div class="space-y-3">
    <button type="button" class="btn btn-secondary btn-sm" @click="emit('update', [createEmptyItem(), ...items])">
      {{ t('uiSettings.liverBingo.randomItems.add') }}
    </button>

    <div v-for="(item, index) in items" :key="index" class="flex items-start gap-2">
      <div class="min-w-0 flex-1">
        <LiverBingoItemForm
          :item="item"
          showWeight
          :weightPercent="percent(item.weight)"
          @update="(patch) => replace(index, { ...item, ...patch })"
        />
      </div>
      <div class="flex flex-col gap-1">
        <button type="button" class="btn btn-sm" @click="copy(index)">
          {{ t('uiSettings.liverBingo.randomItems.copy') }}
        </button>
        <button
          type="button"
          class="btn btn-error btn-sm btn-square"
          :aria-label="t('uiSettings.liverBingo.randomItems.remove')"
          @click="remove(index)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </div>

    <button
      v-if="items.length > 0"
      type="button"
      class="btn btn-secondary btn-sm"
      @click="emit('update', [...items, createEmptyItem()])"
    >
      {{ t('uiSettings.liverBingo.randomItems.add') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Trash2 } from 'lucide-vue-next'
  import type { LiverBingoItemType } from '@/types/ui'
  import LiverBingoItemForm from './LiverBingoItemForm.vue'
  import { createEmptyItem } from './seedList'

  const props = defineProps<{
    items: LiverBingoItemType[]
  }>()

  const emit = defineEmits<{
    update: [items: LiverBingoItemType[]]
  }>()

  const { t } = useI18n()

  const totalWeight = computed(() => props.items.reduce((sum, item) => sum + item.weight, 0))
  const percent = (weight: number) => (totalWeight.value > 0 ? ((weight / totalWeight.value) * 100).toFixed(1) : '0')

  const replace = (index: number, item: LiverBingoItemType) =>
    emit(
      'update',
      props.items.map((current, i) => (i === index ? item : current))
    )

  const copy = (index: number) => {
    const next = [...props.items]
    next.splice(index + 1, 0, { ...props.items[index] })
    emit('update', next)
  }

  const remove = (index: number) =>
    emit(
      'update',
      props.items.filter((_, i) => i !== index)
    )
</script>
