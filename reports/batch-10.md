# Batch 10 i18n Audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/content/` (root-level components)
- Files: 9
- Total lines: 603
- Code changes: none

## 対象ファイル

- `src/editor/content/AppDevWorld.vue` (11 lines)
- `src/editor/content/ContentArea.vue` (66 lines)
- `src/editor/content/ContentConnections.vue` (57 lines)
- `src/editor/content/ContentSummary.vue` (22 lines)
- `src/editor/content/ContentTabs.vue` (31 lines)
- `src/editor/content/ItemEditor.vue` (70 lines)
- `src/editor/content/ItemMenu.vue` (57 lines)
- `src/editor/content/TopPage.vue` (256 lines)
- `src/editor/content/TopSection.vue` (33 lines)

## 検出一覧

| ファイルパス:行 | 該当コード（短く） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/content/AppDevWorld.vue:5-6` | `NO DATA` / `Welcome to "DevWorld"...` | hardcoded string | 開発用画面であっても表示文言を翻訳キー化するか、意図的に英語固定とする仕様を明記 | 中 |
| `src/editor/content/TopPage.vue:29,31` | `t(`mapText.uiKind.${item.kind}.label/description`)` | missing key（動的キー、Batch 01 と重複） | `UiMapMessages.ts` に不足8種の label / description を ja/en で追加。Batch 01 で確認済みの同一不足キー群 | 高 |
| `src/editor/content/TopPage.vue:15,47,89` | `t('topPage.count', { count })` | locale formatting / pluralization | 英語側を単数・複数に応じた表現（1 item / N items）にする | 高 |

## 照合内容

- `ContentArea.vue`: `categories.{selectedCategory}.label/description` は `NavigationSidebarCategoriesMessages.ts` に定義されたカテゴリ候補と照合。ja/en の定義あり。
- `ContentConnections.vue`: `connections.cycle` は `ConnectionMessages.ts` に ja/en 定義あり。
- `ItemMenu.vue`: `connections.switcher.edit` と `navigation.menu.duplicate/delete` は ja/en 定義あり。
- `TopPage.vue`: `categories.*`、`navigation.menu.*`、`navigation.unnamed`、`topPage.*` は ja/en 定義あり。`mapText.uiKind.*` は Batch 01 で確認済みの不足キー群を再参照している。
- `TopSection.vue`: `topPage.count` は定義済みだが、英語の `{count} item(s)` は単数・複数で不自然になる。
- `ContentTabs.vue` / `ItemEditor.vue` / `ContentSummary.vue`: 翻訳文字列を直接生成しておらず、キーや定義を props 経由で受け取る構造。
- `ConnectionMessages.ts` / `TopPageMessages.ts` は `messageModules.ts` に登録済み。navigation / category メッセージも登録済み。

## 除外・注意事項

- `TopPage.vue` のキャラクター名・イベント名・説明はユーザーデータ由来のため、翻訳対象外。
- `AppDevWorld.vue` は開発用ページと見られるため、ハードコード文言の確度は「中」とした。`DevWorld` 自体は固有名として扱う。
- Batch 01 と同じ `uiKind` 不足を再度参照しているが、翻訳定義上の不足件数を重複加算しない。

## 静的解析

未実行。GitHub API による閲覧環境ではリポジトリ内コマンドを実行できないため、ソースと翻訳定義の照合で確認した。
