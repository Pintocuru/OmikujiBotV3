# i18n 監査レポート batch-17

- バッチ: 17
- ブランチ: main（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全8ファイル調査完了）

1. `src/editor/helpers/KeyEditor/composables/useKeyEditor.ts` — 完了
2. `src/editor/helpers/KeyEditor/keyEditorValidation.ts` — 完了
3. `src/editor/helpers/KeyEditor/keyUpdateReferences.ts` — 完了
4. `src/editor/helpers/KeyEditor/keyUpdateStrategies.ts` — 完了
5. `src/editor/helpers/KeyEditor/types.ts` — 完了
6. `src/editor/helpers/confirmSaveWithIssues.ts` — 完了
7. `src/editor/helpers/presetsExport/useConfigExport.ts` — 完了
8. `src/editor/helpers/presetsImport/CategoryConfigSection.vue` — 完了

（`reports/i18n-audit/progress.md` はリポジトリに未存在のため、バッチ表の「15–19: src/editor/helpers/ 8ファイルずつ」に従い、helpers 40ファイル中の17–24番目を batch-17 の対象とした）

## 静的解析

- 実施状況: **未実行（実行環境なし）**
- 理由: GitHub 読み取り API のみでローカルコマンドは実行できない。`@intlify/eslint-plugin-vue-i18n` / `vue-i18n-extract` は未導入のため、ソース照合のみで調査した。

## 翻訳定義の確認

- `src/i18n/editor/messageModules.ts` に登録されたモジュールを実際にたどり、`src/i18n/editor/helpers/keyEditorMessages.ts`（keyEditor._）、`src/i18n/editor/category/NavigationSidebarCategoriesMessages.ts`（categories._）を確認。いずれも ja/en 両方に全キーが存在し、空値・日本語のままの値はなし。
- `useKeyEditor.ts` / `CategoryConfigSection.vue` の動的キー `categories.${category}.label` は、候補（mikuji / scenarios / placeholders / characters 等）がすべて ja/en に存在することを確認済み。

## 検出一覧

| ファイルパス:行番号                                           | 該当コード（短く）                                                                               | 問題の種類       | 推奨修正                                 | 確度 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------- | ---------------------------------------- | ---- |
| src/editor/helpers/confirmSaveWithIssues.ts:17                | `<li>${category}: ${count}件</li>`                                                               | hardcoded string | 件数表示を翻訳キー化（複数形対応も検討） | 高   |
| src/editor/helpers/confirmSaveWithIssues.ts:21                | title: `読み込み時に ${total}件 除外しています`                                                  | hardcoded string | swal の title を翻訳キー化               | 高   |
| src/editor/helpers/confirmSaveWithIssues.ts:22-26             | html 内の3段落の日本語                                                                           | hardcoded string | html 全体を翻訳キー化                    | 高   |
| src/editor/helpers/confirmSaveWithIssues.ts:27                | confirmButtonText: '除外したまま保存する'                                                        | hardcoded string | 翻訳キー化                               | 高   |
| src/editor/helpers/presetsExport/useConfigExport.ts:31-32     | successMessage title/description の日本語                                                        | hardcoded string | 翻訳キー化                               | 高   |
| src/editor/helpers/presetsExport/useConfigExport.ts:71-72     | title: '設定データに問題があります' / text: 'エラーを修正してから再度お試しください。'           | hardcoded string | 翻訳キー化                               | 高   |
| src/editor/helpers/presetsExport/useConfigExport.ts:87-88     | title: '設定ファイルのダウンロードに失敗しました' / text: 'もう一度お試しください。'             | hardcoded string | 翻訳キー化                               | 高   |
| src/editor/helpers/presetsExport/useConfigExport.ts:96-97     | title: '設定ファイルの出力中にエラーが発生しました' / text: '詳細はコンソールをご確認ください。' | hardcoded string | 翻訳キー化                               | 高   |
| src/editor/helpers/presetsImport/CategoryConfigSection.vue:14 | `{{ config.count }}項目`                                                                         | hardcoded string | 「項目」を翻訳キー化                     | 高   |

## 検出なし（確認済み）

- `useKeyEditor.ts`: `keyEditor.title` / `keyEditor.errors.*` は ja/en 両方に存在。動的キー `categories.${currentCategory.value}.label`（26行）は全候補キーが存在。`console.error('Key更新エラー:')` は開発者向けログのため対象外。
- `keyEditorValidation.ts`: `keyEditor.validation.*` は ja/en 両方に存在。
- `keyUpdateReferences.ts` / `keyUpdateStrategies.ts` / `types.ts`: ユーザー向け文字列なし。

## 集計

- 対象ファイル数: 8（全完了）
- 確定検出件数: 9（すべて hardcoded string、確度: 高）
- 要確認件数: 0
- missing key / empty or untranslated value / locale formatting の検出なし
