<!-- src/editor/events/pad/PadTriggerEditor.vue -->
<template>
  <SettingItem icon="LayoutGrid" labelKey="padTrigger.padLabel" descriptionKey="padTrigger.padDescription">
    <!-- グリッドサイズ切り替えタブ -->
    <div role="tablist" aria-label="グリッドサイズ" class="mb-2 flex w-fit gap-1 border-b border-base-300">
      <button
        v-for="size in gridSizes"
        :key="size"
        type="button"
        role="tab"
        :aria-selected="gridSize === size"
        class="rounded-t px-3 py-1 text-sm transition-colors"
        :class="
          gridSize === size
            ? 'border-b-2 border-primary font-semibold text-primary'
            : 'border-b-2 border-transparent text-base-content/70 hover:text-base-content'
        "
        @click="gridSize = size"
      >
        {{ size }}×{{ size }}
      </button>
    </div>

    <!-- 選択したサイズのグリッドで選ぶ (LiveConsole のボタン配置と同じ並び) -->
    <div class="grid w-full max-w-md gap-2" :style="{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }">
      <button
        v-for="id in visiblePadIds"
        :key="id"
        type="button"
        class="rounded border px-2 py-1 text-sm transition-colors"
        :class="
          padId === id
            ? 'border-primary bg-primary text-primary-content'
            : 'border-base-300 bg-base-100 hover:bg-base-200'
        "
        :title="t('padTrigger.padName', { n: padNumber(id) })"
        :aria-label="t('padTrigger.padName', { n: padNumber(id) })"
        @click="padId = id"
      >
        {{ padNumber(id) }}
      </button>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { padIds, type PadIdType, type PadTriggerType } from '@/types/OmikujiData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()
  const props = defineProps<{
    modelValue: PadTriggerType
    selectedItemKey: string | null
  }>()

  const { updateEventProperty } = useOmikujiStore()

  /** 選択可能なグリッドサイズ (縦横同一) */
  const gridSizes = [2, 3, 4] as const
  type GridSize = (typeof gridSizes)[number]

  const gridSize = ref<GridSize>(4)

  /** 'pad-3' → 3 */
  const padNumber = (id: PadIdType) => Number(id.replace('pad-', ''))

  /** 現在のタブで表示する範囲のパッドのみ */
  const visiblePadIds = computed<PadIdType[]>(() =>
    padIds.filter((id) => padNumber(id) <= gridSize.value * gridSize.value)
  )

  const padId = computed<PadIdType>({
    get: () => props.modelValue.padId,
    set: (value) => {
      if (!props.selectedItemKey) return
      updateEventProperty('pads', props.selectedItemKey, 'trigger', { ...props.modelValue, padId: value })
    },
  })
</script>
