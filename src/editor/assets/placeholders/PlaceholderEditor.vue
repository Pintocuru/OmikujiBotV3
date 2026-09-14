<!-- src/editor/assets/placeholders/PlaceholderEditor.vue -->
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
      <BaseSettingsEditor v-model="selectedItem" category="placeholders" :isIsEnabled="false" />
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
  import { useI18n } from 'vue-i18n'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'

  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap.js'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData.js'

  const { t } = useI18n()

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.placeholders.find((i) => i.section === key)
    if (!item) return null
    return {
      ...item,
      label: t(`sections.${item.section}.label`),
      description: t(`sections.${item.section}.description`),
    }
  }

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'placeholder' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  // 選択されたアイテムの取得（読み取り専用）
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getAsset('placeholders', selectedItemKey.value)
    },
    set: (value) => {
      if (!selectedItemKey.value || !value) return
      updateAsset('placeholders', selectedItemKey.value, value)
    },
  })
</script>
