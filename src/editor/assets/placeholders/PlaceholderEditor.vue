<!-- src/editor/assets/placeholders/PlaceholderEditor.vue -->
<template>
  <template v-if="selectedItem">
    <!-- 基本設定 -->
    <SectionCard
      id="section-baseSettings"
      icon="SlidersHorizontal"
      label-key="categorySections.baseSettings.label"
      description-key="categorySections.baseSettings.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="placeholders" :isIsEnabled="false" />
    </SectionCard>

    <!-- プレースホルダー設定 -->
    <SectionCard
      id="section-placeholder"
      icon="Brackets"
      label-key="categorySections.placeholder.label"
      description-key="categorySections.placeholder.description"
    >
      <PlaceholderValuesEditor v-model="selectedItem" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'

  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'

  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import SectionCard from '@/editor/parts/SectionCard.vue'

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // Pinia store
  const { getAsset } = useGetAssetData()
  const { updateAsset } = useOmikujiStore()

  // 選択されたアイテムを取得
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
