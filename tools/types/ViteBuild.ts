// tools/types/ViteBuild.ts
// Vite 版ビルダーの型定義


/**
 * パッケージ(製品)の共通情報
 * key と category は build.ts のあるフォルダ名から決まる (packages/<category>/<key>/build.ts)
 */
export type PackageProject = {
  title: string
  description: string
  tags: string[]
  boothId: string
  licenseLabel: string
  /** README・バナーの置き場所のシリーズ名 (既定: key) */
  series?: string
  extraFiles?: CopyFileItem[]
}

/**
 * パッケージのバリエーション定義
 */
export interface PackageVariant {
  /** パッケージ名に付ける識別子 ('' = なし) */
  variant: string
  /** editor.ts (エディター) を同梱する (既定: false) */
  withEditor?: boolean
  /** console.ts (LiveConsole) を同梱する (既定: false) */
  withConsole?: boolean
  /** パッケージタイプ (既定: 'FULL') */
  type?: PackageType
  /** 読み込むプリセットJSONのファイル名 (既定: `${key}.json`。UPDATE は読み込まない) */
  jsonFileName?: string
}

/**
 * definePackage が返すパッケージ定義
 */
export interface PackageDefinition {
  key: string
  category: string
  /** build.ts のあるフォルダ (main.ts / editor.ts / console.ts の場所) */
  dir: string
  project: PackageProject
  variants: PackageVariant[]
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
 * JSON設定関連 (UPDATE は JSON を読み込まないので持たない)
 */
export interface JsonConfig {
  jsonPath: string
  jsonPathRoot: string
}

/**
 * コピーするファイル/フォルダの設定
 */
export type CopyFileItem = string | { from: string; to: string }

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
 * 1 バリエーションぶんの解決済みビルド設定
 * - FULL / UPDATE: entryPoints (main.ts / editor.ts / console.ts) を Vite でビルドして梱包する
 * - JSON: Vite は通さない
 */
export interface ResolvedPackageBuildConfig extends ViteBuildInput {
  key: string
  version: string
  packageType: PackageType
  outputFolderName: string
  filesToCopy: CopyFileItem[]
  name: string
  tags: string[]
  banner: string
  licenseLabel: string
  template: TemplateConfig
  json?: JsonConfig
}

