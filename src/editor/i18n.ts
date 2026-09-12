// src/editor/i18n.ts
import { createI18n } from 'vue-i18n'
import { baseSettingsMessages } from '@/editor/maps/common/BaseSettingsEditor'

// エディタ用のメッセージを言語ごとに結合
const messages = {
  ja: {
    ...baseSettingsMessages.ja,
    // 今後別画面のマップを追加する場合はここにスプレッド構文で追加していく
  },
  // en: { ... }
}

const i18n = createI18n({
  locale: 'ja', // デフォルトの言語
  fallbackLocale: 'ja', // フォールバック言語
  legacy: false, // Composition API (setup) モードを有効にする
  messages,
})

export default i18n
