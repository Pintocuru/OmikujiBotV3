# i18n 監査レポート batch-20

- バッチ: 20
- ブランチ: main（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全6ファイル調査完了）

1. `src/editor/constants/dataPackTemplates.ts` — 完了
2. `src/editor/constants/index.ts` — 完了
3. `src/editor/constants/versionCheck.ts` — 完了
4. `src/editor/maps/DataSourceMap.ts` — 完了
5. `src/editor/maps/category/CategoryContentMap.ts` — 完了
6. `src/editor/maps/parts/ColorPicker.ts` — 完了

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API のみのためローカルコマンド不可。i18n 系 lint プラグイン未導入。ソース照合で調査。

## 翻訳定義の確認

- `CategoryContentMap.ts` の `labelKey` / `descriptionKey`（`categorySections.*`）は `src/i18n/editor/category/CategorySectionMessagesMap.ts` に ja/en 両方で存在を確認。
- `noticeKey`（`reactionEditor.platformNotice` / `padEditor.notice`）は登録済みモジュール `events/ReactionEditor.ts` / `events/PadEditor.ts` に ja/en 両方で存在を確認。

## 検出一覧

| ファイルパス:行番号                    | 該当コード（短く）                       | 問題の種類       | 推奨修正   | 確度 |
| -------------------------------------- | ---------------------------------------- | ---------------- | ---------- | ---- |
| src/editor/maps/DataSourceMap.ts:6     | `label: 'プリセット'`                    | hardcoded string | 翻訳キー化 | 高   |
| src/editor/maps/DataSourceMap.ts:14    | `label: 'NO DATA'`                       | hardcoded string | 翻訳キー化 | 高   |
| src/editor/maps/parts/ColorPicker.ts:3 | `{ label: '名前の色', key: 'name' }`     | hardcoded string | 翻訳キー化 | 高   |
| src/editor/maps/parts/ColorPicker.ts:4 | `{ label: 'テキストの色', key: 'text' }` | hardcoded string | 翻訳キー化 | 高   |
| src/editor/maps/parts/ColorPicker.ts:5 | `{ label: '背景色', key: 'background' }` | hardcoded string | 翻訳キー化 | 高   |
| src/editor/maps/parts/ColorPicker.ts:6 | `{ label: 'アクセント', key: 'accent' }` | hardcoded string | 翻訳キー化 | 高   |

## 検出なし（確認済み）

- `dataPackTemplates.ts`: ファイルパスのリストのみ（ユーザー向け文字列なし）。
- `constants/index.ts` / `versionCheck.ts`: re-export と URL 定数のみ。
- `DataSourceMap.ts:10` の `omikujiData.js` はファイル名（固有名詞）のため検出対象外。
- `CategoryContentMap.ts`: 表示文言はすべて `labelKey` / `descriptionKey` / `noticeKey` 経由で i18n 化済み。

## 集計

- 対象ファイル数: 6（全完了）
- 確定検出件数: 6（すべて hardcoded string、確度: 高）
- 要確認件数: 0
- missing key / empty or untranslated value / dynamic key / locale formatting の検出なし
