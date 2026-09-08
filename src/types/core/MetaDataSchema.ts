// src/types/core/MetaDataSchema.ts
// パッケージの配布用metaタグ
import z from 'zod'
import { idSchema } from './BaseSchema'

/**
 * メタデータ
 */
export const MetaDataSchema = z.object({
  id: idSchema,
  name: z.string().default('unknown'), // パッケージ名
  description: z.string().default(''), // パッケージ説明
  version: z.string().default('0.0.0'), // パッケージバージョン
  generatorName: z.string().default('unknown-generator'), // 対応アプリ名
  generatorVersion: z.string().default('1.x.x'), // アプリバージョン
  dataVersion: z.number().default(1), // データバージョン
  author: z.string().default('unknown'), // 作者
  tags: z.array(z.string()).default([]), // タグ
  license: z.string().default('CC-BY 4.0'), // 簡易表記
  url: z.string().optional(), // 配布サイト
  banner: z.string().optional(), // サムネイル画像のパス
})
export type MetaDataType = z.infer<typeof MetaDataSchema>

/**
 * パッケージデータ
 */
export const PackageJsonSchema = z.object({
  meta: MetaDataSchema.catch(MetaDataSchema.parse({})),
})
export type PackageJsonType = z.infer<typeof PackageJsonSchema>
