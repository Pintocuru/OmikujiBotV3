# i18n 監査レポート batch-22

- バッチ: 22
- ブランチ: main（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全9ファイル調査完了）

1. `src/editor/parts/ColorPicker/ColorPreset.ts` — 完了
2. `src/editor/parts/ExternalLinkButton.vue` — 完了
3. `src/editor/parts/HudPreview.vue` — 完了
4. `src/editor/parts/IconCheckGroup.vue` — 完了
5. `src/editor/parts/IconRadioGroup.vue` — 完了
6. `src/editor/parts/InformationCard.vue` — 完了
7. `src/editor/parts/MenuDropdown.vue` — 完了
8. `src/editor/parts/MessageTextDialog/InlinePlaceholderDialog.vue` — 完了
9. `src/editor/parts/MessageTextDialog/MessagePreviewPanel.vue` — 完了

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API のみのためローカルコマンド不可。i18n 系 lint プラグイン未導入。ソース照合で調査。

## 翻訳定義の確認

- 登録済み全モジュール（apps / events / assets / category / content / helpers / shell / ui / maps）を走査し、最上位 `common` キーは存在しないことを確認（`scenarioStep.common.none` は別キー）。
- `src/i18n/editor/assets/scenarios.ts` の `scenarioStep.preview` は title / hint / expansion / hasError / clickRefresh / empty のみ定義。`unresolvedMore` / `collapse` / `showAll` は ja/en ともに未定義。
- `scenarioStep.inlinePh.*` / `scenarioStep.common.add cancel|insert` は ja/en 両方に存在（InlinePlaceholderDialog の参照はすべて有効）。

## 検出一覧

| ファイルパス:行番号                                               | 該当コード（短く）                                                         | 問題の種類                                                                 | 推奨修正                                                       | 確度         |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------ |
| src/editor/parts/ExternalLinkButton.vue:19                        | `title: 'サイトを開く'`（デフォルト値）                                    | hardcoded string                                                           | デフォルト title を翻訳キー化                                  | 高           |
| src/editor/parts/MenuDropdown.vue:11                              | `複製`                                                                     | hardcoded string                                                           | 翻訳キー化                                                     | 高           |
| src/editor/parts/MenuDropdown.vue:17                              | `削除`                                                                     | hardcoded string                                                           | 翻訳キー化                                                     | 高           |
| src/editor/parts/MessageTextDialog/MessagePreviewPanel.vue:21     | `t('scenarioStep.preview.unresolvedMore', { n })`                          | missing key（ja/en 両方未定義）                                            | キーを追加                                                     | 高           |
| src/editor/parts/MessageTextDialog/MessagePreviewPanel.vue:39     | `t('scenarioStep.preview.collapse')` / `t('scenarioStep.preview.showAll')` | missing key（ja/en 両方未定義）                                            | キーを追加                                                     | 高           |
| src/editor/parts/IconRadioGroup.vue:16                            | `t('common.none')`                                                         | missing key（最上位 common は登録モジュールに存在しない）                  | `scenarioStep.common.none` 等へ修正、または common.none を定義 | 高           |
| src/editor/parts/IconCheckGroup.vue:4,16                          | ``t(`${i18nPrefix}.${key}.label/description`)``                            | dynamic key（i18nPrefix は props。候補は呼び出し元依存のため網羅確認不可） | 呼び出し元の prefix 一覧と照合                                 | 低（要確認） |
| src/editor/parts/IconRadioGroup.vue:19,29                         | ``t(`${i18nPrefix}.${key}.label/description`)``                            | dynamic key（同上）                                                        | 呼び出し元の prefix 一覧と照合                                 | 低（要確認） |
| src/editor/parts/MessageTextDialog/InlinePlaceholderDialog.vue:66 | `<button @click="close">close</button>`（バックドロップ）                  | hardcoded string（アクセシビリティテキスト）                               | aria-label 等を翻訳キー化                                      | 中           |

## 検出なし（確認済み）

- `ColorPreset.ts`: カラーコードとコメントのみ。`HudPreview.vue`: `%` 付き数値のみで文言なし。`InformationCard.vue`: クラス名のみ。
- `InlinePlaceholderDialog.vue` / `MessagePreviewPanel.vue` のそのほかの文言はすべて i18n 経由。

## 集計

- 対象ファイル数: 9（全完了）
- 確定検出件数: 6（hardcoded string 3 + missing key 3、いずれも確度: 高）
- 要確認件数: 3（dynamic key 2・確度: 低、backdrop "close" 1・確度: 中）
