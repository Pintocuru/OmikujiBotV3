<!-- src/editor/events/service/ServiceEditor.vue -->
<template>
  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        icon="Filter"
        label-key="categorySections.trigger.label"
        description-key="categorySections.trigger.description"
      >
        <ServiceTrigger v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>
    </template>

    <!-- 無効のときのメッセージ -->
    <DisabledEventNotice v-else />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ServiceEventType } from '@/types/OmikujiData/'

  import ServiceTrigger from './ServiceTrigger.vue'

  import DisabledEventNotice from '@/editor/events/core/DisabledEventNotice.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useGetEventData } from '@/editor/stores/useGetEventData'

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getEvent('services', selectedItemKey.value)
    },
    set: (value: ServiceEventType) => {
      // イベントは id で識別する（key とは別の値）。getter と同じ selectedItemKey で更新する
      if (!selectedItemKey.value || !value) return
      updateEvent('services', selectedItemKey.value, value)
    },
  })
</script>
