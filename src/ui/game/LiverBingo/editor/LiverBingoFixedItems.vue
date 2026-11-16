<!-- src/ui/LiverBingo/editor/LiverBingoFixedItems.vue -->
<template>
  <div class="space-y-3">
    <p v-if="seeds.length === 0" class="text-sm opacity-70">{{ t('uiSettings.liverBingo.fixedItems.empty') }}</p>

    <div v-for="(seed, index) in seeds" :key="index" class="rounded border border-base-300 p-3">
      <div class="flex gap-3">
        <!-- マスの位置(クリックで変更。ほかの固定項目のマスは選べない) -->
        <div class="shrink-0">
          <div class="mb-1 text-xs opacity-70">{{ t('uiSettings.liverBingo.fixedItems.position') }}</div>
          <div class="overflow-hidden rounded border border-base-300">
            <div v-for="row in cardSize" :key="row" class="flex">
              <button
                v-for="col in cardSize"
                :key="col"
                type="button"
                class="h-5 w-5 border border-base-300"
                :class="cellClass(index, row - 1, col - 1)"
                :disabled="isCellUsed(seeds, row - 1, col - 1, index)"
                :aria-label="t('uiSettings.liverBingo.fixedItems.cell', { row, col })"
                @click="replace(index, { ...seed, row: row - 1, col: col - 1 })"
              ></button>
            </div>
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <LiverBingoItemForm :item="seed" @update="(patch) => replace(index, { ...seed, ...patch })" />
        </div>

        <button
          type="button"
          class="btn btn-error btn-sm btn-square"
          :aria-label="t('uiSettings.liverBingo.fixedItems.remove')"
          @click="remove(index)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </div>
    </div>

    <button type="button" class="btn btn-secondary btn-sm" :disabled="!canAdd" @click="add">
      {{ t('uiSettings.liverBingo.fixedItems.add') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Trash2 } from 'lucide-vue-next'
  import type { LiverBingoSeedType } from '@/types/ui'
  import LiverBingoItemForm from './LiverBingoItemForm.vue'
  import { createSeed, isCellUsed } from './seedList'

  const props = defineProps<{
    seeds: LiverBingoSeedType[]
    cardSize: number
  }>()

  const emit = defineEmits<{
    update: [seeds: LiverBingoSeedType[]]
  }>()

  const { t } = useI18n()

  // 全マスが固定項目になったら、これ以上は追加できない
  const canAdd = computed(() => props.seeds.length < props.cardSize * props.cardSize)

  const add = () => {
    const seed = createSeed(props.seeds, props.cardSize)
    if (seed) emit('update', [...props.seeds, seed])
  }

  const replace = (index: number, seed: LiverBingoSeedType) =>
    emit(
      'update',
      props.seeds.map((current, i) => (i === index ? seed : current))
    )

  const remove = (index: number) =>
    emit(
      'update',
      props.seeds.filter((_, i) => i !== index)
    )

  // 選択中のマス / ほかの固定項目が使っているマス
  const cellClass = (index: number, row: number, col: number) => {
    const seed = props.seeds[index]
    if (seed.row === row && seed.col === col) return 'bg-primary'
    return isCellUsed(props.seeds, row, col, index) ? 'bg-base-300 cursor-not-allowed' : 'hover:bg-primary/30'
  }
</script>
