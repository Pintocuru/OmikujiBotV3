<!-- src/editor/events/comment/CommentEditor.vue -->
<template>
  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :label="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseEditor v-model="selectedItem" category="comments" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-threshold"
        :icon="s('threshold')?.icon"
        :label="s('threshold')?.label"
        :description="s('threshold')?.description"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ設定セクション -->
      <SectionCard
        id="section-omikujiSet"
        :icon="s('omikujiSet')?.icon"
        :label="s('omikujiSet')?.label"
        :description="s('omikujiSet')?.description"
      >
        <div class="space-y-4">
          <BoxChoiceEditor v-model="selectedItem" />

          <MikujiSettings
            v-if="hasMikujiBox && selectedItem.omikujiKey"
            :omikujiKey="selectedItem.omikujiKey"
          />
          <!-- 存在しないみくじ箱を参照しているとき -->
          <NoParamsCard
            v-else-if="!hasMikujiBox && selectedItem.omikujiKey"
            iconName="Package"
            :message="t('eventCore.boxChoiceEditor.omikujiKey.none')"
            :sub="t('commentEditor.omikujiKeyMissing')"
          />
          <!-- 未選択のとき -->
          <NoParamsCard
            v-else
            :message="t('eventCore.boxChoiceEditor.omikujiKey.none')"
            :sub="t('commentEditor.omikujiKeyUnselected')"
          />
        </div>
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
  import BoxChoiceEditor from '@/editor/events/core/BoxChoiceEditor.vue'

  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import MikujiSettings from '@/editor/assets/mikuji/MikujiSettings.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const { t } = useI18n()

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.comments.find((i) => i.section === key)
    if (!item) return null
    return {
      ...item,
      label: t(`categorySections.${item.section}.label`),
      description: t(`categorySections.${item.section}.description`),
    }
  }

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()
  const { hasAsset } = useGetAssetData()

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

  // 該当する assets.mikuji[omikujiKey] がある場合のみ true
  const hasMikujiBox = computed(() => {
    const key = selectedItem.value?.omikujiKey
    return !!key && hasAsset('mikuji', key)
  })
</script>
