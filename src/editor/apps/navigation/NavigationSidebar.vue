<!-- src/editor/apps/navigation/NavigationSidebar.vue -->
<template>
  <div
    class="sticky top-0 h-screen flex flex-col border-primary border-r-2 overflow-y-auto transition-all duration-200 shrink-0 overflow-x-hidden"
    :style="{ width: isExpanded ? '220px' : '72px' }"
  >
    <!-- 折りたたみトグル -->
    <button class="btn btn-ghost btn-sm mx-auto mt-3 mb-1 shrink-0" @click="isExpanded = !isExpanded">
      <PanelLeftClose v-if="isExpanded" class="w-5 h-5" />
      <PanelLeftOpen v-else class="w-5 h-5" />
    </button>

    <!-- プリセット管理ボタン -->
    <button
      v-if="isDev || isServerConnected"
      class="btn btn-ghost w-full flex items-center gap-2 min-h-0 h-auto py-2 mx-2"
      :class="isExpanded ? 'justify-start px-3' : 'justify-center px-0'"
      :title="t('navigation.presetManager')"
      @click="openPresetManager"
    >
      <FolderCog class="w-5 h-5 shrink-0" />
      <span v-if="isExpanded" class="text-sm truncate text-left flex-1">{{ t('navigation.presetManager') }}</span>
    </button>

    <!-- データ系カテゴリ（Events / Assets） -->
    <NavigationSidebarDataCategories :isExpanded="isExpanded" />

    <!-- 設定系カテゴリ（ui / jsonMerge / appInfo） -->
    <NavigationSidebarSettingsCategories :isExpanded="isExpanded" />

    <!-- 開発者向けフッター -->
    <NavigationSidebarFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { isDev } from '@/types/env'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useDevStore } from '@/PresetManager/stores/useDevStore'
  import NavigationSidebarDataCategories from './NavigationSidebarDataCategories.vue'
  import NavigationSidebarSettingsCategories from './NavigationSidebarSettingsCategories.vue'
  import { provideSidebarContext } from './composables/useSidebarContext'
  import NavigationSidebarFooter from './NavigationSidebarFooter.vue'
  import { PanelLeftClose, PanelLeftOpen, FolderCog } from 'lucide-vue-next'

  const { t } = useI18n()

  // Context（selectedItemKey / activeSection を子孫全体に注入）
  provideSidebarContext()

  // ストア
  const navigationStore = useNavigationStore()
  const { activeSection } = storeToRefs(navigationStore)

  const devStore = useDevStore()
  const { isServerConnected } = storeToRefs(devStore)

  // 展開状態
  const isExpanded = ref(true)

  // プリセットマネージャー
  const openPresetManager = () => {
    activeSection.value = 'presetManager'
  }
</script>
