<!-- src/editor/content/header/ItemEditDialog.vue -->
<!-- 選択中アイテムの基本設定(名前・説明・タグ・有効/無効・Key)を編集するダイアログ。入力は即時に反映される -->
<template>
  <BaseDialog
    :open="open"
    icon="SlidersHorizontal"
    :title="t('categorySections.baseSettings.label')"
    size="3xl"
    @update:open="emit('update:open', $event)"
  >
    <div v-if="selectedItem" class="space-y-2">
      <!-- 基本設定の編集 -->
      <BaseEditor v-model="selectedItem" :category="dataCategory" :isIsEnabled="isEnabledEditable" />

      <!-- TODO:キャラクターは、色・コメント表現も編集が必要だが、別途ボタンを設けたい。 -->
      <template v-if="character && selectedItemKey">
        <SubSectionHeader
          class="mt-6"
          icon="Palette"
          :title="t('categorySections.colorSettings.label')"
          :description="t('categorySections.colorSettings.description')"
        />
        <CharacterColorSettings
          :botName="character.displayName"
          :modelValue="character.color"
          @update:modelValue="(value) => updateAssetProperty('characters', selectedItemKey!, 'color', value)"
        />

        <SubSectionHeader
          class="mt-6"
          icon="MessageSquare"
          :title="t('categorySections.commentVoice.label')"
          :description="t('categorySections.commentVoice.description')"
        />
        <CommentVoiceSettings
          :modelValue="character.displayOption"
          :backgroundColor="character.color.background"
          :onUpdate="(value) => updateAssetProperty('characters', selectedItemKey!, 'displayOption', value)"
        />
      </template>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import type { DataCategoryType } from '@/types/OmikujiData'
  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import CharacterColorSettings from '@/editor/assets/characters/color/CharacterColorSettings.vue'
  import CommentVoiceSettings from '@/editor/assets/characters/service/CommentVoiceSettings.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useSelectedItem } from '../composables/useSelectedItem'

  defineProps<{ open: boolean }>()
  const emit = defineEmits<{ 'update:open': [open: boolean] }>()

  const { t } = useI18n()
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getAsset, isAssetCategory } = useGetAssetData()
  const { updateAssetProperty } = useOmikujiStore()
  const { selectedItem } = useSelectedItem()

  // このダイアログはデータカテゴリ(Events / Assets)でだけ開く
  const dataCategory = computed(() => selectedCategory.value as DataCategoryType)

  // 有効/無効の切り替えを持つのはイベントだけ(アセットは常に有効)
  const isEnabledEditable = computed(() => !isAssetCategory(selectedCategory.value))

  const character = computed(() =>
    selectedCategory.value === 'characters' && selectedItemKey.value
      ? (getAsset('characters', selectedItemKey.value) ?? null)
      : null
  )
</script>
