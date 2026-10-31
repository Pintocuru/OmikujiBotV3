<!-- src/editor/shell/TopBar.vue -->
<!-- 常設の上部バー: タイトル・ファイル名・保存・切り替え類をまとめる。色は DaisyUI のテーマに従う(開発時のファイル区別用) -->
<template>
  <header class="shrink-0 flex items-center gap-3 px-3 py-2 bg-primary text-primary-content shadow-md z-40">
    <!-- 左: サイドバー開閉 + タイトル -->
    <button
      v-if="!showGenerator"
      class="btn btn-sm btn-square btn-ghost"
      :title="t('shell.topBar.sidebar')"
      @click="toggleSidebar"
    >
      <Menu class="w-5 h-5" />
    </button>
    <button type="button" class="font-bold text-lg whitespace-nowrap hover:opacity-80" @click="navigationStore.showTopPage()">{{ t('appHeader.title') }}</button>

    <!-- データソース・ファイル名・バージョン -->
    <div class="flex items-center gap-2 min-w-0 flex-1">
      <!-- バージョン -->
      <button
        class="text-xs shrink-0 cursor-pointer"
        :class="versionInfo.hasNewVersion ? 'text-warning' : 'opacity-80'"
        :title="versionInfo.hasNewVersion ? '新しいバージョンがあります' : 'バージョン情報'"
        @click="showUpdateDialog"
      >
        {{ versionInfo.current }}
      </button>
      <span v-if="versionInfo.error" class="text-error shrink-0" :title="versionInfo.error"> ! </span>

      <!-- ファイル名 -->
      <span v-if="fileLabel" class="badge badge-sm truncate" :title="fileLabel">{{ fileLabel }}</span>
      <IssuesBadge />
    </div>

    <!-- 右: 開く・保存・切り替え -->
    <div v-show="!showGenerator" class="flex items-center gap-2 shrink-0">
      <button class="btn btn-sm" :title="t('shell.topBar.openTip')" @click="onOpen">
        <FolderOpen class="w-4 h-4" />
        {{ t('shell.topBar.open') }}
      </button>
      <SaveMenu />
    </div>

    <button
      class="btn btn-sm shadow"
      :class="canUseGenerator ? 'btn-neutral' : 'btn-outline btn-warning bg-base-100'"
      :disabled="generatorState === 'checking' && !showGenerator"
      :title="generatorTitle"
      @click="onSwitch"
    >
      <component :is="showGenerator ? Settings : Cpu" class="w-4 h-4" />
      {{ generatorLabel }}
    </button>

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
  const themeTitle = computed(() => (isDark.value ? 'ライトモードに切り替え' : 'ダークモードに切り替え'))

  // ファイルを開く: サーバーに接続していれば選択ダイアログ、していなければローカルの omikujiData.js を直接読む
  const isFileDialogOpen = ref(false)
  const { openLocal } = useOpenLocal()
  const onOpen = () => {
    if (isServerConnected.value) {
      isFileDialogOpen.value = true
      return
    }
    void openLocal()
  }

  // ジェネレーターを開けるのは、わんコメに接続できているとき(エディターに戻るのは常に可能)
  const canUseGenerator = computed(() => props.showGenerator || props.generatorState === 'ready')

  const generatorLabel = computed(() => {
    if (props.showGenerator) return 'エディター'
    if (props.generatorState === 'checking') return 'わんコメ確認中...'
    if (props.generatorState === 'unavailable') return 'ジェネレーター使用不可'
    return 'ジェネレーター'
  })

  const generatorTitle = computed(() => {
    if (props.showGenerator) return 'エディターに戻る'
    if (props.generatorState === 'unavailable')
      return 'わんコメに接続できません。わんコメを起動してから、クリックで再確認してください'
    return 'ジェネレーターを表示して動作を確認する'
  })

  function onSwitch() {
    if (!canUseGenerator.value) {
      if (props.generatorState === 'unavailable') emit('recheck')
      return
    }
    emit('update:showGenerator', !props.showGenerator)
  }
</script>
