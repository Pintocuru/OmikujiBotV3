<!-- src/editor/events/pad/PadTriggerEditor.vue -->
<template>
  <SettingItem icon="LayoutGrid" labelKey="padTrigger.padLabel" descriptionKey="padTrigger.padDescription">
    <!-- グリッドサイズ切り替えタブ -->
    <div role="tablist" class="tabs tabs-sm mb-2 w-fit">
      <button
        v-for="size in gridSizes"
        :key="size"
        type="button"
        role="tab"
        class="tab"
        :class="{ 'tab-active': gridSize === size }"
        @click="gridSize = size"
      >
        {{ size }}×{{ size }}
      </button>
    </div>

    <!-- 選択したサイズのグリッドで選ぶ (LiveConsole のボタン配置と同じ並び) -->
    <div class="grid w-full max-w-md gap-2" :class="`grid-cols-${gridSize}`">
      <button
        v-for="id in visiblePadIds"
        :key="id"
        type="button"
        class="btn btn-sm"
        :class="padId === id ? 'btn-primary' : 'btn-ghost border-base-300'"
        :title="t('padTrigger.padName', { n: padNumber(id) })"
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
