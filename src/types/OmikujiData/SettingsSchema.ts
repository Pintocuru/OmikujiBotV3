// src/types/OmikujiData/SettingsSchema.ts
import { z } from 'zod'
import { assetCategory } from './assets'
import { eventCategory } from './events'
import { themes } from '../core/DaisyUiTheme'
import { normalizedObject } from '../core/ParsedDefault'

// コメント購読タイプ(現在はわんコメのみ)
export const commentModeTypes = ['OneComme'] as const
export type CommentModeType = (typeof commentModeTypes)[number]

// 言語設定(現在は日本語/英語) // 'zh-TW', 'zh-CN', 'th', 'ko'
export const locales = ['ja', 'en'] as const
export type LocaleType = (typeof locales)[number]

// 起動時に開けるカテゴリ(実データを持つカテゴリ + ui)。設定系ページ(jsonMerge / appInfo)は開始ページにしない
export const initialCategories = [...eventCategory, ...assetCategory, 'ui'] as const
export type InitialCategoryType = (typeof initialCategories)[number]

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
  initialCategory: z.enum(initialCategories).default('comments').catch('comments'), // 読み込み時に開くカテゴリ(不正値・旧データのjsonMerge/appInfoはcommentsに戻る)
})

const DeveloperSettingsSchema = z.object({
  daisyUiTheme: z.enum(themes).default('dark').catch('dark'), // エディターのテーマカラー(製品版は light / dark のみ。それ以外の値でも DaisyUI が dark にする)
})

/**
 * エディター設定
 */
export const SettingsSchema = z.object({
  generator: normalizedObject(GeneratorSettingsSchema, 'settings.generator'),
  editor: normalizedObject(EditorSettingsSchema, 'settings.editor'),
  developer: normalizedObject(DeveloperSettingsSchema, 'settings.developer'),
})

export type SettingsType = z.infer<typeof SettingsSchema>
