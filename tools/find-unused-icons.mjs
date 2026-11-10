// aaa
// src/common/LucideIcon/useLucideIcon.ts から使用されていないアイコンを検出するスクリプト
//
// 使用例:
//   node ./tools/find-unused-icons.mjs
//   node ./tools/find-unused-icons.mjs --fix  // 削除実行
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MAP_FILE = 'src/common/LucideIcon/useLucideIcon.ts'
const ROOTS = ['src', 'server', 'packages'] // JSON のプリセットも検索対象
const EXTS = /\.(ts|tsx|js|mjs|vue|json)$/
const KEEP = new Set(['Package']) // resolver の既定値
const fix = process.argv.includes('--fix')

// map からアイコン名を抽出
const src = readFileSync(MAP_FILE, 'utf8')
const start = src.indexOf('export const lucideIconMap')
const block = src.slice(src.indexOf('{', start), src.indexOf('} as const', start))
const names = [...block.matchAll(/^\s*([A-Za-z0-9_]+)\s*[:,]/gm)].map((m) => m[1])

// ファイル収集
const files = []
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === 'dist' || e.startsWith('.')) continue
    const p = join(dir, e)
    /**
     * Expected an assignment or function call and instead saw an expression.eslint@typescript-eslint/no-unused-expressions
     */
    statSync(p).isDirectory() ? walk(p) : EXTS.test(e) && p !== MAP_FILE && files.push(p)
  }
}
ROOTS.forEach((r) => {
  try {
    walk(r)
  } catch {}
})
const corpus = files.map((f) => readFileSync(f, 'utf8')).join('\n')

// 引用符つき文字列 'Name' / "Name" / `Name` として出現するか
const unused = names.filter((n) => !KEEP.has(n) && !new RegExp(`(['"\`])${n}\\1`).test(corpus))

console.log(`map: ${names.length} 個 / 未使用候補: ${unused.length} 個`)
unused.forEach((n) => console.log(' -', n))

if (fix && unused.length) {
  let out = src
  for (const n of unused) out = out.replace(new RegExp(`^\\s*${n}\\s*[:,].*\\n`, 'm'), '')
  writeFileSync(MAP_FILE, out)
  console.log('map から削除しました')
}
