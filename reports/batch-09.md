# Batch 09 i18n Audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/assets/scenarios/`
- Files: 11
- Total lines: 754
- Code changes: none

## 対象ファイル

- `src/editor/assets/scenarios/items/useScenarioStepItem.ts` (57 lines)
- `src/editor/assets/scenarios/preview/CommentBubblePreview.vue` (58 lines)
- `src/editor/assets/scenarios/preview/ScenarioStepPreview.vue` (144 lines)
- `src/editor/assets/scenarios/preview/SoundTestButton.vue` (26 lines)
- `src/editor/assets/scenarios/preview/WordPartyTestButton.vue` (35 lines)
- `src/editor/assets/scenarios/scenarioCall/ScenarioCallSettings.vue` (112 lines)
- `src/editor/assets/scenarios/tooltab/DelaySecondsAdjuster.vue` (86 lines)
- `src/editor/assets/scenarios/tooltab/ScenarioStepRow.vue` (33 lines)
- `src/editor/assets/scenarios/tooltab/ScenarioStepTabs.vue` (55 lines)
- `src/editor/assets/scenarios/tooltab/ScenarioStepToolbar.vue` (116 lines)
- `src/editor/assets/scenarios/variable/VariableSettings.vue` (32 lines)

## 調査結果

| ファイルパス:行 | 該当コード（短く） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| — | — | — | — | — |

今回の対象ファイルでは、翻訳漏れとして確定できる箇所は検出されなかった。

## 照合内容

- `ScenarioCallSettings.vue`: `scenarioStep.scenarioCall.*` の参照キーは `src/i18n/editor/assets/scenarios.ts` の ja/en 両方に存在。
- `ScenarioStepPreview.vue`: `scenarioStep.stepPreview.*` の参照キーは ja/en 両方に存在。
- `SoundTestButton.vue` / `WordPartyTestButton.vue`: `scenarioStep.tests.*` は ja/en 両方に存在。
- `DelaySecondsAdjuster.vue`: `scenarioStep.delay.*` は ja/en 両方に存在。
- `ScenarioStepTabs.vue` / `ScenarioStepToolbar.vue`: `scenarioStep.tabs.add` および `scenarioStep.toolbar.*` は ja/en 両方に存在。
- `VariableSettings.vue`: `scenarioStep.variable.label` は ja/en 両方に存在。
- `useScenarioStepItem.ts` / `CommentBubblePreview.vue` / `ScenarioStepRow.vue`: 翻訳対象の表示文言を直接生成していない。
- `WordParty` は機能名として使用されており、翻訳漏れとは判定しない。

## 除外した表記

- `ScenarioStepRow.vue:7` の `s`: 秒を表す国際単位系の記号であり、ロケールに依存しない表記。
- `ScenarioStepPreview.vue` の `WordParty`: 製品機能名。
- `WordPartyTestButton.vue` の `console.error` 日本語文言: 開発者向けログであり、ユーザー向けUI文言ではない。

## 静的解析

未実行。GitHub API による閲覧環境ではリポジトリ内コマンドを実行できないため、ソースと翻訳定義の照合で確認した。
