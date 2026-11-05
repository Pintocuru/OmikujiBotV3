// tools/viteBuild/core/ConfigResolver.ts
import fs from 'fs'
import path from 'path'
import { PackageDefinition, PackageVariant, ResolvedPackageBuildConfig } from '@tools/types'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { DOCS_RAW_BASE } from '../constants/repositoryUrls'
import { PROJECT_ROOT, SYSTEM_COMMON_DATA } from '../constants/system'
import { CONSOLE_FILES_TO_COPY, DEFAULT_FILES_TO_COPY, EDITOR_FILES_TO_COPY } from '../projectFactory/defaults'
import { findJsonPath } from '../projectFactory/findJsonPath'

const sanitizeName = (str: string) => str.replace(/[<>:"/\\|?*]/g, '_')

/**
 * パッケージ定義 (全バリエーション) からビルド設定を解決
 */
export function resolvePackageBuildConfigs(definitions: PackageDefinition[]): ResolvedPackageBuildConfig[] {
  const configs = definitions.flatMap((def) => def.variants.map((variant) => resolveVariant(def, variant)))

  // 同じ出力フォルダに書き込む定義があると、後のビルドが前のものを壊す
  const seen = new Set<string>()
  for (const { outputFolderName } of configs) {
    if (seen.has(outputFolderName)) throw new Error(`[Package] 出力先が重複しています: ${outputFolderName}`)
    seen.add(outputFolderName)
  }
  return configs
}

function resolveVariant(def: PackageDefinition, v: PackageVariant): ResolvedPackageBuildConfig {
  const { key, category, dir, project } = def
  const { variant, withEditor = false, withConsole = false } = v

  const id = `${key}${variant}`
  const variantLabel = variant ? `${variant} ` : ''
  const series = project.series ?? key
  const version = `${BUILD_DATE}-${APP_VERSION}`
  const docsBase = `${DOCS_RAW_BASE}${category}/${series}/`

  return {
    packageRoot: PROJECT_ROOT,
    system: SYSTEM_COMMON_DATA,
    outputFolderName: `${sanitizeName(id)}_${sanitizeName(version)}`,

    key: id,
    version,
    name: project.title,
    tags: project.tags,
    banner: `${docsBase}${id}.webp`,
    licenseLabel: project.licenseLabel,

    // Vite のアクセスポイント (ジェネレーター・エディター・コンソールは別の entry = 別ページ)
    entryPoints: {
      main: resolveEntry(dir, 'main.ts'),
      ...(withEditor ? { editor: resolveEntry(dir, 'editor.ts') } : {}),
      ...(withConsole ? { console: resolveEntry(dir, 'console.ts') } : {}),
    },

    template: {
      name: `おみくじBOT ${project.title} ${variantLabel}OmikujiBot ${id}`,
      label: `${project.title} ${variantLabel} ${id}`,
      boothURL: `https://pintocuru.booth.pm/items/${project.boothId}`,
      readmeURL: `${docsBase}README.ja.md`,
      description: project.description,
    },

    // jsonFileName: null (アップデート用) は omikujiData.js を出さないので JSON を読まない
    json: v.jsonFileName === null ? undefined : resolveJson(v.jsonFileName ?? `${key}.json`),

    filesToCopy: [
      ...(project.extraFiles ?? []),
      ...DEFAULT_FILES_TO_COPY,
      ...(withEditor ? EDITOR_FILES_TO_COPY : []),
      ...(withConsole ? CONSOLE_FILES_TO_COPY : []),
    ],
  }
}

/** entry ファイル (main.ts / editor.ts / console.ts) の絶対パス (無ければ早めに失敗させる) */
function resolveEntry(dir: string, fileName: string): string {
  const entry = path.resolve(dir, fileName)
  if (!fs.existsSync(entry)) throw new Error(`[Package] ${fileName} が見つかりません: ${entry}`)
  return entry
}

function resolveJson(jsonFileName: string) {
  const jsonPathRoot = path.resolve(PROJECT_ROOT, 'server/presets/')
  return { jsonPathRoot, jsonPath: findJsonPath(jsonPathRoot, jsonFileName) }
}
