# i18n 監査レポート batch-34

- バッチ: 34
- ブランチ: `docs/i18n-audit-preparation`
- 調査日: 2026-11-01
- 対象: `src/editor/sidebar/`

## 対象ファイル（15 / 15）

1. `src/editor/sidebar/NavigationSidebar.vue`
2. `src/editor/sidebar/SidebarDrawer.vue`
3. `src/editor/sidebar/categories/CategoryButton.vue`
4. `src/editor/sidebar/categories/DataCategories.vue`
5. `src/editor/sidebar/categories/SettingsCategories.vue`
6. `src/editor/sidebar/composables/useCategoryOpen.ts`
7. `src/editor/sidebar/composables/useCategoryUtils.ts`
8. `src/editor/sidebar/composables/useSidebarCreate.ts`
9. `src/editor/sidebar/composables/useSidebarDrag.ts`
10. `src/editor/sidebar/composables/useSidebarDrawer.ts`
11. `src/editor/sidebar/composables/useSidebarPreset.ts`
12. `src/editor/sidebar/records/JsonMergeList.vue`
13. `src/editor/sidebar/records/RecordItem.vue`
14. `src/editor/sidebar/records/RecordList.vue`
15. `src/editor/sidebar/records/RecordMenu.vue`

## 調査結果

- Missing key: 0
- Hardcoded UI strings: 0
- Empty / untranslated values: 0
- Unresolved dynamic keys: 0
- Locale formatting / pluralization: 0
- 要確認: 0

## 翻訳定義の照合

- `categories.{category}.label/description` は対象カテゴリの ja/en 定義あり。
- `navigation.groups.*`、`navigation.create.*`、`navigation.preset.*`、`navigation.menu.*`、`navigation.unnamed` は ja/en 定義あり。
- `presets.{category}.{id}.label/description` は Batch 24 で照合済み。動的キー参照は同じ定義に解決する。
- `RecordList.vue` / `RecordMenu.vue` のボタン、ツールチップ、確認・通知文言は上記キー経由。
- `NavigationSidebar.vue` / `SidebarDrawer.vue` / `RecordItem.vue` および composables は、独自のユーザー向け固定文言なし。データ名・レコード名はデータ由来。

## 集計

- 対象ファイル数: 15（全完了）
- 確定検出件数: 0
- 要確認件数: 0
- コード変更: なし

## 静的解析

未実行。GitHub API によるソース閲覧のみで、リポジトリ内コマンドは実行できないため。
