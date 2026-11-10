<!-- src/editor/sidebar/SidebarDrawer.vue -->
<!-- 通常はドロワー、広い画面では常時表示するサイドバー -->
<template>
  <!-- 左端のホバー領域 -->
  <div class="absolute inset-y-0 left-0 w-3 z-20 xl:hidden" @mouseenter="open" />

  <!-- 開いている間、外側のクリックで閉じる -->
  <div v-if="isOpen" class="absolute inset-0 z-20 xl:hidden" @click="close" />

  <aside
    class="absolute inset-y-0 left-0 z-30 w-64 overflow-y-auto overflow-x-hidden bg-base-100 border-primary border-r-2 shadow-xl transition-transform duration-200 xl:translate-x-0 xl:pointer-events-auto"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'"
    @mouseenter="cancelClose"
    @mouseleave="closeLater"
  >
    <div class="flex flex-col min-h-full py-2">
      <!-- データ系カテゴリ（Events / Assets） -->
      <DataCategories />

      <!-- 設定系カテゴリ（ui / jsonMerge / dataPacks / appInfo） -->
      <SettingsCategories />
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted } from 'vue'
  import DataCategories from './categories/DataCategories.vue'
  import SettingsCategories from './categories/SettingsCategories.vue'
  import { useSidebarDrawer } from './composables/useSidebarDrawer'

  const { isOpen, open, close } = useSidebarDrawer()

  // マウスが少し外れただけで閉じないよう、遅らせて閉じる
  const CLOSE_DELAY_MS = 250
  let timer: number | undefined

  const cancelClose = () => clearTimeout(timer)

  const closeLater = () => {
    clearTimeout(timer)

    // 広い画面では常時表示するため閉じない
    if (window.matchMedia('(min-width: 1280px)').matches) return

    timer = window.setTimeout(close, CLOSE_DELAY_MS)
  }

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    clearTimeout(timer)
  })
</script>
