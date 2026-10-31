<!-- src/editor/assets/mikuji/MikujiEditor.vue -->
<template>
  <template v-if="selectedItem">
    <!-- おみくじ設定 -->
    <SectionCard
      icon="ListChecks"
      label-key="categorySections.omikujiSet.label"
      description-key="categorySections.omikujiSet.description"
    >
      <MikujiSettings :omikujiKey="selectedItem.key" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { MikujiBoxType } from '@/types/OmikujiData'

  import MikujiSettings from './MikujiSettings.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

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
