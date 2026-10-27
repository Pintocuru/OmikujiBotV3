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
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"
      :label="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="timers" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled">
      <!-- タイマー設定セクション -->
      <SectionCard
        id="section-timerInterval"
        :icon="s('timerInterval')?.icon"
        :label="s('timerInterval')?.label"
        :description="s('timerInterval')?.description"
      >
        <TimerIntervalEditor v-model="selectedItem" />
      </SectionCard>

      <!-- みくじ箱選択セクション -->
      <BoxChoiceEditor v-model="selectedItem" />

      <!-- おみくじ設定セクション -->
      <SectionCard
        v-if="hasMikujiBox"
        id="section-omikujiSet"
        :icon="s('omikujiSet')?.icon"
        :label="s('omikujiSet')?.label"
        :description="s('omikujiSet')?.description"
      >
        <MikujiSettings :omikujiKey="selectedItem.omikujiKey" />
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
  import { TimerEventType } from '@/types/OmikujiData/'
  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap'

  import TimerIntervalEditor from './TimerIntervalEditor.vue'

  import GlobalCharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import MikujiSettings from '@/editor/assets/mikuji/MikujiSettings.vue'
  import BoxChoiceEditor from '@/editor/events/core/BoxChoiceEditor.vue'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import InformationCard from '@/editor/parts/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const { t } = useI18n()

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.timers.find((i) => i.section === key)
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
      return getEvent('timers', selectedItemKey.value)
    },
    set: (value: TimerEventType) => {
      // イベントは id で識別する（key とは別の値）。getter と同じ selectedItemKey で更新する
      if (!selectedItemKey.value || !value) return
      updateEvent('timers', selectedItemKey.value, value)
    },
  })

  // 該当する assets.mikuji[omikujiKey] がある場合のみ true
  const hasMikujiBox = computed(() => {
    const key = selectedItem.value?.omikujiKey
    return !!key && hasAsset('mikuji', key)
  })
</script>
