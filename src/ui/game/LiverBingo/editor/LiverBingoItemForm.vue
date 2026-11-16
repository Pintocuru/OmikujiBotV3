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

    <!-- 何で進むか(手動 / 配信の数値 / 評価ブロックの変数) -->
    <div class="flex flex-col gap-1 text-xs">
      <label class="flex flex-col gap-1">
        {{ t('uiSettings.liverBingo.item.source.label') }}
        <select class="select select-bordered select-sm" :value="sourceValue" @change="changeSource">
          <option value="manual">{{ t('uiSettings.liverBingo.item.source.manual') }}</option>
          <optgroup :label="t('uiSettings.liverBingo.item.source.counterGroup')">
            <option v-for="key in PROGRESS_COUNTER_KEYS" :key="key" :value="`counter:${key}`">
              {{ t(`uiSettings.liverBingo.item.source.counter.${key}`) }}
            </option>
          </optgroup>
          <option value="variable">{{ t('uiSettings.liverBingo.item.source.variable') }}</option>
        </select>
      </label>

      <input
        v-if="item.source.type === 'variable'"
        type="text"
        class="input input-bordered input-sm w-full"
        :placeholder="t('uiSettings.liverBingo.item.source.variablePlaceholder')"
        :value="item.source.name"
        @change="
          emit('update', { source: { type: 'variable', name: ($event.target as HTMLInputElement).value.trim() } })
        "
      />

      <p v-if="item.source.type !== 'manual'" class="opacity-70">
        {{ t('uiSettings.liverBingo.item.source.note.auto') }}
        <template v-if="sourceNoteKey">{{ t(`uiSettings.liverBingo.item.source.note.${sourceNoteKey}`) }}</template>
      </p>
    </div>

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
  import { computed } from 'vue'
  import { LIVER_BINGO_UNITS, PROGRESS_COUNTER_KEYS, type LiverBingoItemType, type LiverBingoUnit } from '@/types/ui'

  const props = defineProps<{
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

  // 「何で進むか」の select の値(manual / counter:<key> / variable)
  const sourceValue = computed(() => {
    const { source } = props.item
    return source.type === 'counter' ? `counter:${source.key}` : source.type
  })

  // 補足を出す項目(ギフト金額・同時視聴者数・変数)
  const sourceNoteKey = computed(() => {
    const { source } = props.item
    if (source.type === 'variable') return 'variable'
    if (source.type === 'counter' && (source.key === 'totalPrice' || source.key === 'viewer')) return source.key
    return ''
  })

  const changeSource = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value
    if (value === 'manual') return emit('update', { source: { type: 'manual' } })
    if (value === 'variable') {
      const name = props.item.source.type === 'variable' ? props.item.source.name : ''
      return emit('update', { source: { type: 'variable', name } })
    }
    const key = PROGRESS_COUNTER_KEYS.find((k) => `counter:${k}` === value)
    if (key) emit('update', { source: { type: 'counter', key } })
  }

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
