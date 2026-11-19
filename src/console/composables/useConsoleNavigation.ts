// src/console/composables/useConsoleNavigation.ts
import { ref } from 'vue'
import { notify } from '@/common/Notice/notify'
import { getConsoleViewMeta, type ConsoleViewKey } from '../maps/ConsoleViewMap'
import { getConsoleViewKeys } from '../consoleRegistry'

/** LiveConsole の画面選択と、別ウィンドウ起動を管理する */
export const useConsoleNavigation = () => {
  const keys = getConsoleViewKeys()
  const embeddedKeys = keys.filter((key) => getConsoleViewMeta(key).launch !== 'window')

  // 再読み込みしても、同じ画面に戻れるよう URL の # に覚えておく
  const hashKey = keys.find((key) => key === location.hash.slice(1))

  // # が別ウィンドウ起動の画面なら、このページはその画面専用のウィンドウ
  const windowKey = hashKey && getConsoleViewMeta(hashKey).launch === 'window' ? hashKey : undefined
  document.title = windowKey ? getConsoleViewMeta(windowKey).label : 'おみくじBOT コンソール'

  const current = ref<ConsoleViewKey | undefined>(windowKey ?? hashKey ?? embeddedKeys[0])

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

  return { keys, windowKey, current, select }
}
