<!-- src/editor/apps/appItems/AppHeader.vue -->
<template>
  <h1 class="flex justify-center text-2xl text-primary font-bold text-center relative">
    <!-- タイトル -->
    <div class="flex items-center gap-2">{{ t('appHeader.title') }}</div>

    <!-- 左上: データソースとバージョン（2行） -->
    <div class="absolute top-0 left-0 flex flex-col items-start gap-1 text-xs font-normal">
      <div class="flex items-center gap-2">
        <span class="badge text-xs" :class="dataSourceClass">
          {{ dataSourceLabel }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="opacity-70">{{ versionInfo.current }}</span>
        <span v-if="versionInfo.error" class="text-error" :title="versionInfo.error">!</span>
        <span
          v-else-if="versionInfo.hasNewVersion"
          class="text-warning cursor-pointer"
          :title="`新版 ${versionInfo.latest}`"
          @click="showUpdateDialog"
        >
          → {{ versionInfo.latest }}
        </span>
      </div>
    </div>
  </h1>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { onMounted, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useVersionCheck } from './useVersionCheck'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { DATA_SOURCE_MAP } from '@/editor/maps/DataSourceMap'

  // Pinia storeから現在のバージョンを取得
  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data, dataSource } = storeToRefs(omikujiStore)

  const currentVersion = computed(() => data.value.meta.generatorVersion)

  // バージョンチェック機能
  const { versionInfo, checkVersion, showUpdateDialog } = useVersionCheck(currentVersion)

  const dataSourceLabel = computed(() => {
    return DATA_SOURCE_MAP[dataSource.value].label
  })

  const dataSourceClass = computed(() => {
    return DATA_SOURCE_MAP[dataSource.value].class
  })

  // マウント時にバージョンチェック実行
  onMounted(() => checkVersion())
</script>
