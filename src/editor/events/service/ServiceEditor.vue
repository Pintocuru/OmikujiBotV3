<!-- src/editor/events/eventsService/ServiceEditor.vue -->
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
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="services" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-trigger"
        :icon="s('trigger')?.icon"
        :isOpen="activeSection === 'trigger'"
        @toggle="toggleSection('trigger')"
        :title="s('trigger')?.label"
        :description="s('trigger')?.description"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ設定セクション -->
      <SectionCard
        id="section-omikujiSet"
        :icon="s('omikujiSet')?.icon"
        :isOpen="activeSection === 'omikujiSet'"
        @toggle="toggleSection('omikujiSet')"
        :title="s('omikujiSet')?.label"
        :description="s('omikujiSet')?.description"
      >
        <OmikujiSetEditor category="services" :selectedItemKey="selectedItemKey" />
      </SectionCard>
    </template>

    <!-- 無効のときのメッセージ -->
    <InformationCard v-else variant="error" class="mt-4 p-4">
      {{ t('commentEditor.disabledNotice.title') }}<br />
      {{ t('commentEditor.disabledNotice.action') }}
    </InformationCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ServiceEventType } from '@/types/OmikujiData/'
  import CommentTriggerEditor from './ServiceTrigger.vue'
  import GlobalCharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import OmikujiSetEditor from '@/editor/helpers/OmikujiSetEditor/OmikujiSetEditor.vue'

  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import InformationCard from '@/editor/parts/InformationCard/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap.js'
  import { useGetEventData } from '@/editor/stores/useGetEventData.js'

  const { t } = useI18n()

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.services.find((i) => i.section === key)
    if (!item) return null
    return {
      ...item,
      label: t(`sections.${item.section}.label`),
      description: t(`sections.${item.section}.description`),
    }
  }

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'trigger' | 'omikujiSet' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getEvent('services', selectedItemKey.value)
    },
    set: (value: ServiceEventType) => {
      updateEvent('services', value.key, value)
    },
  })
</script>
