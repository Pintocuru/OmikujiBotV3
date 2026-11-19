// src/console/composables/useConsoleTheme.ts
import { computed, ref } from 'vue'

const THEME_STORAGE_KEY = 'omikuji-console-theme'

// テーマ状態はConsole内で共有し、別ウィンドウでも初期設定を適用する。
const getInitialTheme = (): 'dark' | 'light' => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

const theme = ref<'dark' | 'light'>(getInitialTheme())

/** Console のテーマ状態・適用・永続化を管理する */
export const useConsoleTheme = () => {
  // Header が表示されない別ウィンドウでも、初期テーマを適用するため App からも呼び出す。
  document.documentElement.dataset.theme = theme.value

  const isDark = computed(() => theme.value === 'dark')
  const themeTitle = computed(() => (isDark.value ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'))

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme.value
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.value)
    } catch {
      // localStorageが利用できない環境では、現在の画面内でのみ切り替える。
    }
  }

  return { isDark, themeTitle, toggleTheme }
}
