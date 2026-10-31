<!-- src/editor/events/comment/CommentEditor.vue -->
<template>
  <template v-if="selectedItem">
    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        icon="Filter"
        label-key="categorySections.threshold.label"
        description-key="categorySections.threshold.description"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>
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
