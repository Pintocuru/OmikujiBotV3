#!/usr/bin/env node
// Scenario / ScenarioStep 改名の機械的な部分を一括で行うスクリプト(A2〜A5 の一部 + C2/C3 の一部)
// 使い方(リポジトリのルートで):
//   node migrate-scenario.mjs --dry   # 何も書き換えず、ヒット件数だけ表示
//   node migrate-scenario.mjs         # 実行(git mv + 文字列置換)
// 実行後: npm run tsc / npm run lint / migrate-leftovers.txt を確認。不要になったらこのファイルは削除する。
// 文字コードは UTF-8、改行コードは変更しない。v2 マイグレーション(src/common/migrations/v2/)は対象外。
import { execSync } from 'node:child_process'
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 1 << 28 })

// ---------- 1. ファイル・フォルダの移動 ----------
const A = 'src/editor/assets'
const S = `${A}/ScenarioStep`
const moves = [
  [`${A}/PostFlow`, S],
  [`${S}/PostFlowsEditor.vue`, `${S}/ScenarioStepsEditor.vue`],
  [`${S}/actions`, `${S}/scenarioCall`],
  [`${S}/scenarioCall/ActionSetSettings.vue`, `${S}/scenarioCall/ScenarioCallSettings.vue`],
  [`${S}/scenarioCall/ActionSetValidator.ts`, `${S}/scenarioCall/ScenarioValidator.ts`],
  [`${S}/items/PostActionItem.vue`, `${S}/items/ScenarioStepItem.vue`],
  [`${S}/items/usePostActionItem.ts`, `${S}/items/useScenarioStepItem.ts`],
  [`${S}/items/postActionKinds.ts`, `${S}/items/scenarioStepKinds.ts`],
  [`${S}/items/createDefaultAction.ts`, `${S}/items/createDefaultStep.ts`],
  [`${S}/tooltab/PostActionsTabs.vue`, `${S}/tooltab/ScenarioStepTabs.vue`],
  [`${S}/tooltab/PostActionRow.vue`, `${S}/tooltab/ScenarioStepRow.vue`],
  [`${S}/tooltab/OmikujiItemToolbar.vue`, `${S}/tooltab/ScenarioStepToolbar.vue`],
  [`${S}/composables/usePostActionsTab.ts`, `${S}/composables/useScenarioStepTabs.ts`],
  [`${S}/preview/PostActionPreview.vue`, `${S}/preview/ScenarioStepPreview.vue`],
  [`${A}/actions`, `${A}/scenarios`],
  [`${A}/scenarios/ActionsEditor.vue`, `${A}/scenarios/ScenariosEditor.vue`],
  ['src/editor/apps/appItems/preview/ActionSetPreview.vue', 'src/editor/apps/appItems/preview/ScenarioPreview.vue'],
  ['src/engine/OmikujiResult/FlowCallExpander.ts', 'src/engine/OmikujiResult/ScenarioCallExpander.ts'],
  ['src/engine/OmikujiResult/PostActionsHandler.ts', 'src/engine/OmikujiResult/ScenarioStepHandler.ts'],
  [
    'src/editor/helpers/CharacterChanger/composables/usePostActionCharacters.ts',
    'src/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters.ts',
  ],
  ['src/games/scripts/game/GoogolClover/sub/postActionBuilder.ts', 'src/games/scripts/game/GoogolClover/sub/stepBuilder.ts'],
  ['src/maps/OmikujiData/assets/PostFlowKindMap.ts', 'src/maps/OmikujiData/assets/ScenarioStepKindMap.ts'],
  ['src/i18n/editor/assets/PostFlow.ts', 'src/i18n/editor/assets/ScenarioStep.ts'],
]
console.log(`## 移動 ${DRY ? '(dry)' : ''}`)
for (const [from, to] of moves) {
  const exists = fs.existsSync(from)
  console.log(`${exists ? 'mv  ' : 'skip'} ${from} -> ${to}`)
  if (exists && !DRY) sh(`git mv "${from}" "${to}"`)
}

