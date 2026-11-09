<!-- src/editor/helpers/presetsImport/ConfigImportModal.vue -->
<template>
  <!-- 親が v-if で外す使い方のため、閉じるアニメーションは出ない(許容済み) -->
  <BaseDialog
    :open="importManager.showPreviewModal.value"
    :title="t('presetImport.previewTitle')"
    icon="Merge"
    size="3xl"
    @update:open="onUpdateOpen"
  >
    <div v-if="importManager.previewData.value" class="space-y-4">
      <p class="text-sm opacity-70">
        {{
          t(`presetImport.totalItems.${importManager.previewData.value.totalItems === 1 ? 'one' : 'other'}`, {
            count: importManager.previewData.value.totalItems,
          })
        }}
      </p>

      <!-- Record型カテゴリ別設定 -->
      <div class="space-y-2">
        <h3 class="font-semibold text-lg">{{ t('presetImport.dataCategories') }}</h3>
        <template v-for="(config, category) in importManager.previewData.value.recordCategories" :key="category">
          <CategoryConfigSection
            v-if="config.count > 0"
            :category="category"
            :config="config"
            :import-manager="importManager"
          />
        </template>
      </div>

      <!-- アイテム設定 -->
      <div v-if="Object.keys(mergedComponentConfigs).length > 0" class="space-y-2">
        <h3 class="font-semibold text-lg">{{ t('presetImport.itemSettings') }}</h3>
        <ComponentConfigSection
          v-for="(entry, component) in mergedComponentConfigs"
          :key="component"
          :componentKey="component as UiKind"
          :config="entry.config"
          :is-import-only="entry.isImportOnly"
          :import-manager="importManager"
        />
      </div>
    </div>

    <div v-else class="text-center py-8">
      <div class="text-gray-500">{{ t('presetImport.loadingPreview') }}</div>
    </div>

    <template #actions>
      <ModalFooterActions
        class="w-full"
        :on-cancel="importManager.closePreviewModal"
        :on-save="handleImportConfirm"
        :save-name="t('presetImport.import')"
        :disabled="!importManager.enabledCategories.value.length || !importManager.previewData.value"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useImportManager } from './composables/useImportManager'
  import CategoryConfigSection from './CategoryConfigSection.vue'
  import ComponentConfigSection from './ComponentConfigSection.vue'
  import ModalFooterActions from '@/editor/parts/ModalFooterActions.vue'
  import BaseDialog from '@/editor/parts/BaseDialog.vue'
  import { ComponentImportConfig } from '@/editor/types'
  import { UiKind } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    importManager: ReturnType<typeof useImportManager>
  }>()

  /**
   * componentConfigs（既存 + 読み込み側のみ）の表示用マップ
   * - 既存にあるキー: isImportOnly=false、ラジオで既存/読み込みを選択可能
   * - 読み込み側にのみあるキー: isImportOnly=true（generatePreview が enabled=true/useImported=true で登録済み）
   */
  const mergedComponentConfigs = computed(
    (): Record<string, { config: ComponentImportConfig; isImportOnly: boolean }> => {
      const preview = props.importManager.previewData.value
      if (!preview) return {}

      const importOnly = new Set<UiKind>(preview.importOnlyComponents)
      const result: Record<string, { config: ComponentImportConfig; isImportOnly: boolean }> = {}
      for (const [key, config] of Object.entries(preview.componentConfigs) as [UiKind, ComponentImportConfig][]) {
        result[key] = { config, isImportOnly: importOnly.has(key) }
      }
      return result
    }
  )

  // ×・Esc・バックドロップで閉じたときは、キャンセルと同じ扱い
  const onUpdateOpen = (open: boolean) => {
    if (!open) props.importManager.closePreviewModal()
  }

  const handleImportConfirm = () => {
    try {
      props.importManager.executeImport()
    } catch (error) {
      console.error('Import error:', error)
    }
  }
</script>
