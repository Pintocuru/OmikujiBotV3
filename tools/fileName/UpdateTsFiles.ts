// tools/fileName/UpdateTsFiles.ts
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// モノレポ用
const TARGET_DIRS = ['packages', 'assets', 'src', 'tools', 'server', 'build']
const ROOT = path.resolve(__dirname, '../..')

async function getAllTargetFiles(dir: string): Promise<string[]> {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const results = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) return getAllTargetFiles(fullPath)

      if (
        entry.isFile() &&
        ((fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts')) ||
          fullPath.endsWith('.vue') ||
          fullPath.endsWith('.css'))
      ) {
        return [fullPath]
      }

      return []
    })
  )

  return results.flat()
}

async function processFile(filePath: string) {
  const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/')
  let content = await fs.readFile(filePath, 'utf-8')

  // BOM は保持する
  let bom = ''
  if (content.startsWith('\uFEFF')) {
    bom = '\uFEFF'
    content = content.slice(1)
  }

  const isTs = filePath.endsWith('.ts')
  const isCss = filePath.endsWith('.css')
  const header = isTs ? `// ${relativePath}` : isCss ? `/* ${relativePath} */` : `<!-- ${relativePath} -->`
  // 「既存のヘッダー行」だけを置き換え対象にする(任意のコメントを消さない)
  const headerPattern = isTs ? /^\/\/ \S.*$/ : isCss ? /^\/\* \S.*\*\/$/ : /^<!-- \S.*-->$/

  const lines = content.split('\n')
  let changed = false

  if (headerPattern.test(lines[0]?.trim() ?? '')) {
    // ヘッダーが既にある → パスが同じなら何もしない
    if (lines[0].trim() !== header) {
      lines[0] = header
      changed = true
    }
  } else {
    // ヘッダーがない → 挿入のみ(既存の1行目は消さない)
    lines.unshift(header)
    changed = true
  }

  if (!changed) return // ← 実質変更なしは書き込まない

  const newContent = bom + lines.join('\n')
  if (newContent === bom + content) return // 念のため二重ガード

  await fs.writeFile(filePath, newContent, 'utf-8')
}

async function main() {
  const filesPerDir = await Promise.all(TARGET_DIRS.map((dir) => getAllTargetFiles(path.join(ROOT, dir))))
  const files = filesPerDir.flat()
  await Promise.all(files.map(processFile))
  console.log(`Processed ${files.length} files`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
