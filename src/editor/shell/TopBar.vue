<!-- src/editor/shell/TopBar.vue -->
<!-- 常設の上部バー: タイトル・ファイル名・保存・切り替え類をまとめる。色は DaisyUI のテーマに従う(開発時のファイル区別用) -->
<template>
  <header class="flex items-center justify-between p-2 bg-primary text-primary-content shadow-md z-40">
    <!-- 左側 -->
    <div class="flex items-center gap-2 min-w-0">
      <!-- サイドバー開閉 -->
      <div v-if="!showGenerator" class="tooltip tooltip-bottom" :data-tip="t('shell.topBar.sidebar')">
        <button
          class="btn btn-sm btn-square btn-ghost text-primary-content hover:bg-primary-content/15"
          :aria-label="t('shell.topBar.sidebar')"
          @click="toggleSidebar"
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>

      <!-- タイトル -->
      <div>
        <button
          type="button"
          class="font-extrabold text-lg whitespace-nowrap hover:opacity-80 cursor-pointer"
          @click="navigationStore.showTopPage()"
        >
          {{ t('appHeader.title') }}
        </button>

        <!-- バージョン -->
        <div class="-mt-3 -mb-2 text-right">
          <button
            class="shrink-0 badge badge-xs border-0"
            :class="versionInfo.hasNewVersion ? 'badge-warning' : ''"
            :title="versionInfo.hasNewVersion ? t('shell.topBar.versionNew') : t('shell.topBar.versionInfo')"
            @click="showUpdateDialog"
          >
            {{ versionInfo.current }}
          </button>

          <span
            v-if="versionInfo.error"
            class="badge badge-sm badge-error border-0 shrink-0"
            :title="versionInfo.error"
          >
            !
          </span>
        </div>
      </div>

      <!-- ファイル情報 -->
      <div class="flex items-center gap-2 min-w-0">
        <span v-if="fileLabel" class="badge badge-sm truncate" :title="fileLabel">
          {{ fileLabel }}
        </span>

        <IssuesBadge />
      </div>
    </div>

    <!-- 右側 -->
    <div class="flex items-center gap-2 shrink-0">
      <!-- 開く・保存 -->
      <template v-if="!showGenerator">
        <ManagerView />
        <SaveMenu />
      </template>

      <!-- Generator -->
      <div class="tooltip tooltip-bottom" :data-tip="generatorTitle">
        <button
          class="btn btn-sm gap-2 shadow"
          :class="{ 'btn-warning': !canUseGenerator }"
          :disabled="generatorState === 'checking' && !showGenerator"
          @click="onSwitch"
        >
          <component :is="showGenerator ? Settings : Cpu" class="w-4 h-4" />
          {{ generatorLabel }}
        </button>
      </div>

      <!-- テーマ変更 -->
      <div class="tooltip tooltip-bottom" :data-tip="themeTitle">
        <button class="btn btn-sm btn-square shadow" :aria-label="themeTitle" @click="toggleDaisyUiTheme">
          <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { Cpu, Menu, Moon, Settings, Sun } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import ManagerView from '@/manager/ManagerView.vue'
  import { useSidebarDrawer } from '@/editor/sidebar/composables/useSidebarDrawer'
  import IssuesBadge from './IssuesBadge.vue'
  import SaveMenu from './SaveMenu.vue'
  import { useVersionCheck } from './useVersionCheck'
  import type { GeneratorState } from './shellTypes'

  const props = defineProps<{ showGenerator: boolean; generatorState: GeneratorState }>()
  const emit = defineEmits<{ 'update:showGenerator': [value: boolean]; recheck: [] }>()

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const navigationStore = useNavigationStore()
  const { data, dataSource } = storeToRefs(omikujiStore)
  const { toggleDaisyUiTheme } = omikujiStore
  const { saveFileName } = storeToRefs(useManagerStore())
  const { toggle: toggleSidebar } = useSidebarDrawer()

  // データソース・ファイル名
  const fileLabel = computed(() => {
    if (dataSource.value === 'unknown') return ''
    return saveFileName.value ? saveFileName.value.replace('.json', '') : data.value.meta.name
  })

  // バージョン
  const currentVersion = computed(() => data.value.meta.generatorVersion)
  const { versionInfo, checkVersion, showUpdateDialog } = useVersionCheck(currentVersion)
  void checkVersion()

  // テーマ
  const isDark = computed(() => data.value.settings.developer.daisyUiTheme === 'dark')
  const themeTitle = computed(() => (isDark.value ? t('shell.topBar.themeLight') : t('shell.topBar.themeDark')))

  // ジェネレーターを開けるのは、わんコメに接続できているとき(エディターに戻るのは常に可能)
  const canUseGenerator = computed(() => props.showGenerator || props.generatorState === 'ready')

  const generatorLabel = computed(() => {
    if (props.showGenerator) return t('shell.topBar.generator.editor')
    if (props.generatorState === 'checking') return t('shell.topBar.generator.checking')
    // ジェネレーター使用不可
    if (props.generatorState === 'unavailable') return t('shell.topBar.generator.unavailable')
    return t('shell.topBar.generator.label')
  })

  const generatorTitle = computed(() => {
    if (props.showGenerator) return t('shell.topBar.generator.return')
    if (props.generatorState === 'unavailable') return t('shell.topBar.generator.unavailableTip')
    return t('shell.topBar.generator.showTip')
  })

  function onSwitch() {
    if (!canUseGenerator.value) {
      if (props.generatorState === 'unavailable') emit('recheck')
      return
    }
    emit('update:showGenerator', !props.showGenerator)
  }
</script>
