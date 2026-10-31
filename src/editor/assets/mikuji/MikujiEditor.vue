<!-- src/editor/assets/mikuji/MikujiEditor.vue -->
<template>
  <div class="flex justify-end gap-2">
    <CharacterChanger category="mikuji" />
    <IconKeyChanger category="mikuji" />
  </div>

  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      sectionKey="baseSettings"
      icon="SlidersHorizontal"
      label-key="categorySections.baseSettings.label"
      description-key="categorySections.baseSettings.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="mikuji" :isIsEnabled="false" />
    </SectionCard>

    <!-- おみくじ設定 / シナリオ設定セット -->
    <OmikujiSections :omikujiKey="selectedItem.key" category="mikuji" />
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { MikujiBoxType } from '@/types/OmikujiData'

  import OmikujiSections from '@/editor/events/core/OmikujiSections.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'

  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // Pinia store
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  // 選択されたおみくじを取得
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getAsset('mikuji', selectedItemKey.value)
    },
    set: (value: MikujiBoxType) => {
      updateAsset('mikuji', value.key, value)
    },
  })
</script>
