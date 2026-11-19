<!-- src/console/LiveConsole.vue -->
<template>
  <div class="min-h-screen bg-base-100 text-base-content" data-theme="dark">
    <!-- 別ウィンドウで開いた画面(launch: 'window')は、タブなしでその画面だけを表示する -->
    <header v-if="!windowKey" class="navbar sticky top-0 z-10 gap-4 bg-base-200 shadow">
      <h1 class="text-lg font-bold">LiveConsole</h1>

      <!-- 画面の切り替え -->
      <div role="tablist" class="tabs tabs-box tabs-sm">
        <button
          v-for="key in keys"
          :key="key"
          role="tab"
          class="tab gap-1"
          :class="{ 'tab-active': key === current }"
          @click="select(key)"
        >
          {{ getConsoleViewMeta(key).label }}
          <span v-if="getConsoleViewMeta(key).launch === 'window'" aria-hidden="true">↗</span>
        </button>
      </div>
    </header>

    <component :is="currentComponent" v-if="currentComponent" :key="current" />
    <p v-else class="p-6 text-sm opacity-70">表示できる画面が登録されていません</p>

    <!-- 通知(notify.*)と確認ダイアログ(dialog.*)の表示先 -->
    <ToastHost />
    <DialogHost />
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, h, ref, type Component } from 'vue'
  import ToastHost from '@/common/Notice/ToastHost.vue'
  import DialogHost from '@/common/Dialog/DialogHost.vue'
  import { configureDialogLabels } from '@/common/Dialog/dialogState'
  import { notify } from '@/common/Notice/notify'
  import { getConsoleViewMeta, type ConsoleViewKey } from './maps/ConsoleViewMap'
  import { getConsoleViewKeys, getConsoleViewLoader } from './consoleRegistry'

  // コンソールは日本語のみ
  configureDialogLabels({
    ok: 'OK',
    cancel: 'キャンセル',
    confirm: '実行する',
    delete: '削除する',
    deleteTitle: '削除しますか？',
    deleteText: 'この操作は取り消せません',
  })

  // 登録された画面 (並び順は consoleViewMap の順)。画面の中身は、ここでは知らない
  const keys = getConsoleViewKeys()
  const embeddedKeys = keys.filter((key) => getConsoleViewMeta(key).launch !== 'window')

  // 再読み込みしても、同じ画面に戻れるよう URL の # に覚えておく (例: console.html#gameLog)
  const hashKey = keys.find((key) => key === location.hash.slice(1))

  // # が「別ウィンドウ起動の画面」なら、このページはその画面専用のウィンドウ
  const windowKey = hashKey && getConsoleViewMeta(hashKey).launch === 'window' ? hashKey : undefined
  if (windowKey) document.title = getConsoleViewMeta(windowKey).label

  const current = ref<ConsoleViewKey | undefined>(windowKey ?? hashKey ?? embeddedKeys[0])

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

  // 別ウィンドウで開く (同じ画面を押し直したときは、開いているウィンドウを再利用する)
  const openInWindow = (key: ConsoleViewKey) => {
    const url = new URL(location.href)
    url.hash = key
    const { width, height } = getConsoleViewMeta(key).windowSize ?? { width: 1280, height: 720 }
    const opened = window.open(url.href, `omikuji-console-${key}`, `popup,width=${width},height=${height}`)
    if (opened) opened.focus()
    else notify.warning('ウィンドウを開けませんでした', { text: 'ブラウザのポップアップのブロックを解除してください' })
  }

  const select = (key: ConsoleViewKey) => {
    if (getConsoleViewMeta(key).launch === 'window') return openInWindow(key)
    current.value = key
    history.replaceState(null, '', `#${key}`)
  }
</script>
