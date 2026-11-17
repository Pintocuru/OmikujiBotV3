// src/types/OmikujiData/SettingsSchema.ts
import { z } from 'zod'
import { ThemeSchema } from '@/types/core/DaisyUiTheme'
import { normalizedObject } from '@/types/core/ParsedDefault'

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
  showCooldownNotice: z.boolean().default(false).catch(false), // クールダウンでおみくじがブロックされたとき、画面の右下に知らせるか
})

const EditorSettingsSchema = z.object({
  locale: z.enum(locales).default('ja').catch('ja'), // 言語設定
})

const DeveloperSettingsSchema = z.object({
  daisyUiTheme: ThemeSchema, // エディターのテーマカラー(製品版は light / dark のみ。それ以外の値でも DaisyUI が dark にする)
})

/**
 * 設定全体(generator / editor / developer)
 */
export const SettingsSchema = z.object({
  generator: normalizedObject(GeneratorSettingsSchema, 'settings.generator'),
  editor: normalizedObject(EditorSettingsSchema, 'settings.editor'),
  developer: normalizedObject(DeveloperSettingsSchema, 'settings.developer'),
})

export type SettingsType = z.infer<typeof SettingsSchema>
