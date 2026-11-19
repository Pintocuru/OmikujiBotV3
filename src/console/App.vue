<!-- src/console/App.vue -->
<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <!-- 別ウィンドウで開いた画面(launch: 'window')は、タブなしでその画面だけを表示する -->
    <ConsoleHeader v-if="!windowKey" :keys="keys" :current="current" @select="select" />

    <!-- 各種コンテンツ -->
    <component :is="currentComponent" v-if="currentComponent" :key="current" />
    <p v-else class="p-6 text-sm opacity-70">表示できる画面が登録されていません</p>

    <!-- 通知(notify.*)と確認ダイアログ(dialog.*)の表示先 -->
    <ToastHost />
    <DialogHost />
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, h, type Component } from 'vue'
  import ToastHost from '@/common/Notice/ToastHost.vue'
  import DialogHost from '@/common/Dialog/DialogHost.vue'
  import { configureDialogLabels } from '@/common/Dialog/dialogState'
  import ConsoleHeader from './shell/ConsoleHeader.vue'
  import { useConsoleNavigation } from './composables/useConsoleNavigation'
  import { useConsoleTheme } from './composables/useConsoleTheme'
  import { useServerConnection } from './composables/useServerConnection'
  import type { ConsoleViewKey } from './maps/ConsoleViewMap'
  import { getConsoleViewLoader } from './consoleRegistry'

  // テーマの初期適用。別ウィンドウでは Header がないため、App からも初期化する。
  useConsoleTheme()

  // サーバーの選択(開発時)を復元し、接続確認を始める。別ウィンドウでも、画面の通信より前に行う。
  useServerConnection()

  // コンソールは日本語のみ
  configureDialogLabels({
    ok: 'OK',
    cancel: 'キャンセル',
    confirm: '実行する',
    delete: '削除する',
    deleteTitle: '削除しますか？',
    deleteText: 'この操作は取り消せません',
  })

  const { keys, windowKey, current, select } = useConsoleNavigation()

  // 画面の読み込みは、選ばれたときに 1 回だけ行う
  const loadFailed: Component = {
    render: () => h('p', { class: 'p-6 text-sm text-error' }, '画面の読み込みに失敗しました'),
  }
  const components = new Map<ConsoleViewKey, Component>()
  const toComponent = (key: ConsoleViewKey): Component | undefined => {
    const loader = getConsoleViewLoader(key)
    if (!loader) return undefined
    let component = components.get(key)
    if (!component) {
      // default を自分で取り出す(import が展開される配布ビルドでも、モジュールの形に左右されないように)
      component = defineAsyncComponent({ loader: () => loader().then((m) => m.default), errorComponent: loadFailed })
      components.set(key, component)
    }
    return component
  }
  const currentComponent = computed(() => (current.value ? toComponent(current.value) : undefined))
</script>
