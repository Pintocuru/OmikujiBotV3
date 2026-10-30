#!/usr/bin/env node
// 第2段: C4(v2ToV3.ts の出力側)/ C4b(旧名称の v3 データを検出して読み込みを止める)/ コメントの残り
// 使い方: node migrate-scenario-2.mjs --dry  →  node migrate-scenario-2.mjs
// 期待件数と違う行は ⚠ で出る。src/types は触らない。改行コードは変えない。
import fs from 'node:fs'

const DRY = process.argv.includes('--dry')
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const lit = (from, to, expect = 1) => ({ re: new RegExp(esc(from), 'g'), to, expect })
const w = (from, to, expect) => ({ re: new RegExp(`\\b${from}\\b`, 'g'), to, expect })

const EDITS = {
  // ---- C4: v2ToV3.ts(出力側のみ。入力側の v2 名称 actionSets / postActions / actionSetKeys / actionType は変更しない) ----
  'src/common/migrations/v2/v2ToV3.ts': [
    { re: /^\/\/ PostFlow(?=\r?\n)/m, to: '// ScenarioStep', expect: 1 },
    lit("kind: 'postFlow'", "kind: 'steps'"),
    lit('postFlows: migratePostFlows(old)', 'steps: migrateSteps(old)'),
    lit('postFlows: migratePostFlows(a)', 'steps: migrateSteps(a)'),
    w('migratePostFlows', 'migrateSteps', 1), // 定義(1)のみ。呼び出し側は上で置換済み
    w('migratePostFlow', 'migrateStep', 2), // 定義 + .map(...)
    lit('残すと postFlows 全体が catch される', '残すと steps 全体が catch される'),
    lit('v3 の gameScript PostFlow', 'v3 の gameScript ステップ'),
    lit('（ActionSet の1形態）', '（v2 の actionSets の1形態）'),
    lit('特殊動作は ActionSet では表現しない', '特殊動作はシナリオでは表現しない'),
    lit('actions: migrateRecord(old.actionSets', 'scenarios: migrateRecord(old.actionSets'),
    lit("actionSets: 'actions'", "actionSets: 'scenarios'"),
  ],

  // ---- C4b: 旧名称で保存された v3 データの検出 ----
  'src/common/migrations/index.ts': [
    {
      re: /(const LEGACY_DATA_VERSION_LIMIT = 3(\r?\n))/,
      to:
        "$1$2/**\n * Scenario / ScenarioStep への改名(assets.actions -> scenarios, postFlows -> steps など)を含む dataVersion。\n * v3 以上でこれ未満のデータは旧名称のまま。読み込むと steps が空になるため、読み込みを止める。\n * package.json の data_version と同じか、それ以下にする。\n */\nconst SCENARIO_RENAME_DATA_VERSION = 3.0000001003\n",
      expect: 1,
    },
    {
      re: /(\r?\n)(  \/\/ まずは生データをそのまま使う)/,
      to:
        "$1  // Scenario / ScenarioStep 改名前の v3 データ(旧名称のままでは steps が空になる)\n  if (incomingVersion >= LEGACY_DATA_VERSION_LIMIT && incomingVersion < SCENARIO_RENAME_DATA_VERSION) {\n    const msg = `このデータは旧名称の v${incomingVersion} 形式です。\\n読み込むには、assets.actions → scenarios などへの名称変換が必要です。`\n    swalToast.error({ title: '読み込みエラー', text: msg })\n    throw new Error(msg)\n  }\n$1$2",
      expect: 1,
    },
  ],

  // ---- コメントの残り(src/types は対象外) ----
  'src/common/buildValidation/validateAgainstBuild.ts': [lit("postFlow(kind: 'gameScript')", "step(kind: 'gameScript')")],
  'src/editor/assets/ScenarioStep/ScenarioStepsEditor.vue': [
    lit('PostActionsタブエディター', 'ステップタブエディター'),
    lit('PostActionタブの内容', 'ステップタブの内容'),
  ],
  'src/editor/assets/ScenarioStep/scenarioCall/useWeightValueManagement.ts': [
    lit('ActionSetとPlaceholder両方で使用可能', 'scenarioCall と Placeholder 両方で使用可能'),
    lit('（ActionSet用）', '（scenarioCall用）', 2),
  ],
  'src/editor/assets/ScenarioStep/tooltab/ScenarioStepTabs.vue': [lit('PostActionタブ（', 'ステップタブ（')],
  'src/editor/assets/ScenarioStep/tooltab/ScenarioStepToolbar.vue': [lit('PostFlowType[]', 'ScenarioStepType[]')],
  'src/editor/assets/mikuji/item/OmikujiItemEditor.vue': [lit('<!-- postFlow 編集 -->', '<!-- steps 編集 -->')],
  'src/editor/helpers/CharacterChanger/composables/useCharacterStats.ts': [lit('全 PostFlow 配列', '全ステップ配列')],
  'src/editor/helpers/IconKeyChanger/composables/useIconKeyStats.ts': [lit('全 PostFlow 配列', '全ステップ配列')],
  'src/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters.ts': [
    lit('PostFlow内のキャラクター情報', 'ステップ内のキャラクター情報'),
    lit('PostFlow が参照している', 'ステップが参照している'),
    lit('PostFlow 配列を更新', 'ステップ配列を更新'),
  ],
  'src/editor/helpers/KeyEditor/composables/useKeyEditor.ts': [lit('mikuji → postFlow の message', 'mikuji → steps の message')],
  'src/editor/helpers/KeyEditor/keyUpdateReferences.ts': [
    lit('内の postFlow アイテムの steps 更新', "内の kind が 'steps' のアイテムの steps 更新"),
    lit('actions（ActionSet）の steps 更新', 'scenarios（Scenario）の steps 更新'),
  ],
  'src/editor/helpers/shared/useMappingUpdater.ts': [
    lit('マッピングを postFlow に適用する関数', 'マッピングをステップに適用する関数'),
    lit('postFlow 種別のアイテムのみ更新', "kind が 'steps' のアイテムのみ更新"),
  ],
  'src/editor/presets/helpers.ts': [lit('postFlow を1件実行するだけ', 'ステップを1件実行するだけ')],
  'src/editor/ui/uiEditorRegistry.ts': [lit('PostFlow の message で', 'ScenarioStep の message で', 2)],
  'src/engine/ContentPlaceholder/processor.ts': [lit('PostAction配列のプレースホルダー', 'ステップ配列のプレースホルダー')],
  'src/engine/DisplayVariable/DisplayVariableResolver.ts': [lit('PostAction配列のプレースホルダー', 'ステップ配列のプレースホルダー')],
  'src/engine/OmikujiResult/BotMessageHelpers.ts': [lit('PostFlowMessage から', 'ScenarioStepMessage から')],
  'src/engine/OmikujiResult/ScenarioCallExpander.ts': [lit('flowCallなら呼び出して展開', 'scenarioCallなら呼び出して展開')],
  'src/games/scripts/game/GoogolClover/execute.ts': [lit('PostActionの構築', 'ステップの構築')],
  'src/games/scripts/game/GoogolClover/sub/stepBuilder.ts': [
    lit('PostActionの構築ロジック', 'ステップの構築ロジック'),
    lit('PostActionを構築', 'ステップを構築'),
  ],
  'src/generator/scripts/EventProcess/CommentProcessor.ts': [lit('(postFlow のみ到達)', "(kind が 'steps' のみ到達)")],
  'src/generator/scripts/EventProcess/OmikujiControlProcessor.ts': [
    lit('postFlow 以外の kind', "'steps' 以外の kind"),
    lit('@returns postFlow なら null', "@returns 'steps' なら null"),
  ],
  'src/generator/scripts/EventProcess/OmikujiProcessor.ts': [lit('抽選済みの postFlow アイテム', "抽選済みの kind が 'steps' のアイテム")],
  'src/ui/CharacterStage/editor/CharacterStagePreview.vue': [
    lit('PostFlow のプレビュー用', 'ScenarioStep のプレビュー用'),
    lit('PostFlow の message から渡る', 'ScenarioStep の message から渡る'),
  ],
  'src/ui/GameRanking/scripts/services/MessageService.ts': [lit('PostActionType型のメッセージを作成', 'ScenarioStepType型のメッセージを作成')],
  'tools/JsonMerge/remaps.ts': [
    lit('PostFlow の配列に対して', 'ステップの配列に対して'),
    lit('と assets.actions', 'と assets.scenarios'),
  ],
}

let bad = 0
for (const [file, rules] of Object.entries(EDITS)) {
  if (!fs.existsSync(file)) {
    console.log(`⚠ ファイルなし: ${file}`)
    bad++
    continue
  }
  let text = fs.readFileSync(file, 'utf8')
  for (const r of rules) {
    const g = r.re.flags.includes('g') ? r.re : new RegExp(r.re.source, r.re.flags + 'g')
    const n = (text.match(g) || []).length
    if (n !== r.expect) {
      console.log(`⚠ ${file}: 期待 ${r.expect} 件 / 実際 ${n} 件: ${r.re}`)
      bad++
    }
    if (n) text = text.replace(r.re, r.to)
  }
  if (!DRY) fs.writeFileSync(file, text, 'utf8')
}
console.log(`\n完了${DRY ? '(dry)' : ''}。⚠ ${bad} 件`)
