// src/console/composables/useServerConnection.ts
import { computed, ref } from 'vue'
import { isDev } from '@/common/AppEnv'
import { notify } from '@/common/Notice/notify'
import { isExpressMode } from '@/manager/services/baseApiClient'
import { userStatsApi } from '@/manager/services/userStatsApi'

const MODE_STORAGE_KEY = 'omikuji-console-server-mode'
const HEALTH_INTERVAL_MS = 5000

export type ServerConnectionState = 'checking' | 'online' | 'offline'

// 状態は Console 内(Header・別ウィンドウ含む)で共有する
const state = ref<ServerConnectionState>('checking')
const switching = ref(false)
let started = false

const readStoredMode = (): boolean | undefined => {
  try {
    const value = localStorage.getItem(MODE_STORAGE_KEY)
    return value === 'express' ? true : value === 'plugin' ? false : undefined
  } catch {
    return undefined
  }
}

const storeMode = () => {
  try {
    localStorage.setItem(MODE_STORAGE_KEY, isExpressMode.value ? 'express' : 'plugin')
  } catch {
    // localStorage が使えない環境では、このウィンドウ内でのみ保持する
  }
}

/** 保存されたサーバーの選択を反映する(開発時のみ。製品版はプラグイン固定) */
const applyStoredMode = () => {
  if (!isDev) return
  const stored = readStoredMode()
  if (stored !== undefined && stored !== isExpressMode.value) userStatsApi.toggleApiMode()
}

const check = async () => {
  if (switching.value) return
  const ok = await userStatsApi.getHealth()
  if (switching.value) return // 確認中に切り替えが始まっていたら、古い結果で上書きしない
  state.value = ok ? 'online' : 'offline'
}

const start = () => {
  if (started) return
  started = true

  applyStoredMode()
  void check()

  setInterval(() => {
    if (!document.hidden) void check()
  }, HEALTH_INTERVAL_MS)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void check()
  })

  // 別ウィンドウで切り替えたら、こちらも合わせる
  window.addEventListener('storage', (event) => {
    if (event.key !== MODE_STORAGE_KEY) return
    applyStoredMode()
    void check()
  })
}

/** Console のサーバー接続状態の確認と、サーバー(Express / プラグイン)の切り替え */
export const useServerConnection = () => {
  start()

  const modeName = computed(() => (isExpressMode.value ? 'Express' : 'プラグイン'))
  const nextModeName = computed(() => (isExpressMode.value ? 'プラグイン' : 'Express'))

  /** 切り替え先に繋がらなければ、元のサーバーに戻す */
  const toggleMode = async () => {
    if (!isDev || switching.value) return
    const target = nextModeName.value
    switching.value = true
    state.value = 'checking'
    try {
      userStatsApi.toggleApiMode()
      if (await userStatsApi.getHealth()) {
        storeMode()
        return
      }
      userStatsApi.toggleApiMode()
      notify.error('サーバーを切り替えられませんでした', {
        text: `${target}に接続できません。サーバーが起動していることを確認してください`,
      })
    } finally {
      switching.value = false
      await check()
    }
  }

  return {
    state,
    connected: computed(() => state.value === 'online'),
    canSwitch: isDev,
    switching,
    modeName,
    nextModeName,
    toggleMode,
  }
}
