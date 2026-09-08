<!-- src/editor/events/actionSets/ActionSetsEditor.vue -->
<template>
  <div class="flex justify-end gap-2">
    <CharacterChanger category="actionSets" />
    <IconKeyChanger category="actionSets" />
  </div>
  <!-- タブ部分 -->
  <RecordTabs />

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
      <BaseSettingsEditor v-model="selectedItem" category="actionSets" :isIsEnabled="false" :isAccessLevel="false" />
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
        category="actionSets"
        :selectedItemKey="selectedItemKey"
      />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ActionSetType } from '@/types'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import BaseSettingsEditor from '@/editor/components/common/BaseSettingsEditor.vue'
  import PostActionsEditor from '@/editor/components/postAction/PostActionsEditor.vue'
  import CharacterChanger from '@/editor/components/events/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/components/events/IconKeyChanger/IconKeyChanger.vue'
  import RecordTabs from '@/editor/components/RecordTabs/RecordTabs.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetRecordData } from '@/editor/stores/useGetRecordData'
  import { staticSectionMap } from '../appItems/navigation/StaticSectionMap'

  const s = (key: string) => staticSectionMap.actionSets.find((i) => i.section === key)

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'omikujiSet' | null
  const navigationStore = useNavigationStore()
  const { activeSection, selectedItemKey } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('actionSets', selectedItemKey.value)
    },
    set: (value: ActionSetType) => {
      updateItem('actionSets', value.key, value)
    },
  })

  const postActions = computed({
    get: () => selectedItem.value?.postActions || [],
    set: (newActions) => {
      if (!selectedItem.value) return
      updateItem('actionSets', selectedItem.value.key, {
        postActions: [...newActions],
      })
    },
  })
</script>
