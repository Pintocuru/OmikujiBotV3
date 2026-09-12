<!-- src/editor/events/eventsComment/CommentEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <!-- 全体キャラ変更 -->
    <GlobalCharacterChanger category="comments" />
    <IconKeyChanger category="comments" />
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
      <BaseSettingsEditor v-model="selectedItem" category="comments" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-threshold"
        :icon="s('threshold')?.icon"
        :isOpen="activeSection === 'threshold'"
        @toggle="toggleSection('threshold')"
        :title="s('threshold')?.label"
        :description="s('threshold')?.description"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- みくじ箱選択セクション -->
      <!-- TODO:新規作成 -->

      <!-- おみくじ設定セクション -->
      <!-- TODO:みくじ箱を選択したときに表示する -->
      <SectionCard
        id="section-omikujiSet"
        :icon="s('omikujiSet')?.icon"
        :isOpen="activeSection === 'omikujiSet'"
        @toggle="toggleSection('omikujiSet')"
        :title="s('omikujiSet')?.label"
        :description="s('omikujiSet')?.description"
      >
        <OmikujiSetEditor category="comments" :selectedItemKey="selectedItemKey" />
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
  import { CommentEventType } from '@/types/OmikujiData/'
  import CommentTriggerEditor from './CommentTriggerEditor.vue'
  import BaseSettingsEditor from '@/editor/common/BaseSettings/BaseSettingsEditor.vue'
  import OmikujiSetEditor from '@/editor/helpers/OmikujiSetEditor/OmikujiSetEditor.vue'
  import GlobalCharacterChanger from '@/editor/helpers/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@/editor/helpers/IconKeyChanger/IconKeyChanger.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import InformationCard from '@/editor/parts/InformationCard/InformationCard.vue'
  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { staticSectionMap } from '@/editor/maps/category/StaticSectionMap'
  import { useGetEventData } from '@/editor/stores/useGetEventData.js'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'threshold' | 'limits' | 'scriptGame' | 'omikujiSet' | null
  const navigationStore = useNavigationStore()
  const { activeSection, selectedItemKey } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // sectionMeta のショートハンド
  const s = (key: string) => staticSectionMap.comments.find((i) => i.section === key)

  // Pinia store
  const { updateEvent } = useOmikujiStore()
  const { getEvent } = useGetEventData()

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getEvent('comments', selectedItemKey.value)
    },
    set: (value: CommentEventType) => {
      updateEvent('comments', value.key, value)
    },
  })
</script>
