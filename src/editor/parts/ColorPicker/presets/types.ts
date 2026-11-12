// src/editor/parts/ColorPicker/presets/types.ts
import type { CharacterColorType } from '@/types/OmikujiData'

// キャラクターカラーのうち、プリセットで扱う4色
export type ColorSet = Pick<CharacterColorType, 'name' | 'text' | 'background' | 'accent'>

// プリセット1件(label はテーマ名。色テーマは翻訳しない方針なので英語固定)
export type ColorTheme = ColorSet & { label: string }

// 並びは「テーマ名, 名前の色, テキストの色, 背景色, アクセント」
export const defineTheme = (
  label: string,
  name: string,
  text: string,
  background: string,
  accent: string
): ColorTheme => ({
  label,
  name,
  text,
  background,
  accent,
})
