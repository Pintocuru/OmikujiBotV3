# 命名体系の改名 作業指示書(Scenario / ScenarioStep)

## 0. 前提

- 基準は `docs/conventions/naming.md`(§6 用語表・§7 ルール・§8.1 旧名称表。`naming-glossary.patch` 適用後)。
- コード変更は patch で提出し、**commit / push はしない**。
- 変更しない: `delaySeconds` / `Mikuji*` / `Syoken` / `gameScript` / `callKeys`。
- ロジック・表示内容は変えない。名称だけを変える。
- 保存データの変換は α 版のため、`v2ToV3.ts` の上書きと手作業で行う(§ Phase C4・D)。

## 1. 全体の順序

| Phase | 担当             | 内容                                          | 前提         |
| ----- | ---------------- | --------------------------------------------- | ------------ |
| 0     | 手動             | 準備(ブランチ・ベースライン・naming.md)       | –            |
| A     | エージェント     | 型に触れない改名(UI 文言・ファイル名・変数名) | 0            |
| B     | **手動(VSCode)** | `src/types` の改名と保存データの名称変更      | A を適用済み |
| C     | エージェント     | B の `tsc` エラー追従・残りの改名・移行コード | B            |
| D     | 手動             | v3 データ約5件の変換と動作確認                | C            |
| E     | エージェント     | 残存検索・ログ・naming.md の整合              | D            |

**順序の理由**: 保存データに影響する名称(型・kind の値・プロパティ・カテゴリ)は B で1回だけ変える。A を先に済ませておくと、B の差分が型の改名だけになり、`tsc` の出力を C の入力にそのまま使える。

## 2. Phase 0(手動)

1. 作業ブランチを切る。
2. `naming-glossary.patch` を適用する(naming.md §6〜§8)。
3. `npm run tsc 2>&1 | tee tsc-baseline.txt` と `npm run lint` を実行し、ベースラインを残す(既存エラーは今回の対象外)。

## 3. Phase A(エージェント): 型に触れない改名

1 patch = 1 項目。各 patch で、旧名称の全数検索(src・server・tools・docs・packages。結果 0 件が目標)と `AGENTS.md` 末尾への作業ログ追記を行う。

| patch | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1    | **UI 文言のみ**(i18n のキーは変えない)。「アクションセット」→「シナリオ」、「アクション」「PostAction」→「ステップ」、「BOTアクション」→「ステップ実行」。対象: `CategoryMap`、`OmikujiDataMaps`(`postFlowKind` / `omikujiItemKind`)、`i18n/editor/assets/PostFlow.ts`(ja/en)、`CategoryMap` の説明文から「プリセット」を外す、エンジン内のシステムメッセージ(`FlowCallExpander` の「アクションセット…」など)                                                                                                                                           |
| A2    | `editor/assets/PostFlow/` → `editor/assets/ScenarioStep/`。`PostFlowsEditor` → `ScenarioStepsEditor`、`PostActionItem` → `ScenarioStepItem`、`PostActionsTabs` → `ScenarioStepTabs`、`usePostActionsTab` → `useScenarioStepTabs`、`usePostActionItem` → `useScenarioStepItem`、`postActionKinds.ts` → `scenarioStepKinds.ts`、`createDefaultAction.ts` → `createDefaultStep.ts`。`PostFlow/actions/`(`ActionSetSettings.vue` ほか)→ `ScenarioStep/scenarioCall/`(`ScenarioCallSettings.vue` など)。`OmikujiItemToolbar.vue` → `ScenarioStepToolbar.vue` |
| A3    | `editor/assets/actions/ActionsEditor.vue` → `editor/assets/scenarios/ScenariosEditor.vue`。`ActionSetPreview.vue` → `ScenarioPreview.vue`(`ActionSetValidator.ts` → `ScenarioValidator.ts`)                                                                                                                                                                                                                                                                                                                                                             |
| A4    | エンジンのクラス・ファイル名。`FlowCallExpander` → `ScenarioCallExpander`、`PostActionsHandler` → `ScenarioStepHandler`                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| A5    | 変数名・コメント。ステップ 1 件の `actionItem` / `action` / `flow` → `step`、配列 → `steps`、`flowSets` → `scenarios`。型・プロパティ名はまだ触らない                                                                                                                                                                                                                                                                                                                                                                                                   |

