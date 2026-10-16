// src/types/OmikujiData/SettingsSchema.ts
import { z } from 'zod'
import { categories } from './CategoryType'
import { themes } from '../core/DaisyUiTheme'
import { normalizedObject } from './ParsedDefault'

// コメント購読タイプ(現在はわんコメのみ)
export const commentModeTypes = ['OneComme'] as const
export type CommentModeType = (typeof commentModeTypes)[number]

// 言語設定(現在は日本語/英語) // 'zh-TW', 'zh-CN', 'th', 'ko'
export const locales = ['ja', 'en'] as const
export type LocaleType = (typeof locales)[number]

/**
 * セクション別スキーマ
 */
const GeneratorSettingsSchema = z.object({
  commentType: z.enum(commentModeTypes).default('OneComme').catch('OneComme'), // コメント購読タイプ
  soundEnabled: z.boolean().default(true).catch(true), // サウンドを有効にするか
  basicDelaySeconds: z.number().min(0).max(5).default(1).catch(1), // 投稿の基本的な遅延時間（秒）
})

const EditorSettingsSchema = z.object({
  locale: z.enum(locales).default('ja').catch('ja'), // 言語設定
  initialCategory: z.enum(categories).default('comments').catch('comments'), // 読み込み時に開くカテゴリ
})

const DeveloperSettingsSchema = z.object({
  daisyUiTheme: z.enum(themes).default('dark').catch('dark'), // エディターのテーマカラー(ビルド後はdarkのみ)
})

/**
 * エディター設定
 */
export const SettingsSchema = z.object({
  generator: normalizedObject(GeneratorSettingsSchema),
  editor: normalizedObject(EditorSettingsSchema),
  developer: normalizedObject(DeveloperSettingsSchema),
})

export type SettingsType = z.infer<typeof SettingsSchema>
