<!-- src/editor/events/comment/CommentEditor.vue -->
<template>
  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      icon="SlidersHorizontal"
      label-key="categorySections.baseSettings.label"
      description-key="categorySections.baseSettings.description"
    >
      <BaseEditor v-model="selectedItem" category="comments" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-threshold"
        icon="Filter"
        label-key="categorySections.threshold.label"
        description-key="categorySections.threshold.description"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ設定 / シナリオ設定セット -->
      <OmikujiSections :omikujiKey="selectedItem.omikujiKey" category="comments">
        <template #choice>
          <BoxChoiceEditor v-model="selectedItem" />
        </template>
      </OmikujiSections>
    </template>

    <!-- 無効のときのメッセージ -->
    <InformationCard v-else variant="error" class="mt-4 p-4">
      {{ t('eventCore.disabledNotice.title') }}<br />
      {{ t('eventCore.disabledNotice.action') }}
    </InformationCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { CommentEventType } from '@/types/OmikujiData/'

  import CommentTriggerEditor from './CommentTriggerEditor.vue'
  import OmikujiSections from '@/editor/events/core/OmikujiSections.vue'
  import BoxChoiceEditor from '@/editor/events/core/BoxChoiceEditor.vue'

  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'

  const { t } = useI18n()

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getEvent('comments', selectedItemKey.value)
    },
    set: (value: CommentEventType) => {
      // イベントは id で識別する（key とは別の値）。getter と同じ selectedItemKey で更新する
      if (!selectedItemKey.value || !value) return
      updateEvent('comments', selectedItemKey.value, value)
    },
  })
</script>
