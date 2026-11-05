<!-- src/editor/shell/TopBar.vue -->
<!-- 常設の上部バー: タイトル・ファイル名・保存・切り替え類をまとめる。色は DaisyUI のテーマに従う(開発時のファイル区別用) -->
<template>
  <header class="flex items-center gap-2 p-2 bg-primary text-primary-content shadow-md z-40">
    <!-- サイドバー開閉 -->
    <button
      v-if="!showGenerator"
      class="btn btn-sm btn-square btn-ghost text-primary-content hover:bg-primary-content/15"
      :title="t('shell.topBar.sidebar')"
      @click="toggleSidebar"
    >
      <Menu class="w-5 h-5" />
    </button>

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
        <span v-if="versionInfo.error" class="badge badge-sm badge-error border-0 shrink-0" :title="versionInfo.error">
          !
        </span>
      </div>
    </div>

    <!-- データソース・ファイル名・バージョン -->
    <div class="flex">
      <!-- ファイル名 -->
      <span v-if="fileLabel" class="badge badge-sm truncate" :title="fileLabel">{{ fileLabel }}</span>
      <IssuesBadge />
    </div>

    <!-- 右: 開く・保存・切り替え -->
    <div v-show="!showGenerator" class="ml-auto flex items-center gap-2 shrink-0">
      <button class="btn btn-sm btn-neutral" :title="t('shell.topBar.openTip')" @click="onOpen">
        <FolderOpen class="w-4 h-4" />
        {{ t('shell.topBar.open') }}
      </button>
      <SaveMenu />
    </div>

    <!-- ジェネレーターサンプル -->
    <button
      class="btn btn-sm shadow"
      :class="canUseGenerator ? 'btn-neutral' : 'btn-warning'"
      :disabled="generatorState === 'checking' && !showGenerator"
      :title="generatorTitle"
      @click="onSwitch"
    >
      <component :is="showGenerator ? Settings : Cpu" class="w-4 h-4" />
      {{ generatorLabel }}
    </button>

    <!-- DaisyUi テーマ変更ボタン -->
    <button class="btn btn-sm btn-square btn-neutral shadow" :title="themeTitle" @click="toggleDaisyUiTheme">
      <component :is="isDark ? Sun : Moon" class="w-4 h-4" />
    </button>

    <!-- ファイル選択ダイアログ(サーバー接続時) -->
    <ManagerView v-model:open="isFileDialogOpen" />
  </header>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { Cpu, FolderOpen, Menu, Moon, Settings, Sun } from 'lucide-vue-next'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useManagerStore } from '@/manager/stores/useManagerStore'
  import ManagerView from '@/manager/ManagerView.vue'
  import { useOpenLocal } from '@/manager/composables/useOpenLocal'
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
  const { isServerConnected, saveFileName } = storeToRefs(useManagerStore())
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

  // ファイルを開く: サーバーに接続していれば選択ダイアログ、していなければローカルの omikujiData.js を直接読む
  const isFileDialogOpen = ref(false)
  const { openLocal } = useOpenLocal()
  const onOpen = async () => {
    if (isServerConnected.value) {
      isFileDialogOpen.value = true
      return
    }
    // 読み込み成功後、useOpenLocal 側で TopPage に戻る
    await openLocal()
  }

  // ジェネレーターを開けるのは、わんコメに接続できているとき(エディターに戻るのは常に可能)
  const canUseGenerator = computed(() => props.showGenerator || props.generatorState === 'ready')

  const generatorLabel = computed(() => {
    if (props.showGenerator) return t('shell.topBar.generator.editor')
    if (props.generatorState === 'checking') return t('shell.topBar.generator.checking')
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
