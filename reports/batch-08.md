# Batch 08 i18n Audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/assets/scenarios/`
- Files: 8
- Total lines: 578
- Code changes: none

## 対象ファイル

- `src/editor/assets/scenarios/ScenarioStepsEditor.vue` (71 lines)
- `src/editor/assets/scenarios/Sounds/SoundSettings.vue` (66 lines)
- `src/editor/assets/scenarios/WordParty/WordPartySettings.vue` (107 lines)
- `src/editor/assets/scenarios/composables/useScenarioStepTabs.ts` (100 lines)
- `src/editor/assets/scenarios/gameScript/GameScriptSettings.vue` (82 lines)
- `src/editor/assets/scenarios/items/ScenarioStepItem.vue` (74 lines)
- `src/editor/assets/scenarios/items/ScenarioStepKindMap.ts` (39 lines)
- `src/editor/assets/scenarios/items/createDefaultStep.ts` (39 lines)

## 調査結果

| ファイルパス:行 | 該当コード | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| — | — | — | — | — |

今回の8ファイルでは、翻訳漏れとして確定できる箇所は検出されなかった。

## 照合内容

- `ScenarioStepsEditor.vue`: `scenarioStep.stepsEditor.empty` / `addFirst` は ja/en 両方に存在。
- `SoundSettings.vue`: `scenarioStep.sound.*` は ja/en 両方に存在。`soundMap` の20キーすべてが `mapText.sound.*` に ja/en 両方で定義されている。
- `WordPartySettings.vue`: `scenarioStep.wordParty.*` は ja/en 両方に存在。`WordParty` / `WordParty ID` は製品・連携機能名および識別子としての表記。
- `GameScriptSettings.vue`: `scenarioStep.gameScript.*` と `scenarioStep.common.*` は ja/en 両方に存在。`mapText.gameMeta.*` の登録済みゲームキーは定義側と照合可能な構造。
- `ScenarioStepItem.vue`: `scenarioStep.stepItem.*` と `mapText.scenarioStepKind.*` は ja/en 両方に存在。6種類のステップ種別すべてに label / description がある。
- `ScenarioStepKindMap.ts` / `createDefaultStep.ts` / `useScenarioStepTabs.ts`: UI表示文字列を直接生成していない。
- `messageModules.ts` に `assets/scenarios` が登録されていることを確認。

## 除外した表記

- `WordParty`, `WordParty ID`: 固有の機能名・識別子。
- `placeholder="0"`: 数値入力の例示値であり、翻訳対象ではない。
- `soundMap` の日本語 label: UI側では `t('mapText.sound.*')` を使用しているため、翻訳定義の日本語データは直接表示されない。

## 静的解析

未実行。GitHub API による閲覧環境ではリポジトリ内コマンドを実行できないため、ソースと翻訳定義の照合で確認した。