**制約**: 型のエクスポート名・プロパティ名(`PostFlowType` / `postFlows` など)と、保存データに出る値は A では変えない。

## 4. Phase B(手動 / VSCode): `src/types` の改名

1 commit にまとめる。順序は「ファイル名 → エクスポート名 → プロパティ → リテラル」。シンボルは F2(Rename Symbol)で参照ごと追従する。**文字列リテラルは F2 では追従しない**ため、最後に検索して直す。

### B1 ファイル名(VSCode でリネーム。import は自動更新)

- `assets/ActionSetSchema.ts` → `ScenarioSchema.ts`
- `assets/PostFlowSchema.ts` → `ScenarioStepSchema.ts`
- `assets/OmikujiItemSchema.ts` はそのまま

### B2 エクスポート名(F2)

| 旧                                                                     | 新                                                                                                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `ActionSetSchema` / `ActionSetType`                                    | `ScenarioSchema` / `ScenarioType`                                                                 |
| `postFlowKinds` / `PostFlowKindSchema` / `PostFlowKind`                | `scenarioStepKinds` / `ScenarioStepKindSchema` / `ScenarioStepKind`                               |
| `PostFlowBaseSchema`                                                   | `ScenarioStepBaseSchema`                                                                          |
| `PostFlowMessageSchema` / `Type`                                       | `ScenarioStepMessageSchema` / `Type`                                                              |
| `PostFlowSoundSchema` / `Type`                                         | `ScenarioStepSoundSchema` / `Type`                                                                |
| `PostFlowWordPartySchema` / `Type`                                     | `ScenarioStepWordPartySchema` / `Type`                                                            |
| `PostFlowVariableSchema` / `Type`                                      | `ScenarioStepVariableSchema` / `Type`                                                             |
| `PostFlowCallSchema` / `Type`                                          | `ScenarioStepCallSchema` / `Type`(※naming.md §7-10 の例外として、Step 側の名前は `Call` で止める) |
| `PostFlowGameSchema` / `Type`                                          | `ScenarioStepGameScriptSchema` / `Type`                                                           |
| `PostFlowWithMessageType` / `hasPostFlowMessage`                       | `ScenarioStepWithMessageType` / `hasScenarioStepMessage`                                          |
| `PostFlowSchema` / `PostFlowType`                                      | `ScenarioStepSchema` / `ScenarioStepType`                                                         |
| `PostFlowArraySchema`                                                  | `ScenarioStepArraySchema`                                                                         |
| `OmikujiItemPostFlowSchema` / `Type`                                   | `OmikujiItemStepsSchema` / `Type`                                                                 |
| `ProcessedPostAction`(`types/generator/scripts/OmikujiResultTypes.ts`) | `ProcessedStep`(`.action` → `.step`)                                                              |
| `ScriptResult.actions`(`src/games/types/GameScriptTypes.ts`)           | `ScriptResult.steps`                                                                              |

### B3 プロパティ(F2。保存データのキーが変わる)

- `postFlows` → `steps`(`ScenarioSchema` と `OmikujiItemStepsSchema`)

### B4 文字列リテラル(保存データの値が変わる。F2 不可。検索して直す)

- `'flowCall'` → `'scenarioCall'`
- `'postFlow'`(`omikujiItemKinds`、`OmikujiItemKind`)→ `'steps'`
- `assetCategory` の `'actions'` → `'scenarios'`、および `AssetCategoryDataMap` / `AssetCategorySchemaMap` / `AssetCategorySchema` のキー `actions` → `scenarios`
- `settings.editor.initialCategory` は `assetCategory` から導出されるため自動で追従する

### B5 確認

1. `npm run tsc 2>&1 | tee tsc-after-types.txt`
2. `git diff --stat` で、変更が `src/types`・`src/games/types` に収まり、他は import 追従だけであることを確認する。
3. `tsc-after-types.txt` と `tsc-baseline.txt` をエージェントへ渡す。

## 5. Phase C(エージェント): B の追従

入力: `tsc-baseline.txt` / `tsc-after-types.txt`。**`src/types` は B の内容を超えて変更しない**。

