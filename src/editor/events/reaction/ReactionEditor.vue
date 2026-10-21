<!-- src/editor/events/reaction/ReactionEditor.vue -->
<template>
  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <!-- 無効のときのメッセージ -->
    <InformationCard variant="info" class="mt-4 p-4"> {{ t('reactionEditor.platformNotice') }}<br /> </InformationCard>

    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"
      :label="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="reactions" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-trigger"
        :icon="s('trigger')?.icon"
        :isOpen="activeSection === 'trigger'"
        @toggle="toggleSection('trigger')"
        :label="s('trigger')?.label"
        :description="s('trigger')?.description"
      >
        <ReactionTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- みくじ箱選択セクション -->
      <BoxChoiceEditor v-model="selectedItem" />

      <!-- おみくじ設定セクション -->
      <SectionCard
        v-if="hasMikujiBox"
        id="section-omikujiSet"
        :icon="s('omikujiSet')?.icon"
        :isOpen="activeSection === 'omikujiSet'"
        @toggle="toggleSection('omikujiSet')"
        :label="s('omikujiSet')?.label"
        :description="s('omikujiSet')?.description"
      >
        <MikujiSettings category="comments" :omikujiKey="selectedItem.omikujiKey" />
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
  import { ReactionEventType } from '@/types/OmikujiData/'
  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap'

  import ReactionTriggerEditor from './ReactionTriggerEditor.vue'
  import BoxChoiceEditor from '@/editor/events/core/BoxChoiceEditor.vue'

  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import MikujiSettings from '@/editor/assets/mikuji/MikujiSettings.vue'

  import InformationCard from '@/editor/parts/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const { t } = useI18n()

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.reactions.find((i) => i.section === key)
    if (!item) return null
    return {
      ...item,
      label: t(`categorySections.${item.section}.label`),
      description: t(`categorySections.${item.section}.description`),
    }
  }

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'trigger' | 'omikujiSet' | null

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()
  const { hasAsset } = useGetAssetData()

  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

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

  // 該当する assets.mikuji[omikujiKey] がある場合のみ true
  const hasMikujiBox = computed(() => {
    const key = selectedItem.value?.omikujiKey
    return !!key && hasAsset('mikuji', key)
  })
</script>
