<!-- src/ui/LiverBingo/editor/LiverBingoItemForm.vue -->
<template>
  <div class="flex flex-col gap-2 rounded border border-base-300 bg-base-200 p-3">
    <input
      type="text"
      class="input input-bordered input-sm w-full"
      :placeholder="t('uiSettings.liverBingo.item.titlePlaceholder')"
      :value="item.title"
      @input="emit('update', { title: ($event.target as HTMLInputElement).value })"
    />

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <label v-if="showWeight" class="flex flex-col gap-1 text-xs">
        {{ t('uiSettings.liverBingo.item.weight', { percent: weightPercent }) }}
        <input
          type="number"
          min="0"
          class="input input-bordered input-sm"
          :value="item.weight"
          @change="emit('update', { weight: toNumber($event, item.weight) })"
        />
      </label>

      <label class="flex flex-col gap-1 text-xs">
        {{ t('uiSettings.liverBingo.item.target') }}
        <input
          type="number"
          min="0"
          class="input input-bordered input-sm"
          :value="item.target"
          @change="emit('update', { target: toNumber($event, item.target) })"
        />
      </label>

      <label class="flex flex-col gap-1 text-xs">
        {{ t('uiSettings.liverBingo.item.unit') }}
        <select
          class="select select-bordered select-sm"
          :value="item.unit"
          @change="emit('update', { unit: toUnit($event, item.unit) })"
        >
          <option v-for="unit in LIVER_BINGO_UNITS" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { LIVER_BINGO_UNITS, type LiverBingoItemType, type LiverBingoUnit } from '@/types/ui'

  defineProps<{
    item: LiverBingoItemType
    /** 出現の重みを編集するか(ランダム項目のみ) */
    showWeight?: boolean
    /** 重みの割合(%)。showWeight のときだけ使う */
    weightPercent?: string
  }>()

  const emit = defineEmits<{
    update: [patch: Partial<LiverBingoItemType>]
  }>()

  const { t } = useI18n()

  // 入力が数値でない・負のときは、元の値のままにする
  const toNumber = (event: Event, fallback: number) => {
    const value = (event.target as HTMLInputElement).valueAsNumber
    return Number.isFinite(value) && value >= 0 ? value : fallback
  }

  const toUnit = (event: Event, fallback: LiverBingoUnit): LiverBingoUnit => {
    const value = Number((event.target as HTMLSelectElement).value)
    return LIVER_BINGO_UNITS.find((unit) => unit === value) ?? fallback
  }
</script>
