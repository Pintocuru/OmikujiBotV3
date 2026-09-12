<!-- src/editor/App.vue -->
<template>
  <div class="flex min-h-screen" :data-theme="daisyUiTheme">
    <!-- サイドバー -->
    <NavigationSidebar />

    <!-- メインコンテンツ -->
    <div class="flex-1 min-w-0 p-4 pb-32 overflow-x-hidden space-y-4">
      <!-- ヘッダー -->
      <AppHeader />

      <!-- プリセット管理 -->
      <PresetTool v-if="isServerConnected" />

      <!-- 設定書き出し -->
      <div class="flex justify-between">
        <ConfigExport />
      </div>

      <!-- 開発版の起動時に「開発者用プリセット管理」を目立たせるためのダミー -->
      <AppDevWorld v-if="isDevWorld" />

      <!-- コンテンツ -->
      <ContentArea />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev, OmikujiDataType } from '@/types'
  import AppHeader from './events/appItems/AppHeader.vue'
  import AppDevWorld from './events/appItems/AppDevWorld.vue'
  import NavigationSidebar from './events/appItems/navigation/NavigationSidebar.vue'
  import ContentArea from './events/appItems/ContentArea.vue'
  import ConfigExport from './helpers/presetsExport/ConfigExport.vue'
  import { useImportManager } from './helpers/presetsImport/composables/useImportManager'
  import { useOmikujiStore } from './stores/useOmikujiStore'
  import PresetTool from '@/PresetManager//DevConfigs.vue'
  import { useDevStore } from '../PresetManager/stores/useDevStore'
  import { generatorApi } from '../PresetManager/services/generatorApi'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast.js'
  import { useNavigationStore } from './stores/useNavigationStore'
  import { useScrollToSection } from './helpers/useScrollToSection'

  // stores
  const omikujiStore = useOmikujiStore()
  const devStore = useDevStore()
  const { data, dataSource } = storeToRefs(omikujiStore)
  const { isServerConnected } = storeToRefs(devStore)
  const navigationStore = useNavigationStore()

  // インポートマネージャー
  const importManager = useImportManager()
  const daisyUiTheme = computed(() => (isDev ? data.value.settings.developer.daisyUiTheme : 'dark'))
  const isDevWorld = computed(() => dataSource.value === 'unknown')

  // スクロール監視
  useScrollToSection()

  onMounted(async () => {
    let isHealth = false

    try {
      isHealth = await generatorApi.getHealth()
    } catch (e) {
      console.warn('Health check failed:', e)
    }

    const initialCategory = data.value.settings.editor.initialCategory
    if (isHealth) {
      isServerConnected.value = true
      if (isDev) return // devならデータを読まない
      try {
        const lowData = (await generatorApi.loadGeneratorConfig()) as OmikujiDataType
        if (lowData) {
          omikujiStore.loadData(lowData)
          navigationStore.selectCategory(initialCategory)
          swalToast.success({
            title: '読み込み完了',
            text: `${lowData.meta.name} を読み込みました`,
          })
          return
        }
      } catch (e) {
        console.warn('loadGeneratorConfig failed:', e)
      }
    }

    // ローカルを読む
    omikujiStore.openLocalOmikujiData()
    navigationStore.selectCategory(initialCategory)
    swalToast.success({
      title: '読み込み完了',
      text: 'omikujiData.js を読み込みました。',
    })
  })
</script>
