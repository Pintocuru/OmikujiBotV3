# i18n 監査レポート batch-30

- バッチ: 30
- ブランチ: `docs/i18n-audit-preparation`
- 調査時点の commit SHA: `ddd28be898856d4c6698302b7a1878f2d6b6d560`
- 調査日: 2026-11-01

## 対象ファイル（全8ファイル調査完了）

1. `src/editor/stores/composables/useAssetCRUD.ts`
2. `src/editor/stores/composables/useAssetProperties.ts`
3. `src/editor/stores/composables/useAssetSort.ts`
4. `src/editor/stores/composables/useDataIO.ts`
5. `src/editor/stores/composables/useDataMerge.ts`
6. `src/editor/stores/composables/useDataMergeHelpers.ts`
7. `src/editor/stores/composables/useEventCRUD.ts`
8. `src/editor/stores/composables/useEventProperties.ts`

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API によるソース確認のみ。依存追加・設定変更は行っていない。

## 検出一覧

| ファイルパス:行 | 該当コード（短く） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/stores/composables/useAssetCRUD.ts:88` | `name: \`${item.name}(コピー)\`` | hardcoded string | 複製名の接尾辞を翻訳キー化。生成データに保存される値なので、既存データとの互換性・命名仕様も確認する | 中 |
| `src/editor/stores/composables/useDataIO.ts:33` | `データの読み込み中にエラーが発生しました` | hardcoded string | エラーダイアログのタイトルを翻訳キー化 | 高 |
| 同:61–62 | `データの検証に失敗しました` / `内容に不備があるため、エクスポートできません。` | hardcoded string | エラーダイアログのタイトル・本文を翻訳キー化 | 高 |
| `src/editor/stores/composables/useDataMerge.ts:30` | `データの部分更新が完了しました。` | hardcoded string | 成功通知のタイトルを翻訳キー化 | 高 |
| 同:37 | `データの更新中にエラーが発生しました` | hardcoded string | エラーダイアログのタイトルを翻訳キー化 | 高 |

## 検出なし（確認済み）

- `useAssetProperties.ts`、`useAssetSort.ts`、`useDataMergeHelpers.ts`、`useEventCRUD.ts`、`useEventProperties.ts` はデータ操作・並び替え・型処理を行い、ユーザー向け固定表示文字列は確認されなかった。
- `useDataIO.ts` の `String(error)` は実行時例外の内容であり、固定文言としては検出していない。
- `useDataMerge.ts:26` の日本語ログは `console.warn` による開発者向けコンソール出力のため、UI翻訳漏れには含めていない。
- missing key / dynamic key / locale formatting: 明確な検出なし。

## 集計

- 対象ファイル数: 8（全完了）
- 確定検出件数: 5項目（hardcoded string）
- 要確認件数: 0

## 調査上の制約

- 今回の対象範囲におけるソース確認を実施。対象外ファイルの追加監査は行っていない。
- コード・翻訳定義・設定ファイル・`progress.md` は変更していない。
