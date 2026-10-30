<!-- src/editor/assets/scenarios/ScenariosEditor.vue -->
<template>
  <div class="flex justify-end gap-2">
    <CharacterChanger category="scenarios" />
    <IconKeyChanger category="scenarios" />
  </div>

  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :label="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="scenarios" :isIsEnabled="false" />
    </SectionCard>

    <!-- おみくじ設定セクション -->
    <SectionCard
      id="section-omikujiSet"
      :icon="s('omikujiSet')?.icon"
      :label="s('omikujiSet')?.label"
      :description="s('omikujiSet')?.description"
    >
      <ScenarioStepsEditor v-model="steps" :current-key="selectedItemKey ?? undefined" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'

  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import ScenarioStepsEditor from '@/editor/assets/ScenarioStep/ScenarioStepsEditor.vue'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'

  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { ScenarioType } from '@/types/OmikujiData'

  const { t } = useI18n()

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.scenarios.find((i) => i.section === key)
    if (!item) return null
    return {
      ...item,
      label: t(`categorySections.${item.section}.label`),
      description: t(`categorySections.${item.section}.description`),
    }
  }

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  // Pinia store
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  // v-modelを使用したselectedCharacterの実装
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
