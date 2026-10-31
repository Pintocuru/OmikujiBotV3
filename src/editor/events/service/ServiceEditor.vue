<!-- src/editor/events/service/ServiceEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <GlobalCharacterChanger category="services" />
    <IconKeyChanger category="services" />
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
      <BaseSettingsEditor v-model="selectedItem" category="services" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        sectionKey="trigger"
        icon="Filter"
        label-key="categorySections.trigger.label"
        description-key="categorySections.trigger.description"
      >
        <ServiceTrigger v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ設定 / シナリオ設定セット -->
      <OmikujiSections :omikujiKey="selectedItem.omikujiKey" category="services">
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
  import { ServiceEventType } from '@/types/OmikujiData/'

  import ServiceTrigger from './ServiceTrigger.vue'
  import GlobalCharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'

  import OmikujiSections from '@/editor/events/core/OmikujiSections.vue'
  import BoxChoiceEditor from '@/editor/events/core/BoxChoiceEditor.vue'
  import DisabledEventNotice from '@/editor/events/core/DisabledEventNotice.vue'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
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
