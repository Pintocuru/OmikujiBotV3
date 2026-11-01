# i18n 監査レポート batch-19

- バッチ: 19
- ブランチ: main（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全8ファイル調査完了）

1. `src/editor/helpers/shared/softPulse.css` — 完了
2. `src/editor/helpers/shared/useMappingModalState.ts` — 完了
3. `src/editor/helpers/shared/useMappingUpdater.ts` — 完了
4. `src/editor/helpers/shared/useWeightCalculation.ts` — 完了
5. `src/editor/helpers/shared/useWeightValueManagement.ts` — 完了
6. `src/editor/helpers/sortByOrder.ts` — 完了
7. `src/editor/helpers/useJsonClipboard.ts` — 完了
8. `src/editor/helpers/useTestPost.ts` — 完了

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API のみのためローカルコマンド不可。i18n 系 lint プラグイン未導入。ソース照合で調査。

## 翻訳定義の確認

- `src/i18n/editor/helpers/clipboardMessages.ts`（messageModules.ts に登録済み）を確認。`clipboard.copySuccess / copyError / pasteReadError / pasteInvalidJson / pasteInvalidFormat` は ja/en 両方に存在し、空値なし。

## 検出一覧

| ファイルパス:行番号                      | 該当コード（短く）                                                                                                    | 問題の種類                                                                                   | 推奨修正                             | 確度 |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------ | ---- |
| src/editor/helpers/useTestPost.ts:50     | `title: 'おみくじ抽選結果'`                                                                                           | hardcoded string                                                                             | 翻訳キー化                           | 高   |
| src/editor/helpers/useTestPost.ts:51     | `` html: `おみくじ: ${...無名のアイテム}<br>重み: ${...}` ``                                                          | hardcoded string                                                                             | 翻訳キー化                           | 高   |
| src/editor/helpers/useTestPost.ts:71-72  | `title: 'イベントが選択されていません'` / `text: 'テスト投稿の対象となるイベントを選択してください。'`                | hardcoded string                                                                             | 翻訳キー化                           | 高   |
| src/editor/helpers/useTestPost.ts:83-84  | `title: 'おみくじ抽選結果'` / `text: '該当するおみくじがありませんでした。'`                                          | hardcoded string                                                                             | 翻訳キー化                           | 高   |
| src/editor/helpers/useTestPost.ts:99-102 | `title: 'シナリオが見つかりません'` / `シナリオ "..." が存在しません。` / `'シナリオ(stepKey)が設定されていません。'` | hardcoded string                                                                             | 翻訳キー化                           | 高   |
| src/editor/helpers/useTestPost.ts:127    | `title: 'テスト投稿の表示中にエラーが発生しました'`                                                                   | hardcoded string                                                                             | 翻訳キー化                           | 高   |
| src/editor/helpers/useTestPost.ts:19-20  | MOCK_COMMENT の `テストユーザー` / `テストコメント`                                                                   | 要確認（テスト投稿プレビューに表示される可能性があるが、テスト用モックデータのため判断保留） | 用途を確認のうえ、必要なら翻訳キー化 | 低   |

## 検出なし（確認済み）

- `useJsonClipboard.ts`: `clipboard.*` の5キーはすべて ja/en に存在。toast 文言は i18n 経由。
- `softPulse.css` / `useMappingModalState.ts` / `useMappingUpdater.ts` / `useWeightCalculation.ts` / `useWeightValueManagement.ts` / `sortByOrder.ts`: ユーザー向け文字列なし（`toFixed(2)` の数値フォーマットは locale 非依存のため問題なしと判断）。
- `useTestPost.ts` の `console.error` は開発者向けログのため対象外。

## 集計

- 対象ファイル数: 8（全完了）
- 確定検出件数: 6（すべて hardcoded string、確度: 高）
- 要確認件数: 1（確度: 低）
- missing key / empty or untranslated value / dynamic key / locale formatting の検出なし
