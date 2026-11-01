# i18n 監査レポート batch-31

- バッチ: 31
- ブランチ: `docs/i18n-audit-preparation`
- 調査時点の commit SHA: `ec91c73dbded4a74aa247395f338171aa8968b2a`
- 調査日: 2026-11-01

## 対象ファイル（全8ファイル調査完了）

1. `src/editor/stores/composables/useEventSort.ts`
2. `src/editor/stores/composables/useSettingsOperations.ts`
3. `src/editor/stores/useGetAssetData.ts`
4. `src/editor/stores/useGetEventData.ts`
5. `src/editor/stores/useMikujiSelectionStore.ts`
6. `src/editor/stores/useNavigationStore.ts`
7. `src/editor/stores/useOmikujiStore.ts`
8. `src/editor/stores/useTagSuggestions.ts`

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API によるソース確認のみ。

## 検出一覧

**検出なし。**

- ユーザー向け固定表示文字列: 0
- 翻訳キーの参照: 0
- missing key / dynamic key: 0
- empty or untranslated value: 0
- locale formatting / pluralization: 0

## 確認事項

- 対象はストア・データ取得・並び替え・選択状態・タグ候補のロジックで構成されている。
- 日本語コメントは開発者向け説明のため、UI翻訳対象には含めていない。
- `'dark'` / `'light'`、カテゴリ識別子、データ値などは内部ロジック上の値であり、表示文言として扱っていない。
- `useOmikujiStore.ts` は各 composable の組み立てと公開のみで、独自の表示文言はない。

## 集計

- 対象ファイル数: 8（全完了）
- 確定検出件数: 0
- 要確認件数: 0

## 調査上の制約

- GitHub API によるソース確認のみ。リポジトリ上で ESLint 等の静的解析は実行していない。
- コード・翻訳定義・設定ファイル・`reports/i18n-audit/progress.md` は変更していない。
