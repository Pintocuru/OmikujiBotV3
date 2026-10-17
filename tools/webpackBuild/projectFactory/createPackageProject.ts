// tools/webpackBuild/projectFactory/createPackageProject.ts
import fs from 'fs'
import path from 'path'
import { ProjectPackageConfig, ProjectParams } from '@tools/types'
import { processMerge } from '@tools/JsonMerge/JsonMergeProcessor'
import { generateJsContent } from '@/common/presetsExport/generateContent'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { DEFAULT_FILES_TO_COPY, HTML_SCRIPT_TAGS } from './defaults'
import { findJsonPath } from './findJsonPath'

/**
 * パッケージプロジェクト設定を生成する。
 *
 * @param packageRoot パッケージのルートディレクトリ
 * @param color       カラーバリアント識別子（空文字の場合はデフォルト扱い）
 * @param params      プロジェクト固有パラメータ
 */
export function createPackageProject(packageRoot: string, color: string, params: ProjectParams): ProjectPackageConfig {
  const id = `${params.key}${color}`
  const colorLabel = color ? `${color} ` : ''
  const series = params.series ? params.series : params.key

  return {
    version: `${BUILD_DATE}-${APP_VERSION}`,
    packageRoot,

    key: id,
    name: params.title,
    tags: params.tags,
    banner: `https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/refs/heads/main/${params.category}/${series}/${id}.webp`,
    licenseLabel: params.licenseLabel,

    // webpack のアクセスポイント: packages/<category>/<key>/main.ts (色違いは同じ main.ts を使う)
    entryPoints: { main: resolvePackageEntry(packageRoot, params) },
    addHtmlTemplate: HTML_SCRIPT_TAGS,

    template: {
      name: `おみくじBOT ${params.title} ${colorLabel}OmikujiBot ${id}`,
      label: `${params.title} ${colorLabel} ${id}`,
      boothURL: `https://pintocuru.booth.pm/items/${params.boothId}`,
      readmeURL: `https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/${params.category}/${series}/README.ja.md`,
      description: params.description,
    },

    json: buildJsonConfig(packageRoot, `${id}.json`),

    filesToCopy: [
      ...(params.extraFiles ?? []),
      ...DEFAULT_FILES_TO_COPY,
      { from: `assets/thumb/${params.category}/${id}.gif`, to: 'thumb.gif' },
    ],
  }
}

/** パッケージの main.ts の絶対パスを解決する (無ければ早めに失敗させる) */
function resolvePackageEntry(packageRoot: string, params: ProjectParams): string {
  const entry = path.resolve(packageRoot, 'packages', params.category, params.key, 'main.ts')
  if (!fs.existsSync(entry)) {
    throw new Error(`[Package] main.ts が見つかりません: ${entry}`)
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