| patch | 内容                                                                                                                                                                                                                                                                               |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1    | `tsc` エラーの追従(型名・プロパティ・`ScriptResult.steps`・`ProcessedStep`)。baseline との差分がゼロになるまで。`'flowCall'` / `'actions'` / `'postFlow'` / `postFlows` の残りも検索して直す                                                                                       |
| C2    | i18n キーの改名。`postFlow.*` → `scenarioStep.*`、`postFlow.actionSet.*` → `scenarioStep.scenarioCall.*`、`mapText.postFlowKind` → `mapText.scenarioStepKind`、`categorySections` など `actions` 関連のキー(ja / en 同時)                                                          |
| C3    | `src/editor/presets`(`actionPresets` → `scenarioPresets`、category `'actions'` → `'scenarios'`、preset 名)、`CategorySectionMap` / `CategoryMap` / `staticSectionPreviewMap` の `actions` キー                                                                                     |
| C4    | `src/common/migrations/v2/v2ToV3.ts` の上書き: 出力を `assets.scenarios` / `steps` / `scenarioCall` / `OmikujiItem kind:'steps'` に変更、`CATEGORY_RENAME` の `actionSets` → `scenarios`。v2 側の入力名(`actionSets` / `postActions` / `actionSetKeys` / `actionType`)は変更しない |
| C4b   | 推奨: `package.json` の `data_version` を 1 つ上げる。`migrations/index.ts` で「dataVersion が 3 以上かつ現行未満」を検出したら、`swalToast.error` で旧名称のデータであることを知らせて読み込みを止める(黙って空になるのを防ぐ)                                                    |
| C5    | `src/games/scripts` 8 本と `GameScriptsHandler` の `actions` → `steps`(挙動は変えない)                                                                                                                                                                                             |

## 6. Phase D(手動)

1. v3 データ約5件を新名称に変換する。`assets.actions` → `assets.scenarios`、`postFlows` → `steps`、`kind:'flowCall'` → `'scenarioCall'`、`OmikujiItem` の `kind:'postFlow'` → `'steps'`、`settings.editor.initialCategory:'actions'` → `'scenarios'`、`meta.dataVersion` を新しい値に。
2. v2 のサンプルを 1〜2 件読み込み、`v2ToV3` の変換結果を確認する(シナリオ・ステップ・呼び出しが残ること)。
3. エディターで以下を確認する: シナリオの作成・編集、`scenarioCall` の選択と循環参照警告、おみくじアイテムの「ステップ実行」、`JsonMerge`、プリセット作成。
4. ジェネレーターで、シナリオ呼び出しを含むおみくじが動くことを確認する。

## 7. Phase E(エージェント)

1. 旧名称の全数検索(下記)。結果 0 件を確認し、残るものは理由を報告する。
2. `naming.md`: §7-10 の例外(`ScenarioStepCallType`)を追記し、§8.1 は「移行完了」と注記する。
3. `AGENTS.md` の作業ログを整理する。
4. `npm run lint` / `npm run tsc` を通す(baseline と同じエラー数か、それ以下)。

### 旧名称の検索語

`ActionSet` / `actionSet` / `PostFlow` / `postFlow` / `postFlows` / `PostAction` / `postAction` / `flowCall` / `FlowCall` / `flowSets` / `actionItem` / `'actions'` / `assets.actions` / `アクションセット` / `BOTアクション` / `ProcessedPostAction` / `ScriptResult` の `actions`

除外してよいもの: `v2ToV3.ts` の入力側(v2 のキー名)、`omikujiItemKind` 以外の別概念の `action`(例: `server/api/actions.ts` の API action)、`AGENTS.md` 過去ログ。

## 8. 各エージェント patch の共通ルール

- 1 patch = 1 項目。patch ごとに旧新名称の全数検索結果を報告する。
- 変更しない: `delaySeconds` / `Mikuji*` / `Syoken` / `gameScript` / `callKeys`、ロジック、表示内容。
- 範囲外の問題を見つけたら直さず、`docs/conventions/naming.md` §8.2 に追記する(追記のみ。§8.2 の対応は今回の改名後)。
- `npm run lint` と `npm run tsc` を実行し、baseline との差分を報告する。実行できない場合は「検証未実施」と明記する。
- 未確認の事項は推測で補わず「未確認」と書く。
