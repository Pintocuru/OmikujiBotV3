<!-- src/editor/assets/characters/CharacterEditor.vue -->
<template>
  <!-- 選択されたキャラクターの編集フォーム -->
  <template v-if="selectedItemKey && selectedItem">
    <!-- 表示設定: フキダシの色(メイン)と、BOTコメント表現(サブ) -->
    <SectionCard
      icon="Palette"
      label-key="categorySections.characterStyle.label"
      description-key="categorySections.characterStyle.description"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 items-start gap-2">
        <!-- キャラクターカラー -->
        <CharacterColorCard
          :botName="selectedItem.displayName"
          :modelValue="selectedItem.color"
          @update:modelValue="(value) => updateAssetProperty('characters', selectedItemKey!, 'color', value)"
        />
        <!-- わんコメへの投稿方法 -->
        <CommentVoiceCard
          :modelValue="selectedItem.displayOption"
          :backgroundColor="selectedItem.color.background"
          @update:modelValue="(value) => updateAssetProperty('characters', selectedItemKey!, 'displayOption', value)"
        />
      </div>
    </SectionCard>

    <!-- ジェネレーター用画像設定 -->
    <SectionCard
      icon="Image"
      label-key="categorySections.imageSettings.label"
      description-key="categorySections.imageSettings.description"
    >
      <CharacterImageSettings :modelValue="selectedItem.image" :selectedItemKey="selectedItemKey" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import CharacterImageSettings from './CharacterImage/CharacterImageSettings.vue'
  import CharacterColorCard from './color/CharacterColorCard.vue'
  import CommentVoiceCard from './service/CommentVoiceCard.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SectionCard from '@/editor/parts/SectionCard.vue'

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
