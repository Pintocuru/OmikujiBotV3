// src/types/OmikujiData/SettingsSchema.ts
import { z } from 'zod'
import { categories } from './CategoryType'
import { themes } from '../core/DaisyUiTheme'

// コメント購読タイプ(現在はわんコメのみ)
export const commentModeTypes = ['OneComme'] as const
export type CommentModeType = (typeof commentModeTypes)[number]

// 言語設定(現在は日本語/英語) // 'zh-TW', 'zh-CN', 'th', 'ko'
export const locales = ['ja', 'en'] as const
export type LocaleType = (typeof locales)[number]

/**
 * エディター設定
 */
export const SettingsSchema = z.object({
  generator: z.object({
    commentType: z.enum(commentModeTypes).default('OneComme').catch('OneComme'), // コメント購読タイプ
    soundEnabled: z.boolean().default(true).catch(true), // サウンドを有効にするか
    ignoreUserPattern: z.string().default('__INFO__|__ERROR__').catch('__INFO__|__ERROR__'), // VisitUserを無視するリスト
    // TODO(v3):廃止(紛らわしいので)
    includeExternalComments: z.boolean().default(false).catch(false), // 外部コメントをユーザーリストに入れるか
    // TODO(v3):廃止(レイアウトはここで指定しない)
    uiPlacement: z.enum(['center', 'embedded']).default('center').catch('center'), // 単体のアイテムを中央に配置するか
    basicDelaySeconds: z.number().min(0).max(5).default(1).catch(1), // 投稿の基本的な遅延時間（秒）
  }),

  editor: z.object({
    locale: z.enum(locales).default('ja').catch('ja'), // 言語設定
    initialCategory: z.enum(categories).default('comments').catch('comments'), // 読み込み時に開くカテゴリ
  }),

  developer: z.object({
    daisyUiTheme: z.enum(themes).default('dark').catch('dark'), // エディターのテーマカラー(ビルド後はdarkのみ)
  }),
})

export type SettingsType = z.infer<typeof SettingsSchema>
