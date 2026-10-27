<!-- src/editor/EditorApp.vue -->
<template>
  <div class="flex min-h-screen">
    <!-- サイドバー -->
    <NavigationSidebar />

    <!-- メインコンテンツ -->
    <div class="flex-1 min-w-0 p-4 pb-32 overflow-x-hidden space-y-4">
      <!-- ヘッダー -->
      <AppHeader />

      <!-- おみくじデータ管理 -->
      <ManagerView v-if="isServerConnected" />

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
  import { onMounted, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { isDev } from '@/types/env'
  import { OmikujiDataType } from '@/types/OmikujiData'

  import AppHeader from './apps/appItems/AppHeader.vue'
  import AppDevWorld from './apps/appItems/AppDevWorld.vue'
  import NavigationSidebar from './apps/navigation/NavigationSidebar.vue'
  import ContentArea from './apps/appItems/ContentArea.vue'
  import ConfigExport from './helpers/presetsExport/ConfigExport.vue'
  import { useScrollToSection } from './helpers/useScrollToSection'
  import { useOmikujiStore } from './stores/useOmikujiStore'
  import i18n from './i18n'

  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import ManagerView from '@/manager/ManagerView.vue'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { generatorApi } from '@/manager/services/generatorApi'

  // stores
  const omikujiStore = useOmikujiStore()
  const devStore = useManagerStore()
  const { data, dataSource } = storeToRefs(omikujiStore)
  const { isServerConnected } = storeToRefs(devStore)
  const navigationStore = useNavigationStore()

  // テーマと、データ未読込(開発版の起動直後)かどうかの判定
  const isDevWorld = computed(() => dataSource.value === 'unknown')

  // 言語設定を vue-i18n に反映(データ読み込み時・設定変更時)
  watch(
    () => data.value.settings.editor.locale,
    (locale) => {
      i18n.global.locale.value = locale
    },
    { immediate: true }
  )

  // スクロール監視
  useScrollToSection()

  onMounted(async () => {
    let isHealth = false

    try {
      isHealth = await generatorApi.getHealth()
    } catch (e) {
      console.warn('Health check failed:', e)
    }

    if (isHealth) {
      isServerConnected.value = true
      if (isDev) return // devならデータを読まない
      try {
        const lowData = (await generatorApi.loadGeneratorConfig()) as OmikujiDataType
        if (lowData) {
          if (!omikujiStore.loadData(lowData)) return // 読み込み拒否(エラー表示済み)
          navigationStore.selectCategory(data.value.settings.editor.initialCategory)
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
    if (!omikujiStore.openLocalOmikujiData()) return // 読み込み拒否(エラー表示済み)
    navigationStore.selectCategory(data.value.settings.editor.initialCategory)
    swalToast.success({
      title: '読み込み完了',
      text: 'omikujiData.js を読み込みました。',
    })
  })
</script>
