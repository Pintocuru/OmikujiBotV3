// src/editor/i18n.ts
import { createI18n } from 'vue-i18n'
import { messageModules } from '@/editor/maps/messageModules'

// 対応ロケール。maps 配下の export のうち、これらをキーに持つオブジェクトだけをメッセージとして扱う
// （categorySectionMap や colorFields など、メッセージではない export を誤って取り込まないため）
const LOCALES = ['ja', 'en'] as const

type Messages = Record<string, any>

// 1. src/editor/maps/ 以下の翻訳ファイル (messageModules.ts に列挙)
const modules = messageModules

const isPlainObject = (v: unknown): v is Messages => typeof v === 'object' && v !== null && !Array.isArray(v)

// 2. 深いマージ（浅いスプレッドだと、同じ最上位キーを持つファイル同士で後勝ちに上書きされ、キーが消える）
const deepMerge = (target: Messages, source: Messages): Messages => {
  for (const key of Object.keys(source)) {
    const src = source[key]
    const dst = target[key]
    if (isPlainObject(src) && isPlainObject(dst)) {
      deepMerge(dst, src)
    } else if (isPlainObject(src)) {
      target[key] = deepMerge({}, src)
    } else {
      if (process.env.NODE_ENV !== 'production' && key in target && target[key] !== src) {
        console.warn(`[i18n] メッセージキーが重複しています: ${key}`)
      }
      target[key] = src
    }
  }
  return target
}

// 3. 言語ごとにメッセージをまとめる
const messages: Record<string, Messages> = Object.fromEntries(LOCALES.map((l) => [l, {}]))

for (const path in modules) {
  const mod = modules[path]
  for (const exportName in mod) {
    const fileMessages = mod[exportName]
    if (!isPlainObject(fileMessages)) continue

    for (const lang of LOCALES) {
      const langMessages = fileMessages[lang]
      if (isPlainObject(langMessages)) deepMerge(messages[lang], langMessages)
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
