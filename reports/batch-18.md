# i18n 監査レポート batch-18

- バッチ: 18
- ブランチ: main（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全8ファイル調査完了）

1. `src/editor/helpers/presetsImport/CategoryModeSelector.vue` — 完了
2. `src/editor/helpers/presetsImport/ComponentConfigSection.vue` — 完了
3. `src/editor/helpers/presetsImport/ConfigImportModal.vue` — 完了
4. `src/editor/helpers/presetsImport/ConflictsList.vue` — 完了
5. `src/editor/helpers/presetsImport/composables/importHelpers.ts` — 完了
6. `src/editor/helpers/presetsImport/composables/useImportManager.ts` — 完了
7. `src/editor/helpers/shared/checkCircularReference.ts` — 完了
8. `src/editor/helpers/shared/processTestPlaceholder.ts` — 完了

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API のみのためローカルコマンド不可。i18n 系 lint プラグイン未導入。ソース照合で調査。

## 翻訳定義の確認

- `messageModules.ts` 登録モジュールのうち `src/i18n/editor/maps/UiMapMessages.ts` を確認。`mapText.uiKind` は `commentBubble` のみ定義。`src/types/OmikujiData/ui/UiSettingsSchema.ts` の `uiKinds` は 9種（characterStage, commentBubble, cookieCounter, gameRanking, kujibikiPanel, liveClock, streamCounter, toastWidgets, userBoard）。

## 検出一覧

| ファイルパス:行番号                                                 | 該当コード（短く）                            | 問題の種類                                                                            | 推奨修正                                      | 確度 |
| ------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- | ---- |
| src/editor/helpers/presetsImport/CategoryModeSelector.vue:4         | `読み込み方法:`                               | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/CategoryModeSelector.vue:15        | `マージ`                                      | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/CategoryModeSelector.vue:27        | `置き換え`                                    | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ComponentConfigSection.vue:7       | ``t(`mapText.uiKind.${componentKey}.label`)`` | dynamic key（候補9種中8種が ja/en 両方で未定義: commentBubble 以外）                  | mapText.uiKind に残り8種の ja/en label を追加 | 高   |
| src/editor/helpers/presetsImport/ComponentConfigSection.vue:8       | `新規` バッジ                                 | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ComponentConfigSection.vue:14      | `使用する設定:`                               | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ComponentConfigSection.vue:24      | `読み込み側の設定`                            | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ComponentConfigSection.vue:34      | `既存の設定`                                  | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ConfigImportModal.vue:8            | `label="設定読み込みプレビュー"`              | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ConfigImportModal.vue:9            | `` `総項目数: ${...}` ``                      | hardcoded string                                                                      | 翻訳キー化（件数は複数形対応も検討）          | 高   |
| src/editor/helpers/presetsImport/ConfigImportModal.vue:14           | `<h3>データカテゴリ</h3>`                     | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ConfigImportModal.vue:24           | `<h3>アイテム設定</h3>`                       | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ConfigImportModal.vue:36           | `saveName="読み込む"`                         | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ConfigImportModal.vue:42           | `プレビューデータを読み込み中...`             | hardcoded string                                                                      | 翻訳キー化                                    | 高   |
| src/editor/helpers/presetsImport/ConflictsList.vue:4                | `競合項目 ({{ conflicts.length }}件):`        | hardcoded string                                                                      | 翻訳キー化（件数は複数形対応も検討）          | 高   |
| src/editor/helpers/presetsImport/composables/useImportManager.ts:60 | `error: 'データ読み込みエラー'`               | 要確認（i18n 非経由のエラー文字列。呼び出し元での表示有無がバッチ外のため確認できず） | 呼び出し元を確認のうえ翻訳キー化              | 低   |

## 検出なし（確認済み）

- `importHelpers.ts` / `checkCircularReference.ts` / `processTestPlaceholder.ts`: ユーザー向け文字列なし。
- `useImportManager.ts` の `console.warn` は開発者向けログのため対象外。`'invalid-metadata'` は内部識別子のため対象外。

## 集計

- 対象ファイル数: 8（全完了）
- 確定検出件数: 14（hardcoded string 13 + dynamic key 1、いずれも確度: 高）
- 要確認件数: 1（確度: 低）
- empty or untranslated value / locale formatting の検出なし