// ---------- 2. 文字列置換 ----------
const w = (from, to, extra = {}) => ({ re: new RegExp(`\\b${from}\\b`, 'g'), to, ...extra })
const lit = (from, to, extra = {}) => ({ re: new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to, ...extra })
const I18N_STEP = /i18n\/editor\/assets\/(PostFlow|ScenarioStep)\.ts$/
const I18N_MAPS = /i18n\/editor\/OmikujiDataMaps\.ts$/
const I18N_APPITEMS = /i18n\/editor\/apps\/AppItemsCharacters\.ts$/
const I18N_CATEGORY = /i18n\/editor\/category\/NavigationSidebar(Categories|Presets)Messages\.ts$/
const I18N_KEYEDIT = /i18n\/editor\/helpers\/keyEditorMessages\.ts$/
const STEP_DIR = /editor\/assets\/(PostFlow|ScenarioStep)\//

const RULES = [
  // --- ファイル限定(i18n のキー宣言)。必ずグローバル規則より先 ---
  { scope: I18N_STEP, re: /\bpostFlow: \{/g, to: 'scenarioStep: {', expect: 2 },
  { scope: I18N_STEP, re: /\bactionSet(?=: )/g, to: 'scenarioCall', expect: 4 },
  { scope: I18N_STEP, re: /\bactionItem: \{/g, to: 'stepItem: {', expect: 2 },
  { scope: I18N_STEP, re: /\bactionPreview: \{/g, to: 'stepPreview: {', expect: 2 },
  { scope: I18N_STEP, re: /\bflowsEditor: \{/g, to: 'stepsEditor: {', expect: 2 },
  { scope: I18N_STEP, ...lit('PostActionがありません', 'ステップがありません'), expect: 1 },
  { scope: I18N_STEP, ...lit('No PostActions', 'No steps'), expect: 1 },
  { scope: I18N_STEP, ...lit('Add the first action', 'Add the first step'), expect: 1 },
  { scope: I18N_STEP, ...lit('PostActions を JSON としてクリップボードにコピーします', 'ステップを JSON としてクリップボードにコピーします'), expect: 1 },
  { scope: I18N_STEP, ...lit('クリップボードの JSON を PostActions として読み込みます', 'クリップボードの JSON をステップとして読み込みます'), expect: 1 },
  { scope: I18N_STEP, ...lit('Copy PostActions to the clipboard as JSON', 'Copy steps to the clipboard as JSON'), expect: 1 },
  { scope: I18N_STEP, ...lit('Load JSON from the clipboard as PostActions', 'Load JSON from the clipboard as steps'), expect: 1 },
  { scope: I18N_STEP, ...lit('The action set is empty', 'The scenario is empty'), expect: 1 },
  { scope: I18N_STEP, ...lit('Action set', 'Scenario'), expect: 2 },
  { scope: I18N_STEP, ...lit('Action type', 'Step type'), expect: 1 },
  { scope: I18N_STEP, ...lit('Runs the action below after this many seconds', 'Runs the step below after this many seconds'), expect: 1 },
  { scope: I18N_STEP, ...lit('No preview for this action', 'No preview for this step'), expect: 1 },
  { scope: I18N_STEP, ...lit('(Invalid action)', '(Invalid step)'), expect: 1 },

  { scope: I18N_MAPS, re: /\bpostFlow: \{/g, to: 'steps: {', expect: 2 },
  { scope: I18N_MAPS, re: /(steps: \{\s*label: )'シナリオ'/g, to: "$1'ステップ実行'", expect: 1 },
  { scope: I18N_MAPS, ...lit('登録済みのシナリオ（一連の処理プリセット）を呼び出します', '登録済みのシナリオ（名前を付けたステップの並び）を呼び出します'), expect: 1 },
  { scope: I18N_MAPS, ...lit('Calls a registered action set (a preset of a series of actions)', 'Calls a registered scenario (a named sequence of steps)'), expect: 1 },
  { scope: I18N_MAPS, ...lit('when the action runs', 'when the step runs'), expect: 1 },
  { scope: I18N_MAPS, ...lit("label: 'Action set'", "label: 'Scenario'"), expect: 1 },
  { scope: I18N_MAPS, ...lit("label: 'BOT action'", "label: 'Run steps'"), expect: 1 },

  { scope: I18N_APPITEMS, re: /\bactionSet: \{/g, to: 'scenario: {', expect: 2 },
  { scope: I18N_APPITEMS, ...lit('Action sets', 'Scenarios'), expect: 1 },
  { scope: I18N_APPITEMS, ...lit('No actions set', 'No scenarios set'), expect: 1 },

  { scope: I18N_CATEGORY, re: /^([ \t]+)actions: \{/gm, to: '$1scenarios: {', expect: 4 },
  { scope: I18N_KEYEDIT, re: /^([ \t]+)actions: '/gm, to: "$1scenarios: '", expect: 2 },
  { scope: I18N_KEYEDIT, ...lit('投稿フロー', 'ステップ') },
  { scope: I18N_KEYEDIT, ...lit('Post flows that call this action set', 'Steps that call this scenario'), expect: 1 },

  // --- フォルダ内の相対 import ---
  { scope: STEP_DIR, re: /(['"])(\.{1,2})\/actions\//g, to: '$1$2/scenarioCall/' },

  // --- i18n キー(具体 -> 一般) ---
  lit('postFlow.actionSet.', 'scenarioStep.scenarioCall.'),
  lit('postFlow.actionItem.', 'scenarioStep.stepItem.'),
  lit('postFlow.actionPreview.actionSet', 'scenarioStep.stepPreview.scenarioCall'),
  lit('postFlow.actionPreview.', 'scenarioStep.stepPreview.'),
  lit('postFlow.flowsEditor.', 'scenarioStep.stepsEditor.'),
  lit('appPreview.actionSet.', 'appPreview.scenario.'),
  { re: /(['"`])postFlow\./g, to: '$1scenarioStep.' },

  // --- パス ---
  lit('PostFlow/actions/', 'ScenarioStep/scenarioCall/'),
  { re: /assets\/PostFlow(?=['"/])/g, to: 'assets/ScenarioStep' },
  lit('assets/actions/', 'assets/scenarios/'),
  lit('m_assets_PostFlow', 'm_assets_ScenarioStep'),

  // --- 識別子 ---
  w('FlowCallExpander', 'ScenarioCallExpander'),
  w('expandSingleFlowCall', 'expandSingleScenarioCall'),
  w('PostActionsHandler', 'ScenarioStepHandler'),
  w('postActionsHandler', 'scenarioStepHandler'),
  w('PostFlowsEditor', 'ScenarioStepsEditor'),
  w('PostFlowEditor', 'ScenarioStepsEditor'),
  w('PostActionItem', 'ScenarioStepItem'),
  w('usePostActionItem', 'useScenarioStepItem'),
  w('PostActionsTabs', 'ScenarioStepTabs'),
  w('usePostActionsTab', 'useScenarioStepTabs'),
  w('PostActionRow', 'ScenarioStepRow'),
  w('PostActionPreview', 'ScenarioStepPreview'),
  w('postActionKinds', 'scenarioStepKinds'),
  w('actionSchemaMap', 'stepSchemaMap'),
  w('createDefaultAction', 'createDefaultStep'),
  w('ActionSetSettings', 'ScenarioCallSettings'),
  w('ActionSetValidator', 'ScenarioValidator'),
  w('ActionSetPreview', 'ScenarioPreview'),
  w('ActionsEditor', 'ScenariosEditor'),
  w('OmikujiItemToolbar', 'ScenarioStepToolbar'),
  w('usePostActionCharacters', 'useScenarioStepCharacters'),
  w('PostFlowKindMap', 'ScenarioStepKindMap'),
  { re: /\bpostFlowKind/g, to: 'scenarioStepKind' }, // postFlowKindMap も含む
  w('postFlowMessages', 'scenarioStepMessages'),
  w('availableActionSets', 'availableScenarios'),
  w('updateActionSetReferences', 'updateScenarioReferences'),
  w('updateActionAssetPostFlows', 'updateScenarioAssetSteps'),
  w('updateMikujiPostFlows', 'updateMikujiSteps'),
  w('updateAllPostFlows', 'updateAllSteps'),
  w('PostFlowUpdater', 'StepUpdater'),
  w('PostFlowInput', 'StepsInput'),
  w('updatePostFlows', 'updateSteps'),
  w('updatePostActions', 'updateSteps'),
  w('runPostFlows', 'runSteps'),
  w('remapPostFlows', 'remapSteps'),
  w('processPostActions', 'processSteps'),
  w('createPostActions', 'createSteps'),
  w('buildPostActions', 'buildSteps'),
  w('PostActionBuildParams', 'StepBuildParams'),
  w('postActionBuilder', 'stepBuilder'),
  w('targetActionSet', 'targetScenario'),
  w('postFlows', 'steps'),
  w('postActions', 'steps'),
  w('actionItem', 'step'),
  w('flowSets', 'scenarios'),
  w('actionSets', 'scenarios'),
  w('actionSet', 'scenario'),

  // --- UI 文言 ---
  lit('アクションセット', 'シナリオ'),
  lit('BOTアクション', 'ステップ実行'),
]

const files = sh('git ls-files -z')
  .split('\0')
  .filter(Boolean)
  .filter((f) => /^(src|server|tools|packages)\//.test(f))
  .filter((f) => /\.(ts|vue|js|mjs|cjs|tsx|jsx)$/.test(f))
  .filter((f) => !f.startsWith('src/common/migrations/v2/'))

const hits = RULES.map(() => 0)
let changedFiles = 0
for (const f of files) {
  if (!fs.existsSync(f)) continue // dry 時、移動前のパス差を吸収
  const before = fs.readFileSync(f, 'utf8')
  let text = before
  RULES.forEach((r, i) => {
    if (r.scope && !r.scope.test(f)) return
    const n = (text.match(r.re) || []).length
    if (n) {
      hits[i] += n
      text = text.replace(r.re, r.to)
    }
  })
  if (text !== before) {
    changedFiles++
    if (!DRY) fs.writeFileSync(f, text, 'utf8')
  }
}

console.log(`\n## 置換 ${DRY ? '(dry)' : ''}: ${changedFiles} ファイル`)
RULES.forEach((r, i) => {
  if (r.expect !== undefined && hits[i] !== r.expect) {
    console.log(`⚠ 期待 ${r.expect} 件 / 実際 ${hits[i]} 件: ${r.re}`)
  }
})

// ---------- 3. 旧名称の残り(UTF-8 で出力) ----------
const LEFT = /ActionSet|actionSet|PostFlow|postFlow|PostAction(?!Name)|postAction|flowCall|FlowCall|flowSets|actionItem|assets\.actions|'actions'|アクションセット|BOTアクション|ProcessedPostAction/
const out = []
for (const f of files) {
  if (!fs.existsSync(f)) continue
  fs.readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (LEFT.test(line)) out.push(`${f}:${i + 1}: ${line.trim()}`)
    })
}
if (!DRY) fs.writeFileSync('migrate-leftovers.txt', out.join('\n') + '\n', 'utf8')
console.log(`\n## 旧名称の残り: ${out.length} 行${DRY ? '(dry では出力しない)' : ' -> migrate-leftovers.txt'}`)
