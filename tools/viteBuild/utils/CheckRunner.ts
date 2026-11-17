// tools/viteBuild/utils/CheckRunner.ts
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

/** ビルド前に通すチェック */
const CHECKS = [
  { name: 'vue-tsc', command: 'npx vue-tsc --noEmit' },
  { name: 'depcruise', command: 'npx depcruise src --config tools/depcruise/dependency-cruiser.config.ts' },
] as const

type CheckName = (typeof CHECKS)[number]['name']

/** 成功したチェックの記録先 (node_modules 配下なので git 管理外) */
const CACHE_PATH = 'node_modules/.cache/omikuji-build-checks.json'

/** チェック結果に影響するものだけを対象にする (vue-tsc の include と同じ範囲 + 設定ファイル) */
const SOURCE_DIRS = ['src', 'packages', 'server', 'tools']
const ROOT_FILES = ['tsconfig.json', 'package-lock.json']
const EXTENSIONS = new Set(['.ts', '.vue', '.json'])
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'archives', '.git'])

const collectFiles = (dir: string, out: string[]) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) collectFiles(path.join(dir, entry.name), out)
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      out.push(path.join(dir, entry.name))
    }
  }
}

/** 対象ファイルのパスと中身から 1 つのハッシュを作る */
const hashSources = (root: string): string => {
  const files: string[] = []
  for (const dir of SOURCE_DIRS) {
    const abs = path.join(root, dir)
    if (fs.existsSync(abs)) collectFiles(abs, files)
  }
  for (const name of ROOT_FILES) {
    const abs = path.join(root, name)
    if (fs.existsSync(abs)) files.push(abs)
  }
  // ルート直下の *.ts (vue-tsc の include に含まれる)
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.ts')) files.push(path.join(root, entry.name))
  }

  const hash = crypto.createHash('sha256')
  for (const file of files.sort()) {
    hash.update(path.relative(root, file).replace(/\\/g, '/'))
    hash.update(fs.readFileSync(file))
  }
  return hash.digest('hex')
}

const readCache = (file: string): Partial<Record<CheckName, string>> => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return {}
  }
}

/**
 * ビルド前チェック (vue-tsc / depcruise) を実行する
 * - 前回成功したときからソースが変わっていないチェックは飛ばす
 * - 失敗時は throw (記録は成功したチェックだけ更新する)
 */
export function runPreBuildChecks(projectRoot: string, options: { force?: boolean } = {}) {
  const cacheFile = path.join(projectRoot, CACHE_PATH)
  const cache = options.force ? {} : readCache(cacheFile)
  const current = hashSources(projectRoot)

  for (const { name, command } of CHECKS) {
    if (cache[name] === current) {
      console.log(`⏭️ ${name}: 前回成功時から変更なし (スキップ)`)
      continue
    }
    console.log(`🔍 ${name} を実行中...`)
    execSync(command, { stdio: 'inherit', cwd: projectRoot })

    // 成功したらすぐ記録する (次のチェックで失敗しても、通ったものは再実行しない)
    cache[name] = current
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true })
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2))
  }
}
