<!-- src/editor/assets/characters/CharacterEditor.vue -->
<template>
  <!-- 選択されたキャラクターの編集フォーム -->
  <template v-if="selectedItemKey && selectedItem">
    <!-- 基本情報 -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <CharacterBasicInfo :selectedItemKey="selectedItemKey" />
    </SectionCard>

    <!-- フキダシカラー設定 -->
    <SectionCard
      id="section-colorSettings"
      :icon="s('colorSettings')?.icon"
      :isOpen="activeSection === 'colorSettings'"
      @toggle="toggleSection('colorSettings')"
      :title="s('colorSettings')?.label"
      :description="s('colorSettings')?.description"
    >
      <CharacterColorSettings :botName="selectedItem.displayName" :modelValue="selectedItem.color" />
    </SectionCard>

    <!-- BOTコメント表現設定 -->
    <SectionCard
      id="section-commentVoice"
      :icon="s('commentVoice')?.icon"
      :isOpen="activeSection === 'commentVoice'"
      @toggle="toggleSection('commentVoice')"
      :title="s('commentVoice')?.label"
      :description="s('commentVoice')?.description"
    >
      <CommentVoiceSettings
        :modelValue="selectedItem.displayOption"
        :backgroundColor="selectedItem.color.backgroundColor"
        :onUpdate="(value) => updateRecordProperty('characters', selectedItemKey!, 'displayOption', value)"
      />
    </SectionCard>

    <!-- ジェネレーター用画像設定 -->
    <SectionCard
      id="section-imageSettings"
      :icon="s('imageSettings')?.icon"
      :isOpen="activeSection === 'imageSettings'"
      @toggle="toggleSection('imageSettings')"
      :title="s('imageSettings')?.label"
      :description="s('imageSettings')?.description"
    >
      <CharacterImageSettings :modelValue="selectedItem.image" :selectedItemKey="selectedItemKey" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import CharacterBasicInfo from './basicInfo/CharacterBasicInfo.vue'
  import CharacterColorSettings from './color/CharacterColorSettings.vue'
  import CharacterImageSettings from './CharacterImage/CharacterImageSettings.vue'
  import CommentVoiceSettings from './service/CommentVoiceSettings.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import SectionCard from '@/editor/parts/SectionCard/SectionCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap'

  const { t } = useI18n()

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.characters.find((i) => i.section === key)
    if (!item) return null
    return {
      ...item,
      label: t(`sections.${item.section}.label`),
      description: t(`sections.${item.section}.description`),
    }
  }

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'colorSettings' | 'commentVoice' | 'serviceSettings' | 'imageSettings' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { getAsset } = useGetAssetData()
  const { updateRecordProperty } = useOmikujiStore()

  // 選択されたキャラクターを取得（読み取り専用）
  const selectedItem = computed(() => {
    if (!selectedItemKey.value) return null
    return getAsset('characters', selectedItemKey.value)
  })
</script>
