# Batch 12 i18n Audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/content/connections/`, `helpers/`, `summary/`
- Files: 8
- Total lines: 354
- Code changes: none

## 対象ファイル

- `src/editor/content/connections/LaneLayout.vue` (63 lines)
- `src/editor/content/connections/LinkGroup.vue` (73 lines)
- `src/editor/content/connections/MikujiLane.vue` (27 lines)
- `src/editor/content/connections/PlaceholderLane.vue` (28 lines)
- `src/editor/content/connections/ScenarioLane.vue` (43 lines)
- `src/editor/content/connections/types.ts` (10 lines)
- `src/editor/content/helpers/graphUtils.ts` (53 lines)
- `src/editor/content/summary/BaseSummary.vue` (57 lines)

## 検出一覧

該当なし。

## 照合内容

- `MikujiLane.vue`: `connections.linkedEvents` / `linkedScenarios` / `noEvents` / `noScenarios` は ja/en 両方に存在。
- `PlaceholderLane.vue`: `connections.placeholderUsers` / `noPlaceholderUsers` / `childPlaceholders` / `noChildPlaceholders` は ja/en 両方に存在。
- `ScenarioLane.vue`: `connections.sources` / `noSources` / `connectOmikuji` / `usedPlaceholders` / `noPlaceholders` は ja/en 両方に存在。
- `LaneLayout.vue`: 現在のカテゴリ名は `categories.${selectedCategory}.label` から取得。カテゴリ翻訳定義に対応。
- `LinkGroup.vue`: 空状態の表示文言は呼び出し元から翻訳済み `emptyText` として渡される。カテゴリの title も翻訳キーを使用。
- `BaseSummary.vue`: `categorySections.baseSettings.label`, `connections.switcher.edit`, `baseSettings.name/description/tags.label` は ja/en 両方に存在。定義元は `CategorySectionMessagesMap.ts`, `ConnectionMessages.ts`, `BaseSettingsEditor.ts`。各翻訳モジュールは `messageModules.ts` に登録済み。
- `types.ts` / `graphUtils.ts`: 型定義・グラフ処理のみで、ユーザー向け表示文字列を生成していない。

## 動的キー・ロケール対応

今回の対象に、翻訳キーの動的生成に伴う欠落、空・未翻訳値、複数形・日付・数値等のロケール依存表示は確認されなかった。

## 静的解析

未実行。GitHub API による閲覧環境ではリポジトリ内コマンドを実行できないため、ソースと翻訳定義の照合で確認した。
