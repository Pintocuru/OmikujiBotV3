<!-- src/editor/assets/scenarios/ScenariosEditor.vue -->
<template>
  <template v-if="selectedItem">
    <!-- おみくじ設定セクション -->
    <SectionCard
      icon="ListChecks"
      label-key="categorySections.omikujiSet.label"
      description-key="categorySections.omikujiSet.description"
    >
      <ScenarioStepsEditor v-model="steps" :current-key="selectedItemKey ?? undefined" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import ScenarioStepsEditor from '@/editor/assets/ScenarioStep/ScenarioStepsEditor.vue'

  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { ScenarioType } from '@/types/OmikujiData'

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // Pinia store
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  // 選択されたシナリオを取得
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getAsset('scenarios', selectedItemKey.value)
    },
    set: (value: ScenarioType) => {
      updateAsset('scenarios', value.key, value)
    },
  })

  const steps = computed({
    get: () => selectedItem.value?.steps || [],
    set: (newSteps) => {
      if (!selectedItem.value) return
      updateAsset('scenarios', selectedItem.value.key, {
        steps: [...newSteps],
      })
    },
  })
</script>
