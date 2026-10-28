// tools/viteBuild/projectFactory/createPackageProject.ts
import fs from 'fs'
import path from 'path'
import { ProjectPackageConfig, ProjectParams } from '@tools/types'
import { processMerge } from '@tools/JsonMerge/JsonMergeProcessor'
import { generateJsContent } from '@/common/presetsExport/generateContent'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { CONSOLE_FILES_TO_COPY, DEFAULT_FILES_TO_COPY } from './defaults'
import { findJsonPath } from './findJsonPath'
import { DOCS_RAW_BASE } from '../constants/repositoryUrls'

/**
 * パッケージプロジェクト設定を生成する
 */
export function createPackageProject(
  packageRoot: string,
  color: string,
  params: ProjectParams,
  options: { withEditor?: boolean; withConsole?: boolean; update?: boolean } = {}
): ProjectPackageConfig {
  const id = `${params.key}${color}`
  const colorLabel = color ? `${color} ` : ''
  const series = params.series ? params.series : params.key

  return {
    version: `${BUILD_DATE}-${APP_VERSION}`,
    packageRoot,

    key: id,
    name: params.title,
    tags: params.tags,
    banner: `${DOCS_RAW_BASE}${params.category}/${series}/${id}.webp`,
    licenseLabel: params.licenseLabel,

    // Vite のアクセスポイント: packages/<category>/<key>/main.ts (色違いは同じ main.ts を使う)
    // withEditor: true なら editor.ts、withConsole: true なら console.ts も追加する
    // (ジェネレーター・エディター・コンソールは別の entry = 別ページで読み込む)
    entryPoints: {
      main: resolvePackageEntry(packageRoot, params, 'main.ts'),
      ...(options.withEditor ? { editor: resolvePackageEntry(packageRoot, params, 'editor.ts') } : {}),
      ...(options.withConsole ? { console: resolvePackageEntry(packageRoot, params, 'console.ts') } : {}),
    },

    template: {
      name: `おみくじBOT ${params.title} ${colorLabel}OmikujiBot ${id}`,
      label: `${params.title} ${colorLabel} ${id}`,
      boothURL: `https://pintocuru.booth.pm/items/${params.boothId}`,
      readmeURL: `${DOCS_RAW_BASE}${params.category}/${series}/README.ja.md`,
      description: params.description,
    },

    // json: の行を置き換え
    json: options.update ? buildEmptyJsonConfig(packageRoot) : buildJsonConfig(packageRoot, `${id}.json`),

    filesToCopy: [
      ...(params.extraFiles ?? []),
      ...DEFAULT_FILES_TO_COPY,
      // console.html は、withConsole のパッケージだけに入れる
      ...(options.withConsole ? CONSOLE_FILES_TO_COPY : []),
      // UPDATE は既存環境へ上書きするので thumb.gif は同梱しない
      ...(options.update ? [] : [{ from: `packages/${params.category}/${series}/thumb/${id}.gif`, to: 'thumb.gif' }]),
    ],
  }
}

/** パッケージの entry ファイル (main.ts / editor.ts / console.ts) の絶対パスを解決する (無ければ早めに失敗させる) */
function resolvePackageEntry(packageRoot: string, params: ProjectParams, fileName: string): string {
  const entry = path.resolve(packageRoot, 'packages', params.category, params.key, fileName)
  if (!fs.existsSync(entry)) {
    throw new Error(`[Package] ${fileName} が見つかりません: ${entry}`)
  }
  return entry
}

/** JSON設定オブジェクトを生成する */
function buildJsonConfig(packageRoot: string, templateName: string) {
  const jsonPathRoot = path.resolve(packageRoot, 'server/presets/')

  return {
    jsonPathRoot,
    jsonPath: findJsonPath(jsonPathRoot, templateName),
    generateJsContent,
    assembleJsonData: processMerge,
  }
}

/** UPDATE 用: omikujiData.js を出さないので JSON は読まない(ダミー) */
function buildEmptyJsonConfig(packageRoot: string) {
  return { jsonPathRoot: path.resolve(packageRoot, 'server/presets/'), jsonPath: '', generateJsContent }
}
