<!-- src/editor/apps/navigation/NavigationSidebarFooter.vue -->
<template>
  <div class="sticky bottom-2 left-0 w-full flex flex-col items-center space-y-2">
    <!-- 開発者モード -->
    <template v-if="isDev">
      <template v-if="saveFileName">
        <button
          class="btn btn-xs btn-warning truncate"
          :class="!hasChanged ? 'btn-soft' : ''"
          :data-tip="t('navigation.saveFileTip')"
          :disabled="!hasChanged"
          @click="devStore.overwriteConfig(saveFileName)"
        >
          <Save class="w-4 h-4" />
          {{ t('navigation.saveFile', { name: saveFileName.replace('.json', '') }) }}
        </button>
      </template>
    </template>

    <!-- 通常モード -->
    <template v-else>
      <span v-if="hasChanged" class="indicator-item badge badge-secondary badge-sm">
        {{ t('navigation.hasChanged') }}
      </span>
      <button
        @click="exportFile('config')"
        class="btn btn-primary tooltip tooltip-top truncate"
        :class="!hasChanged ? 'btn-soft' : ''"
        :data-tip="t('navigation.exportConfigTip')"
        :disabled="isExporting"
      >
        <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
        {{ t('navigation.exportConfig') }}
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { isDev } from '@/types/env'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useConfigExport } from '@/editor/helpers/presetsExport/useConfigExport'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { Save } from 'lucide-vue-next'

  const { t } = useI18n()

  // store
  const omikujiStore = useOmikujiStore()
  const { hasChanged } = storeToRefs(omikujiStore)

  const devStore = useManagerStore()
  const { saveFileName } = storeToRefs(devStore)

  const { isExporting, exportFile } = useConfigExport()
</script>
