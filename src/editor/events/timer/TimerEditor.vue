<!-- src/editor/events/timer/TimerEditor.vue -->
<template>
  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <template v-if="selectedItem.isEnabled">
      <!-- タイマー設定セクション -->
      <SectionCard
        icon="Timer"
        label-key="categorySections.timerInterval.label"
        description-key="categorySections.timerInterval.description"
      >
        <TimerIntervalEditor v-model="selectedItem" />
      </SectionCard>
    </template>

    <!-- 無効のときのメッセージ -->
    <DisabledEventNotice v-else />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { TimerEventType } from '@/types/OmikujiData/'

  import TimerIntervalEditor from './TimerIntervalEditor.vue'

  import DisabledEventNotice from '@/editor/events/core/DisabledEventNotice.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getEvent('timers', selectedItemKey.value)
    },
    set: (value: TimerEventType) => {
      // イベントは id で識別する（key とは別の値）。getter と同じ selectedItemKey で更新する
      if (!selectedItemKey.value || !value) return
      updateEvent('timers', selectedItemKey.value, value)
    },
  })
</script>
