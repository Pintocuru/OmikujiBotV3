<!-- src/editor/events/pad/PadTriggerEditor.vue -->
<template>
  <SettingItem icon="LayoutGrid" :label="t('padTrigger.padLabel')" :description="t('padTrigger.padDescription')">
    <!-- 4×4 のグリッドで選ぶ (LiveConsole のボタン配置と同じ並び) -->
    <div class="grid w-full max-w-xs grid-cols-4 gap-2">
      <button
        v-for="id in padIds"
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
  import { computed } from 'vue'
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

  /** 'pad-3' → 3 */
  const padNumber = (id: PadIdType) => Number(id.replace('pad-', ''))

  const padId = computed<PadIdType>({
    get: () => props.modelValue.padId,
    set: (value) => {
      if (!props.selectedItemKey) return
      updateEventProperty('pads', props.selectedItemKey, 'trigger', { ...props.modelValue, padId: value })
    },
  })
</script>
