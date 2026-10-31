<!-- src/editor/events/pad/PadEditor.vue -->
<template>
  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <!-- 無効のときのメッセージ -->
    <InformationCard variant="info" class="mt-4 p-4"> {{ t('padEditor.notice') }}<br /> </InformationCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        icon="Filter"
        label-key="categorySections.trigger.label"
        description-key="categorySections.trigger.description"
      >
        <PadTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>
    </template>

    <!-- 無効のときのメッセージ -->
    <DisabledEventNotice v-else />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { PadEventType } from '@/types/OmikujiData/'

  import PadTriggerEditor from './PadTriggerEditor.vue'
  import DisabledEventNotice from '@/editor/events/core/DisabledEventNotice.vue'

  import InformationCard from '@/editor/parts/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'

  const { t } = useI18n()

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getEvent('pads', selectedItemKey.value)
    },
    set: (value: PadEventType) => {
      // イベントは id で識別する（key とは別の値）。getter と同じ selectedItemKey で更新する
      if (!selectedItemKey.value || !value) return
      updateEvent('pads', selectedItemKey.value, value)
    },
  })
</script>
