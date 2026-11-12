// src/editor/parts/ColorPicker/useColorHistory.ts
// 「最近使った色」と「お気に入り」を localStorage に保存する。
// 状態はモジュールスコープで共有するので、複数の ColorPicker を開いても同期する。
import { ref } from 'vue'
import type { ColorSet } from './presets'

const RECENT_KEY = 'omikujibot:colorPicker:recent'
const FAVORITES_KEY = 'omikujibot:colorPicker:favorites'
const MAX_RECENT = 12
const MAX_FAVORITES = 24

const COLOR_RE = /^#[0-9a-fA-F]{6}$/

// 4色セットの同一判定用キー
const toKey = (s: ColorSet) => [s.name, s.text, s.background, s.accent].map((c) => c.toLowerCase()).join('|')

const isColorSet = (v: unknown): v is ColorSet => {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return (['name', 'text', 'background', 'accent'] as const).every(
    (k) => typeof o[k] === 'string' && COLOR_RE.test(o[k] as string)
  )
}

const pick = (s: ColorSet): ColorSet => ({ name: s.name, text: s.text, background: s.background, accent: s.accent })

// 読み込み失敗(保存なし・壊れた JSON・storage 不可)は空配列として扱う
const load = (key: string): ColorSet[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isColorSet).map(pick) : []
  } catch {
    return []
  }
}

const save = (key: string, value: ColorSet[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 保存できなくても画面上の動作は続ける
  }
}

const recent = ref<ColorSet[]>(load(RECENT_KEY))
const favorites = ref<ColorSet[]>(load(FAVORITES_KEY))

export const useColorHistory = () => {
  // 先頭に追加。重複は除き、最大 MAX_RECENT 件
  const pushRecent = (set: ColorSet) => {
    const key = toKey(set)
    recent.value = [pick(set), ...recent.value.filter((s) => toKey(s) !== key)].slice(0, MAX_RECENT)
    save(RECENT_KEY, recent.value)
  }

  const isFavorite = (set: ColorSet) => favorites.value.some((s) => toKey(s) === toKey(set))

  const toggleFavorite = (set: ColorSet) => {
    const key = toKey(set)
    favorites.value = isFavorite(set)
      ? favorites.value.filter((s) => toKey(s) !== key)
      : [pick(set), ...favorites.value].slice(0, MAX_FAVORITES)
    save(FAVORITES_KEY, favorites.value)
  }

  return { recent, favorites, pushRecent, isFavorite, toggleFavorite }
}
