# i18n 監査レポート batch-21

- バッチ: 21
- ブランチ: main（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全8ファイル調査完了）

1. `src/editor/parts/BaseDialog.vue` — 完了
2. `src/editor/parts/BaseEditDialog.vue` — 完了
3. `src/editor/parts/CharacterPicker/CharacterIconPicker.vue` — 完了
4. `src/editor/parts/CharacterPicker/IconPopup.vue` — 完了
5. `src/editor/parts/CharacterPicker/types.ts` — 完了
6. `src/editor/parts/CharacterPicker/useCharacterItems.ts` — 完了
7. `src/editor/parts/CharacterPicker/useIconPopup.ts` — 完了
8. `src/editor/parts/ColorPicker/ColorPicker.vue` — 完了

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API のみのためローカルコマンド不可。i18n 系 lint プラグイン未導入。ソース照合で調査。

## 検出一覧

| ファイルパス:行番号                                         | 該当コード（短く）                                        | 問題の種類                                   | 推奨修正                  | 確度 |
| ----------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------- | ------------------------- | ---- |
| src/editor/parts/BaseEditDialog.vue:33                      | `キャンセル` ボタン                                       | hardcoded string                             | 翻訳キー化                | 高   |
| src/editor/parts/BaseEditDialog.vue:36                      | `保存して閉じる` ボタン                                   | hardcoded string                             | 翻訳キー化                | 高   |
| src/editor/parts/CharacterPicker/CharacterIconPicker.vue:27 | `画像なし` プレースホルダー                               | hardcoded string                             | 翻訳キー化                | 高   |
| src/editor/parts/ColorPicker/ColorPicker.vue:11             | ``:title="`プリセット ${i + 1}`"``                        | hardcoded string                             | 翻訳キー化                | 高   |
| src/editor/parts/BaseDialog.vue:23                          | `<button @click="close">close</button>`（バックドロップ） | hardcoded string（アクセシビリティテキスト） | aria-label 等を翻訳キー化 | 中   |

## 検出なし（確認済み）

- `IconPopup.vue`: `aria-label` は `item.name`（ユーザーデータ）で翻訳対象外。`title` も `icon.label`（データ由来）。
- `types.ts` / `useCharacterItems.ts` / `useIconPopup.ts`: ユーザー向け文字列なし。
- `BaseDialog.vue`: `title` は props 経由。`ColorPicker.vue` のフィールドラベルは `colorFields`（`src/editor/maps/parts/ColorPicker.ts`）由来のため batch-20 で既報（重複計上せず）。

## 集計

- 対象ファイル数: 8（全完了）
- 確定検出件数: 4（hardcoded string、確度: 高）
- 要確認件数: 1（確度: 中、BaseDialog の backdrop "close"）
- missing key / empty or untranslated value / dynamic key / locale formatting の検出なし
