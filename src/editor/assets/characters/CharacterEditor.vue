<!-- src/editor/assets/characters/CharacterEditor.vue -->
<template>
  <!-- 選択されたキャラクターの編集フォーム -->
  <template v-if="selectedItemKey && selectedItem">
    <!-- 基本情報 -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :label="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="characters" :isIsEnabled="false" />
    </SectionCard>

    <!-- フキダシカラー設定 -->
    <SectionCard
      id="section-colorSettings"
      :icon="s('colorSettings')?.icon"
      :label="s('colorSettings')?.label"
      :description="s('colorSettings')?.description"
    >
      <CharacterColorSettings
        :botName="selectedItem.displayName"
        :modelValue="selectedItem.color"
        @update:modelValue="(value) => updateAssetProperty('characters', selectedItemKey!, 'color', value)"
      />
    </SectionCard>

    <!-- BOTコメント表現設定 -->
    <SectionCard
      id="section-commentVoice"
      :icon="s('commentVoice')?.icon"
      :label="s('commentVoice')?.label"
      :description="s('commentVoice')?.description"
    >
      <CommentVoiceSettings
        :modelValue="selectedItem.displayOption"
        :backgroundColor="selectedItem.color.background"
        :onUpdate="(value) => updateAssetProperty('characters', selectedItemKey!, 'displayOption', value)"
      />
    </SectionCard>

    <!-- ジェネレーター用画像設定 -->
    <SectionCard
      id="section-imageSettings"
      :icon="s('imageSettings')?.icon"
      :label="s('imageSettings')?.label"
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
  import BaseSettingsEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import CharacterColorSettings from './color/CharacterColorSettings.vue'
  import CharacterImageSettings from './CharacterImage/CharacterImageSettings.vue'
  import CommentVoiceSettings from './service/CommentVoiceSettings.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import SectionCard from '@/editor/parts/SectionCard.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { categorySectionMap } from '@/editor/maps/category/CategorySectionMap'

  const { t } = useI18n()

  // アイコン構造と i18n のテキストを結合して返すヘルパー
  const s = (key: string) => {
    const item = categorySectionMap.characters.find((i) => i.section === key)
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
  const { getAsset } = useGetAssetData()
  const { updateAsset, updateAssetProperty } = useOmikujiStore()

  // 選択されたキャラクターを取得
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getAsset('characters', selectedItemKey.value)
    },
    set: (value) => {
      if (!selectedItemKey.value || !value) return
      updateAsset('characters', selectedItemKey.value, value)
    },
  })
</script>
