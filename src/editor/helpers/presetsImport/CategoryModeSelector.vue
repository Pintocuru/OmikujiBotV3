<!-- src/editor/helpers/presetsImport/CategoryModeSelector.vue -->
<template>
  <div class="flex items-center gap-4">
    <span class="text-sm">{{ t('presetImport.modeLabel') }}</span>
    <div class="flex gap-2">
      <label class="flex items-center gap-1">
        <input
          type="radio"
          :name="`mode-${category}`"
          value="partial-merge"
          :checked="config.mode === 'partial-merge'"
          @change="() => handleModeChange('partial-merge')"
          class="radio radio-sm"
        />
        <span class="text-sm">{{ t('presetImport.merge') }}</span>
      </label>
      <label class="flex items-center gap-1">
        <input
          type="radio"
          :name="`mode-${category}`"
          value="partial-replace"
          :checked="config.mode === 'partial-replace'"
          @change="() => handleModeChange('partial-replace')"
          class="radio radio-sm"
        />
        <span class="text-sm">{{ t('presetImport.replace') }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { DataCategoryType } from '@/types/OmikujiData/'
  import { useImportManager } from './composables/useImportManager'
  import { ImportMode } from '@/editor/types'

  const { t } = useI18n()

  const props = defineProps<{
    category: DataCategoryType
    config: {
      mode: ImportMode
    }
    importManager: ReturnType<typeof useImportManager>
  }>()

  const handleModeChange = (mode: ImportMode) => {
    props.importManager.updateCategoryConfig(props.category, { mode })
  }
</script>
