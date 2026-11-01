# i18n 監査レポート batch-23

- バッチ: 23
- ブランチ: main（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全8ファイル調査完了）

1. `src/editor/parts/MessageTextDialog/MessageTextDialog.vue` — 完了
2. `src/editor/parts/MessageTextDialog/PlaceholderPanel.vue` — 完了
3. `src/editor/parts/MessageTextDialog/composables/usePlaceholderEditor.ts` — 完了
4. `src/editor/parts/ModalFooterActions.vue` — 完了
5. `src/editor/parts/NoParamsCard.vue` — 完了
6. `src/editor/parts/SectionCard.vue` — 完了
7. `src/editor/parts/SettingItem.vue` — 完了
8. `src/editor/parts/SubSectionHeader.vue` — 完了

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API のみのためローカルコマンド不可。i18n 系 lint プラグイン未導入。ソース照合で調査。

## 翻訳定義の確認

- `src/i18n/editor/assets/scenarios.ts`（登録済み）: `scenarioStep.messageDialog.*`（inlinePlaceholder, detailEdit, dialogTitle, editTitle, saveWith, textareaPlaceholder, charCount, lineCount, cheatSheet）と `scenarioStep.placeholderPanel.*`（title, inlineTip, inline, newTitle, keyPlaceholder, create, defaults, exampleTip, userDefined, none, inUse, insertTip, insertKey, addValue）は ja/en 両方に存在。
- `src/i18n/editor/apps/AppInfoEditor.ts`（登録済み）: `appInfoEditor.settings.common` は `reset` / `warning` のみ。**`help` は ja/en ともに未定義**。

## 検出一覧

| ファイルパス:行番号                        | 該当コード（短く）                        | 問題の種類                      | 推奨修正                                  | 確度             |
| ------------------------------------------ | ----------------------------------------- | ------------------------------- | ----------------------------------------- | ---------------- |
| src/editor/parts/ModalFooterActions.vue:7  | `キャンセル` ボタン                       | hardcoded string                | 翻訳キー化                                | 高               |
| src/editor/parts/ModalFooterActions.vue:12 | `{{ saveName                              |                                 | '保存' }}`                                | hardcoded string | デフォルト値を翻訳キー化 | 高  |
| src/editor/parts/SettingItem.vue:26        | `t('appInfoEditor.settings.common.help')` | missing key（ja/en 両方未定義） | appInfoEditor.settings.common.help を追加 | 高               |

## 検出なし（確認済み）

- `MessageTextDialog.vue` / `PlaceholderPanel.vue`: すべての文言が `scenarioStep.*` 経由で、参照キーはすべて ja/en に存在。
- `usePlaceholderEditor.ts`: ユーザー向け文字列なし。
- `NoParamsCard.vue` / `SectionCard.vue` / `SubSectionHeader.vue`: 表示文言は `messageKey` / `labelKey` 等のキー prop 経由（呼び出し側がキーを渡す設計）。直接のハードコードなし。

## 集計

- 対象ファイル数: 8（全完了）
- 確定検出件数: 3（hardcoded string 2 + missing key 1、いずれも確度: 高）
- 要確認件数: 0
