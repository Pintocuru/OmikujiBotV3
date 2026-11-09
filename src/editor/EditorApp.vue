<!-- src/editor/EditorApp.vue -->
<template>
  <div class="relative h-full min-h-0 min-w-0 overflow-hidden">
    <!-- サイドバー -->
    <SidebarDrawer />

    <!-- メインコンテンツ -->
    <div class="h-full overflow-y-auto p-4 pb-16">
      <!-- デブワールド(NoData) -->
      <AppDevWorld v-if="isDevWorld" />
      <!-- トップページ -->
      <TopPage v-else-if="isTopPage" />
      <!-- 各種コンテンツエリア -->
      <ContentArea v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { isDev } from '@/common/AppEnv'
  import { OmikujiDataType } from '@/types/OmikujiData'

  import AppDevWorld from './shell/AppDevWorld.vue'
  import TopPage from './content/TopPage.vue'
  import ContentArea from './content/ContentArea.vue'
  import SidebarDrawer from './sidebar/SidebarDrawer.vue'
  import { useOmikujiStore } from './stores/useOmikujiStore'
  import { useNavigationStore } from './stores/useNavigationStore'
  import i18n from './i18n'

  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import { generatorApi } from '@/manager/services/generatorApi'

  // stores
  const omikujiStore = useOmikujiStore()
  const managerStore = useManagerStore()
  const { data, dataSource } = storeToRefs(omikujiStore)
  const { isServerConnected } = storeToRefs(managerStore)
  const { isTopPage } = storeToRefs(useNavigationStore())

  // テーマと、データ未読込(開発版の起動直後)かどうかの判定
  const isDevWorld = computed(() => isDev && dataSource.value === 'unknown')

  // 言語設定を vue-i18n に反映(データ読み込み時・設定変更時)
  watch(
    () => data.value.settings.editor.locale,
    (locale) => {
      i18n.global.locale.value = locale
    },
    { immediate: true }
  )

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
    const result = omikujiStore.openLocalOmikujiData()
    if (result === 'rejected') return // 読み込み拒否(エラー表示済み)
    if (result === 'empty') {
      // サーバーにも omikujiData.js にもデータがなかった: 読み込んだと偽らず、初期データで開始したことを伝える
      swalToast.info({
        title: 'データがありません',
        text: 'omikujiData.js が見つからないため、初期データで開始しました。',
      })
      return
    }
    swalToast.success({
      title: '読み込み完了',
      text: 'omikujiData.js を読み込みました。',
    })
  })
</script>
