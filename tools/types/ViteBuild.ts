// tools/types/ViteBuild.ts
// Vite 版ビルダーの型定義 (tools/types/WebpackBuilder.ts の Vite 専用版)
// ※ 構造は webpack 版と同じ。packages/ 側は import 元を差し替えるだけで使える

import { PackageJsonType } from '@/types/core'

/**
 * プロジェクト固有パラメータ (packages/ 配下の各パッケージ定義が渡す値)
 */
export type ProjectParams = {
  key: string
  title: string
  description: string
  banner: string
  tags: string[]
  boothId: string
  category: string
  series?: string
  licenseLabel: string
  extraFiles?: CopyFileItem[]
}

/**
 * パッケージプロジェクト設定
 * - FULL / UPDATE: entryPoints (packages/<category>/<key>/main.ts など) を Vite でビルドして梱包する
 * - JSON: Vite は通さない
 */
export interface ProjectPackageConfig {
  key: string
  version: string
  packageRoot: string
  filesToCopy: CopyFileItem[]
  /** entry 名 → entry ファイルの絶対パス (先頭が main。dist/scripts/<名前>.js になる) */
  entryPoints: Record<string, string>
  name: string
  tags: string[]
  banner?: string
  licenseLabel: string
  template: TemplateConfig
  json: JsonConfig
}

/**
 * テンプレート関連の設定
 */
export interface TemplateConfig {
  name: string
  label: string
  boothURL: string
  readmeURL: string
  description: string
}

/**
 * JSON設定関連
 */
export interface JsonConfig {
  jsonPath: string
  jsonPathRoot: string
  assembleJsonData?: (data: any, jsonPathRoot: string) => Promise<PackageJsonType>
  generateJsContent: (configData: string) => string
}

/**
 * コピーするファイル/フォルダの設定
 */
export type CopyFileItem = string | { from: string; to: string }

/**
 * パッケージビルドターゲット指定
 */
export interface PackageBuildTarget {
  project: string // プロジェクト名
  type: PackageType // パッケージタイプ
}

/**
 * パッケージタイプの定義
 * - FULL: entryPoints を Vite でビルドし、拡張ファイルをすべて含んだ完全なパッケージ
 * - UPDATE: FULL と同じビルドだが、既存環境へ上書きする用 (omikujiData.js と thumb.gif を含まない)
 * - JSON: JSONファイルとREADMEファイルのみを含んだデータのみのパッケージ
 */
export type PackageType = 'FULL' | 'JSON' | 'UPDATE'

/**
 * システム共通データ
 */
export interface SystemCommonData {
  alias: Record<string, string>
  author: string
  description: string
  generatorName: string
  generatorVersion: string
  dataVersion: number
}

// -----------------------------

/**
 * Vite ビルドに必要な最小の設定
 */
export interface ViteBuildInput {
  packageRoot: string
  entryPoints: Record<string, string>
  system: SystemCommonData
}

/**
 * 内部処理用の解決済みパッケージビルド設定
 */
export interface ResolvedPackageBuildConfig extends ProjectPackageConfig {
  system: SystemCommonData
  packageType: PackageType
  outputFolderName: string
}
