<!-- src/editor/apps/appItems/AppHeader.vue -->
<template>
  <h1 class="flex justify-center text-2xl text-primary font-bold text-center relative">
    <div class="flex items-center gap-2">{{ t('appHeader.title') }}</div>

    <!-- 左上データソース表示 -->
    <div class="absolute top-0 left-0">
      <span class="badge text-xs" :class="dataSourceClass">
        {{ dataSourceLabel }}
      </span>
    </div>

    <!-- 右上バージョン表示 -->
    <div class="absolute top-0 right-0 text-xs opacity-70 flex flex-col items-end">
      <div>{{ t('appHeader.currentVersion', { version: versionInfo.current }) }}</div>
      <div v-if="versionInfo.isLoading" class="text-info">{{ t('appHeader.checking') }}</div>
      <div v-else-if="versionInfo.error" class="text-error" :title="versionInfo.error">{{ t('appHeader.checkFailed') }}</div>
      <div v-else-if="versionInfo.hasNewVersion" class="text-warning cursor-pointer" @click="showUpdateDialog">
        {{ t('appHeader.newVersion', { version: versionInfo.latest }) }}
      </div>
      <div v-else-if="versionInfo.latest" class="text-success">{{ t('appHeader.latest') }}</div>
    </div>
  </h1>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { onMounted, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useVersionCheck } from './useVersionCheck'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { DATA_SOURCE_MAP } from '@/editor/types'

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
