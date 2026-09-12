<!-- src/editor/events/eventsTimer/TimerEditor.vue -->
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
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="timers" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled">
      <!-- タイマー設定セクション -->
      <SectionCard
        id="section-timerInterval"
        :icon="s('timerInterval')?.icon"
        :isOpen="activeSection === 'timerInterval'"
        @toggle="toggleSection('timerInterval')"
        :title="s('timerInterval')?.label"
        :description="s('timerInterval')?.description"
      >
        <TimerIntervalEditor v-model="selectedItem" />
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
        <OmikujiSetEditor category="timers" :selectedItemKey="selectedItemKey" />
      </SectionCard>
    </template>

    <!-- 無効のときのメッセージ -->
    <InformationCard v-else variant="error" class="mt-4 p-4">
      現在、このイベントは無効になっています。<br />
      編集を行うには、まずイベントを有効にしてください。
    </InformationCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { TimerEventType } from '@/types/OmikujiData/'
  import { staticSectionMap } from '@/editor/maps/category/StaticSectionMap'

  import TimerIntervalEditor from './TimerIntervalEditor.vue'

  import GlobalCharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import OmikujiSetEditor from '@/editor/helpers/OmikujiSetEditor/OmikujiSetEditor.vue'
  import BaseSettingsEditor from '@/editor/common/BaseSettings/BaseSettingsEditor.vue'
  import InformationCard from '@/editor/parts/InformationCard/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetEventData } from '@/editor/stores/useGetEventData.js'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'timerInterval' | 'omikujiSet' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  const s = (key: string) => staticSectionMap.timers.find((i) => i.section === key)

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getEvent('timers', selectedItemKey.value)
    },
    set: (value: TimerEventType) => {
      updateEvent('timers', value.key, value)
    },
  })
</script>
