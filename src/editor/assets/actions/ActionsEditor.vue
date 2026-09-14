<!-- src/editor/assets/actions/ActionsEditor.vue -->
<template>
  <div class="flex justify-end gap-2">
    <CharacterChanger category="actions" />
    <IconKeyChanger category="actions" />
  </div>

  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="actions" :isIsEnabled="false" />
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
      <PostActionsEditor
        v-model="postActions"
        :gameScripts="selectedItem.gameScripts"
        category="actions"
        :selectedItemKey="selectedItemKey"
      />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ActionSetType } from '@/types'

  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import PostActionsEditor from '@/editor/assets/postAction/PostActionsEditor.vue'
  import CharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'

  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'

  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'

  const { t } = useI18n()

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.actions.find((i) => i.section === key)
    if (!item) return null
    return {
      ...item,
      label: t(`sections.${item.section}.label`),
      description: t(`sections.${item.section}.description`),
    }
  }

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'omikujiSet' | null
  const navigationStore = useNavigationStore()
  const { activeSection, selectedItemKey } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateAsset } = useOmikujiStore()
  const { getAsset } = useGetAssetData()

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getAsset('actions', selectedItemKey.value)
    },
    set: (value: ActionSetType) => {
      updateAsset('actions', value.key, value)
    },
  })

  const postActions = computed({
    get: () => selectedItem.value?.postActions || [],
    set: (newActions) => {
      if (!selectedItem.value) return
      updateAsset('actions', selectedItem.value.key, {
        postActions: [...newActions],
      })
    },
  })
</script>
