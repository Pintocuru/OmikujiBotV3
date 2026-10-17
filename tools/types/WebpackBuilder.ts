// tools/types/WebpackBuilder.ts

import { PackageJsonType } from '@/types/core'

/**
 * プロジェクト固有パラメータ (build/ 配下の各パッケージ定義が渡す値)
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
 * コア/パッケージ共通のプロジェクト設定
 */
interface ProjectBaseConfig {
  key: string
  version: string
  packageRoot: string
  filesToCopy: CopyFileItem[]
}

/**
 * コアプロジェクト設定 (webpack を通すのはコアだけ)
 */
export interface ProjectCoreConfig extends ProjectBaseConfig {
  entryPoints: string | Record<string, string>
  addHtmlTemplate: string
}

/**
 * パッケージプロジェクト設定 (コアのビルド成果物 + JSON などを梱包する。webpack は通さない)
 */
export interface ProjectPackageConfig extends ProjectBaseConfig {
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
 * コアビルドターゲット指定
 */
export interface CoreBuildTarget {
  project: string // プロジェクト名
}

/**
 * パッケージビルドターゲット指定
 */
export interface PackageBuildTarget {
  project: string // プロジェクト名
  type: PackageType // パッケージタイプ
  sourceProject?: string // コピー元のコアプロジェクト名（JSON タイプでは不要）
}

/**
 * パッケージタイプの定義（PACKAGE ビルド時のみ使用）
 * - FULL: コアファイルと拡張ファイルをすべて含んだ完全なパッケージ
 * - PATCH: 拡張ファイルのみを含んだ差分更新用パッケージ
 * - JSON: JSONファイルとREADMEファイルのみを含んだデータのみのパッケージ
 */
export type PackageType = 'FULL' | 'PATCH' | 'JSON'

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
 * 内部処理用の解決済みコアビルド設定
 */
export interface ResolvedCoreBuildConfig extends ProjectCoreConfig {
  system: SystemCommonData
  outputFolderName: string
}

/**
 * 内部処理用の解決済みパッケージビルド設定
 */
export interface ResolvedPackageBuildConfig extends ProjectPackageConfig {
  system: SystemCommonData
  packageType: PackageType
  outputFolderName: string
  sourceCorePath?: string // JSON タイプでは undefined
}

/**
 * ビルド用メタデータ
 */
export interface BuildMeta {
  hash: string
  builtAt: string
}
