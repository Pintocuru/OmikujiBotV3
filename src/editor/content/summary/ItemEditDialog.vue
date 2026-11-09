<!-- src/editor/content/summary/ItemEditDialog.vue -->
<!-- 選択中アイテムの基本設定 -->
<template>
  <BaseDialog
    :open="open"
    icon="SlidersHorizontal"
    :title="t('categorySections.baseSettings.label')"
    size="3xl"
    @update:open="emit('update:open', $event)"
  >
    <div v-if="selectedRecord" class="space-y-2">
      <!-- 基本設定の編集 -->
      <BaseEditor v-model="selectedRecord" :category="dataCategory" :showEnabledToggle="isEnabledEditable" />
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import type { DataCategoryType } from '@/types/OmikujiData'
  import BaseEditor from '@/editor/apps/BaseSettings/BaseEditor.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import { useSelectedRecord } from '../composables/useSelectedRecord'

  defineProps<{ open: boolean }>()
  const emit = defineEmits<{ 'update:open': [open: boolean] }>()

  const { t } = useI18n()
  const { selectedCategory } = storeToRefs(useNavigationStore())
  const { isAssetCategory } = useGetAssetData()
  const { selectedRecord } = useSelectedRecord()

  // このダイアログはデータカテゴリ(Events / Assets)でだけ開く
  const dataCategory = computed(() => selectedCategory.value as DataCategoryType)

  // 有効/無効の切り替えを持つのはイベントだけ(アセットは常に有効)
  const isEnabledEditable = computed(() => !isAssetCategory(selectedCategory.value))
</script>
