// src/types/core/MetaDataSchema.ts
// パッケージの配布用metaタグ
import { z } from 'zod'
import { idSchema } from '@/types/core/BaseSchema'

/**
 * メタデータ
 */
export const MetaDataSchema = z.object({
  id: idSchema,
  name: z.string().default('unknown').catch('unknown'), // パッケージ名
  description: z.string().default('').catch(''), // パッケージ説明
  version: z.string().default('0.0.0').catch('0.0.0'), // パッケージバージョン
  generatorName: z.string().default('unknown-generator').catch('unknown-generator'), // 対応アプリ名
  generatorVersion: z.string().default('1.x.x').catch('1.x.x'), // アプリバージョン
  dataVersion: z.number().default(1).catch(1), // データバージョン
  author: z.string().default('unknown').catch('unknown'), // 作者
  tags: z.array(z.string()).default([]).catch([]), // タグ
  license: z.string().default('CC-BY 4.0').catch('CC-BY 4.0'), // 簡易表記
  url: z.string().optional().catch(undefined), // 配布サイト
  banner: z.string().optional().catch(undefined), // サムネイル画像のパス
})
export type MetaDataType = z.infer<typeof MetaDataSchema>

/**
 * パッケージデータ
 */
export const PackageJsonSchema = z.object({
  // 関数で渡す(値で渡すと id が固定され、同じオブジェクトが共有される)
  meta: MetaDataSchema.catch(() => MetaDataSchema.parse({})),
})
export type PackageJsonType = z.infer<typeof PackageJsonSchema>
