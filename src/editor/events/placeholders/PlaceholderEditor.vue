<!-- src/editor/events/placeholders/PlaceholderEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <template v-if="selectedItem">
    <!-- 基本設定 -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="placeholders" :isIsEnabled="false" :isAccessLevel="false" />
    </SectionCard>

    <!-- プレースホルダー設定 -->
    <SectionCard
      id="section-placeholder"
      :icon="s('placeholder')?.icon"
      :isOpen="activeSection === 'placeholder'"
      @toggle="toggleSection('placeholder')"
      :title="s('placeholder')?.label"
      :description="s('placeholder')?.description"
    >
      <PlaceholderValuesEditor :key="selectedItem.id" :placeholderKey="selectedItem.key" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import BaseSettingsEditor from '@/editor/components/common/BaseSettingsEditor.vue'
  import RecordTabs from '@/editor/components/RecordTabs/RecordTabs.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetRecordData } from '@/editor/stores/useGetRecordData'
  import { staticSectionMap } from '../appItems/navigation/StaticSectionMap'

  const s = (key: string) => staticSectionMap.placeholders.find((i) => i.section === key)

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'placeholder' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // 選択されたアイテムの取得（読み取り専用）
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('placeholders', selectedItemKey.value)
    },
    set: (value) => {
      if (!selectedItemKey.value || !value) return
      updateItem('placeholders', selectedItemKey.value, value)
    },
  })
</script>
