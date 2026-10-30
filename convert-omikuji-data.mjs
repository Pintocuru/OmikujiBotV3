#!/usr/bin/env node
// 旧名称の v3 データ(.json / server/omikujiData.js)を新名称に変換する(Phase D-1 用)
//   assets.actions -> assets.scenarios / postFlows -> steps / kind 'postFlow' -> 'steps' / 'flowCall' -> 'scenarioCall'
//   settings.editor.initialCategory 'actions' -> 'scenarios'
// 使い方: node convert-omikuji-data.mjs [--dry] [--data-version=3.0000001003] <file>...
// .js は `const omikujiData = {...};` の1行形式を想定。何度実行しても結果は同じ(冪等)。
import fs from 'node:fs'

const args = process.argv.slice(2)
const DRY = args.includes('--dry')
const verArg = args.find((a) => a.startsWith('--data-version='))
const files = args.filter((a) => !a.startsWith('--'))

/** 並び順を保ったままキー名を変える */
function renameKey(o, from, to) {
  if (!o || typeof o !== 'object' || !Object.hasOwn(o, from) || Object.hasOwn(o, to)) return false
  const entries = Object.entries(o).map(([k, v]) => [k === from ? to : k, v])
  for (const k of Object.keys(o)) delete o[k]
  for (const [k, v] of entries) o[k] = v
  return true
}

function convert(d, stat) {
  const fixSteps = (steps) =>
    (Array.isArray(steps) ? steps : []).forEach((s) => {
      if (s && s.kind === 'flowCall') (s.kind = 'scenarioCall'), stat.flowCall++
    })
  const assets = d.assets ?? {}
  for (const box of Object.values(assets.mikuji ?? {})) {
    for (const item of box?.omikuji ?? []) {
      if (item.kind === 'postFlow') (item.kind = 'steps'), stat.kind++
      if (renameKey(item, 'postFlows', 'steps')) stat.postFlows++
      fixSteps(item.steps)
    }
  }
  if (renameKey(assets, 'actions', 'scenarios')) stat.actions++
  for (const sc of Object.values(assets.scenarios ?? {})) {
    if (renameKey(sc, 'postFlows', 'steps')) stat.postFlows++
    fixSteps(sc.steps)
  }
  const ed = d.settings?.editor
  if (ed && ed.initialCategory === 'actions') (ed.initialCategory = 'scenarios'), stat.category++
  if (verArg && d.meta) d.meta.dataVersion = Number(verArg.split('=')[1])
  return d
}

for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  const stat = { kind: 0, postFlows: 0, flowCall: 0, actions: 0, category: 0 }
  let out
  if (f.endsWith('.js')) {
    const m = src.match(/(const omikujiData = )(\{.*\})(;)/)
    if (!m) { console.log(`⚠ ${f}: 'const omikujiData = {...};' が見つかりません`); continue }
    out = src.replace(m[0], () => m[1] + JSON.stringify(convert(JSON.parse(m[2]), stat)) + m[3])
  } else {
    const indent = /^\{\r?\n( +)"/.exec(src)?.[1]?.length ?? 0
    out = JSON.stringify(convert(JSON.parse(src), stat), null, indent || undefined) + (src.endsWith('\n') ? '\n' : '')
  }
  console.log(`${f}:`, JSON.stringify(stat), out === src ? '(変更なし)' : '')
  if (!DRY && out !== src) fs.writeFileSync(f, out, 'utf8')
}
