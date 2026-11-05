// tools/presetMeta/syncPresetMeta.ts
// プリセットJSON (server/presets) の meta を、パッケージ定義に合わせて更新するツール
// ビルドとは独立している (ビルドはソースJSONを書き換えない)
import fs from 'fs'
import path from 'path'
import { PackageDefinition } from '@tools/types'
import { resolvePackageBuildConfigs } from '../viteBuild/core/ConfigResolver'
import { applyMetadata, readJsonFile } from '../viteBuild/processors/json/UpdateJsonMetadata'

interface SyncPresetMetaOptions {
  /** 書き込まず、変更される項目だけを表示する */
  dryRun?: boolean
}

/**
 * 渡されたパッケージ定義のプリセットJSONに meta を反映する
 * - 同じJSONを複数の variant が読む場合は、先頭の variant の meta を使う
 * - JSON は従来どおり1行 (minify) で保存する
 */
export function syncPresetMeta(definitions: PackageDefinition[], options: SyncPresetMetaOptions = {}): void {
  const { dryRun = false } = options
  const done = new Map<string, string>() // JSONパス → 反映に使った package key

  for (const config of resolvePackageBuildConfigs(definitions)) {
    if (!config.json) continue // jsonFileName: null (アップデート用)

    const filePath = path.resolve(config.json.jsonPathRoot, config.json.jsonPath)
    const label = path.relative(config.packageRoot, filePath).replace(/\\/g, '/')

    const usedBy = done.get(filePath)
    if (usedBy) {
      console.log(`⏭️  ${label}: ${usedBy} の meta を使用済みのため、${config.key} はスキップ`)
      continue
    }
    done.set(filePath, config.key)

    const before = readJsonFile(filePath)
    const after = applyMetadata(before, config)
    if (!before.meta) {
      console.warn(`⚠️ ${label}: meta が無いためスキップ`)
      continue
    }

    const changes = diffMeta(before.meta as Record<string, unknown>, after.meta as Record<string, unknown>)
    if (changes.length === 0) {
      console.log(`✔ ${label}: 変更なし`)
      continue
    }

    console.log(`${dryRun ? '👀' : '✏️'}  ${label} (${config.key})`)
    for (const line of changes) console.log(`    ${line}`)
    if (!dryRun) fs.writeFileSync(filePath, JSON.stringify(after), 'utf-8')
  }

  if (dryRun) console.log('\n(--dry-run: ファイルは書き換えていません)')
}

/** 変更された meta の項目を `項目: 旧 → 新` の形で返す */
function diffMeta(before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  return Object.keys(after)
    .filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]))
    .map((k) => `${k}: ${JSON.stringify(before[k])} → ${JSON.stringify(after[k])}`)
}
