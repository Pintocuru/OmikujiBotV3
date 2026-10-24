<!-- src/editor/apps/appItems/AppHeader.vue -->
<template>
  <h1 class="flex justify-center text-2xl text-primary font-bold text-center relative">
    <div class="flex items-center gap-2">{{ t('appHeader.title') }}</div>

    <!-- 左上: データソースとバージョン(右上は切り替えボタンが使う) -->
    <div class="absolute top-0 left-0 flex items-center gap-2 text-xs font-normal">
      <span class="badge text-xs" :class="dataSourceClass">
        {{ dataSourceLabel }}
      </span>
      <span class="opacity-70">{{ t('appHeader.currentVersion', { version: versionInfo.current }) }}</span>
      <span v-if="versionInfo.error" class="text-error" :title="versionInfo.error">!</span>
      <span v-else-if="versionInfo.hasNewVersion" class="text-warning cursor-pointer" @click="showUpdateDialog">
        {{ t('appHeader.newVersion', { version: versionInfo.latest }) }}
      </span>
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
