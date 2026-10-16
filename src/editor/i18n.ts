// src/editor/i18n.ts
import { createI18n } from 'vue-i18n'

// 1. src/editor/maps/ 以下の `.ts` ファイルをすべて自動インポートする
// (eager: true にすることで、Promiseではなく同期的にオブジェクトとして取得できます)
const modules = import.meta.glob<{ [key: string]: any }>('@/editor/maps/**/*.ts', { eager: true })

// 2. 自動で言語ごとにメッセージをまとめるオブジェクトを構築
const messages: Record<string, Record<string, any>> = {
  ja: {},
  en: {}, // 英語などを追加する場合も自動で入ります
}

for (const path in modules) {
  const mod = modules[path]
  // 各ファイルが export しているオブジェクト（例: baseSettingsMessages）を走査
  for (const exportName in mod) {
    const fileMessages = mod[exportName]

    // 各言語（ja, en など）ごとにマージしていく
    for (const lang in fileMessages) {
      if (!messages[lang]) {
        messages[lang] = {}
      }
      // スプレッド構文で言語ごとのオブジェクトに自動統合
      messages[lang] = {
        ...messages[lang],
        ...fileMessages[lang],
      }
    }
  }
}

// messages の型推論が深くなり ts(2589) になるため、ジェネリクスを明示する
const i18n = createI18n<false>({
  locale: 'ja',
  fallbackLocale: 'ja',
  legacy: false,
  messages,
})

export default i18n
