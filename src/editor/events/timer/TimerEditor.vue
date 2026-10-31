<!-- src/editor/events/timer/TimerEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <GlobalCharacterChanger category="timers" />
    <IconKeyChanger category="timers" />
  </div>

  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      sectionKey="baseSettings"
      icon="SlidersHorizontal"
      :variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"
      label-key="categorySections.baseSettings.label"
      description-key="categorySections.baseSettings.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="timers" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled">
      <!-- タイマー設定セクション -->
      <SectionCard
        sectionKey="timerInterval"
        icon="Timer"
        label-key="categorySections.timerInterval.label"
        description-key="categorySections.timerInterval.description"
      >
        <TimerIntervalEditor v-model="selectedItem" />
      </SectionCard>

      <!-- おみくじ設定 / シナリオ設定セット -->
      <OmikujiSections :omikujiKey="selectedItem.omikujiKey" category="timers">
        <template #choice>
          <BoxChoiceEditor v-model="selectedItem" />
        </template>
      </OmikujiSections>
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

  import GlobalCharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import OmikujiSections from '@/editor/events/core/OmikujiSections.vue'
  import BoxChoiceEditor from '@/editor/events/core/BoxChoiceEditor.vue'
  import DisabledEventNotice from '@/editor/events/core/DisabledEventNotice.vue'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
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
