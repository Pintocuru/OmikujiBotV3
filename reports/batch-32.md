# i18n 監査レポート batch-32

- バッチ: 32
- ブランチ: `docs/i18n-audit-preparation`
- 調査日: 2026-11-01
- 対象: `src/editor/types/`

## 対象ファイル（9 / 9）

1. `src/editor/types/DataSource.ts`
2. `src/editor/types/apps/ContentTab.ts`
3. `src/editor/types/apps/ItemContentDef.ts`
4. `src/editor/types/apps/SidebarType.ts`
5. `src/editor/types/apps/dataPacks.ts`
6. `src/editor/types/apps/index.ts`
7. `src/editor/types/helpers/index.ts`
8. `src/editor/types/helpers/types.ts`
9. `src/editor/types/index.ts`

## 調査結果

- 翻訳対象のユーザー向け表示文字列: 0
- Missing key: 0
- Hardcoded UI strings: 0
- Empty / untranslated values: 0
- Dynamic key: 該当なし
- Locale formatting / pluralization: 該当なし

## 確認内容

- `DataSource.ts`: union type のみ。
- `ContentTab.ts` / `ItemContentDef.ts`: 型定義とコメントのみ。表示名・説明は i18n キー（`labelKey` / `descriptionKey`）を保持する設計。
- `SidebarType.ts` / `dataPacks.ts`: 型・データ構造のみ。label プロパティは表示用文言の定義ではなく、呼び出し側から渡される値。
- `helpers/types.ts`: import/export 設定の型のみ。コメント中の日本語は UI に表示される文字列ではない。
- 各 `index.ts`: re-export のみ。

## 集計

- 対象ファイル数: 9（全完了）
- 確定検出件数: 0
- 要確認件数: 0
- コード変更: なし

## 静的解析

未実行。GitHub API によるソース閲覧のみで、リポジトリ内コマンドは実行できないため。
