// tools/migrateStepKey.mjs
//
// v3.0000001003 のおみくじデータを v3.0000001004 に変換する。
// 変更点: おみくじアイテム(kind: 'steps')のインライン steps -> assets.scenarios への切り出し + stepKey
//
// 使い方:
//   node tools/migrateStepKey.mjs <入力ファイル> [出力ファイル]
//
//   入力: エディターが出力した omikujiData.js、または JSON ファイル(meta を持つおみくじデータ)
//   出力: 省略時は「<入力名>.v1004.<拡張子>」。入力ファイルは書き換えない
//
// ルール:
//   - シナリオの key は「みくじ箱key_アイテムkey」。既存の key と被る場合は末尾に _ を足す
//   - steps の中身が同一のアイテムは、1つのシナリオにまとめる(まとめる対象はこのツールが生成したシナリオ同士)
//   - control アイテムと、既存の scenarios は変更しない
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { basename, dirname, extname, join, resolve } from 'node:path'

const FROM_VERSION = 3.0000001003
const TO_VERSION = 3.0000001004

const fail = (msg) => {
  console.error(`エラー: ${msg}`)
  process.exit(1)
}

const [, , inputArg, outputArg] = process.argv
if (!inputArg || inputArg === '-h' || inputArg === '--help') {
  console.log('使い方: node tools/migrateStepKey.mjs <入力ファイル(.js / .json)> [出力ファイル]')
  process.exit(inputArg ? 0 : 1)
}

const inputPath = resolve(inputArg)
if (!existsSync(inputPath)) fail(`ファイルが見つかりません: ${inputPath}`)

const ext = extname(inputPath).toLowerCase()
const text = readFileSync(inputPath, 'utf-8').replace(/^\uFEFF/, '')

// ---------------------------------------------------------------------------
// 読み込み (.js: エディター出力 / .json)
// ---------------------------------------------------------------------------
const JS_PATTERN = /(const omikujiData = )([\s\S]*?)(;\s*\n\s*if \(typeof window)/

let data
let jsMatch = null
if (ext === '.js') {
  jsMatch = text.match(JS_PATTERN)
  if (!jsMatch) fail('omikujiData.js の形式として読めませんでした(`const omikujiData = {...};` が見つかりません)')
  try {
    data = JSON.parse(jsMatch[2])
  } catch (e) {
    fail(`omikujiData の JSON を読めませんでした: ${e.message}`)
  }
} else {
  try {
    data = JSON.parse(text)
  } catch (e) {
    fail(`JSON を読めませんでした: ${e.message}`)
  }
}

// ---------------------------------------------------------------------------
// バージョン確認
// ---------------------------------------------------------------------------
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
if (!isObj(data) || !isObj(data.meta)) fail('おみくじデータ(meta を持つオブジェクト)ではありません')

const version = data.meta.dataVersion
if (typeof version !== 'number') fail('meta.dataVersion が数値ではありません')
if (version >= TO_VERSION) fail(`すでに変換済みです(dataVersion: ${version})`)
if (version < FROM_VERSION) {
  fail(`このツールは dataVersion ${FROM_VERSION} 用です(入力: ${version})。先にアプリで読み込める形式へ変換してください`)
}

// ---------------------------------------------------------------------------
// 変換
// ---------------------------------------------------------------------------
data.assets = isObj(data.assets) ? data.assets : {}
data.assets.scenarios = isObj(data.assets.scenarios) ? data.assets.scenarios : {}
const scenarios = data.assets.scenarios
const mikuji = isObj(data.assets.mikuji) ? data.assets.mikuji : {}

const has = (key) => Object.prototype.hasOwnProperty.call(scenarios, key)
const bySignature = new Map()
const newId = () => randomBytes(16).toString('base64url')
const now = new Date().toISOString()
let order = Math.max(-1, ...Object.values(scenarios).map((s) => Number(s?.order) || 0)) + 1

let convertedItems = 0
let createdScenarios = 0

/** steps を assets.scenarios に登録して key を返す(同一内容なら再利用) */
function extractScenario(steps, preferredKey, item) {
  const signature = JSON.stringify(steps)
  const found = bySignature.get(signature)
  if (found) return found

  let key = preferredKey
  while (has(key)) key += '_'

  scenarios[key] = {
    id: newId(),
    key,
    name: typeof item.name === 'string' ? item.name : '',
    description: typeof item.description === 'string' ? item.description : '',
    createdAt: item.createdAt ?? now,
    updatedAt: now,
    order: order++,
    isEnabled: true,
    tagColor: 'primary',
    tags: [],
    steps,
  }
  bySignature.set(signature, key)
  createdScenarios++
  return key
}

for (const [boxKey, box] of Object.entries(mikuji)) {
  if (!isObj(box) || !Array.isArray(box.omikuji)) continue

  box.omikuji = box.omikuji.map((item, i) => {
    if (!isObj(item)) return item
    // control アイテム、変換済み(stepKey あり・steps なし)はそのまま
    if (item.kind === 'control') return item
    if (typeof item.stepKey === 'string' && !('steps' in item)) return item

    const steps = Array.isArray(item.steps) ? item.steps : []
    const stepKey = extractScenario(steps, `${boxKey}_${item.key || i + 1}`, item)

    // steps を取り除き、stepKey を入れる(プロパティの並びは kind の次)
    const { steps: _removed, kind, ...rest } = item
    convertedItems++
    return { kind: kind ?? 'steps', stepKey, ...rest }
  })
}

data.meta.dataVersion = TO_VERSION

// ---------------------------------------------------------------------------
// 書き出し
// ---------------------------------------------------------------------------
const outputPath = outputArg
  ? resolve(outputArg)
  : join(dirname(inputPath), `${basename(inputPath, extname(inputPath))}.v1004${extname(inputPath)}`)
if (outputPath === inputPath) fail('入力と同じファイルには書き出せません')

let result
if (jsMatch) {
  result = text.replace(JS_PATTERN, (_, head, __, tail) => `${head}${JSON.stringify(data, null, 2)}${tail}`)
} else {
  const indent = /^\s*\{\s*\n/.test(text) ? 2 : 0 // 元が整形済みなら整形して出す
  result = JSON.stringify(data, null, indent) + (text.endsWith('\n') ? '\n' : '')
}
writeFileSync(outputPath, result, 'utf-8')

console.log(`変換しました: ${outputPath}`)
console.log(`  dataVersion      : ${version} -> ${TO_VERSION}`)
console.log(`  変換したアイテム : ${convertedItems}`)
console.log(`  生成したシナリオ : ${createdScenarios}(同一内容は ${convertedItems - createdScenarios} 件を共有)`)
