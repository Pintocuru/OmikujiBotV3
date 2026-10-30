<!-- src/editor/events/reaction/ReactionEditor.vue -->
<template>
  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <!-- プラットフォームに関する注意 -->
    <InformationCard variant="info" class="mt-4 p-4"> {{ t('reactionEditor.platformNotice') }}<br /> </InformationCard>

    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      icon="SlidersHorizontal"
      :variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"
      label-key="categorySections.baseSettings.label"
      description-key="categorySections.baseSettings.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="reactions" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-trigger"
        icon="Filter"
        label-key="categorySections.trigger.label"
        description-key="categorySections.trigger.description"
      >
        <ReactionTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ設定 / シナリオ設定セット -->
      <OmikujiSections :omikujiKey="selectedItem.omikujiKey" category="reactions">
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
  import { useI18n } from 'vue-i18n'
  import { ReactionEventType } from '@/types/OmikujiData/'

  import ReactionTriggerEditor from './ReactionTriggerEditor.vue'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import OmikujiSections from '@/editor/events/core/OmikujiSections.vue'
  import BoxChoiceEditor from '@/editor/events/core/BoxChoiceEditor.vue'
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
      return getEvent('reactions', selectedItemKey.value)
    },
    set: (value: ReactionEventType) => {
      // イベントは id で識別する（key とは別の値）。getter と同じ selectedItemKey で更新する
      if (!selectedItemKey.value || !value) return
      updateEvent('reactions', selectedItemKey.value, value)
    },
  })
</script>
