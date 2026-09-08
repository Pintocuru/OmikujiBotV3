// tools/webpackBuild/BuildTypes.ts
import { AccessLevelType, PackageJsonType } from '../../types'

/**
 * プロジェクト設定
 * TODO:ProjectCoreConfig と ProjectPackageConfig で分けるべきだったのでは?
 * entryPoints は ProjectCoreConfig でしか使わない、など
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

export interface ProjectConfig {
  key: string
  name: string
  version: string
  tags: string[]
  banner?: string

  packageRoot: string
  entryPoints: string | Record<string, string> | null // PACKAGE ビルドでは null
  addHtmlTemplate: string
  template: TemplateConfig | null
  json?: JsonConfig
  licenseLabel: string

  filesToCopy: CopyFileItem[]

  licenseKey?: {
    basic: string
    adv: string
    pro: string
    godMode: string
    none: string
  }
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
  generateAccessLevelData?: (data: any, targetLevel?: AccessLevelType) => PackageJsonType
  generateJsContent: (configData: string) => string
}

/**
 * アクセスレベル別の設定
 */
export interface AccessLevelConfig {
  licenseLabel: string
  filesToCopy: CopyFileItem[]
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
  accessLevel: AccessLevelType // 対象アクセスレベル
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
export interface ResolvedCoreBuildConfig extends ProjectConfig {
  buildType: 'CORE'
  system: SystemCommonData
  outputFolderName: string
  entryPoints: string | Record<string, string> // CORE では必須なので null を除外
  filesToCopy: CopyFileItem[]
}

/**
 * 内部処理用の解決済みパッケージビルド設定
 */
export interface ResolvedPackageBuildConfig extends ProjectConfig {
  buildType: 'PACKAGE'
  system: SystemCommonData
  packageType: PackageType
  targetAccessLevel: AccessLevelType
  filesToCopy: CopyFileItem[]
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
