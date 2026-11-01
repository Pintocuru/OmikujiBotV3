# Batch 11 i18n Audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/content/composables/` and initial `connections/` components
- Files: 8
- Total lines: 574
- Code changes: none

## 対象ファイル

- `src/editor/content/composables/useCharacterTargets.ts` (57 lines)
- `src/editor/content/composables/useContentTabs.ts` (63 lines)
- `src/editor/content/composables/useLaneItems.ts` (12 lines)
- `src/editor/content/composables/useReferenceGraph.ts` (224 lines)
- `src/editor/content/composables/useSelectedRecord.ts` (45 lines)
- `src/editor/content/connections/CharacterLane.vue` (25 lines)
- `src/editor/content/connections/EventLane.vue` (79 lines)
- `src/editor/content/connections/ItemSwitcher.vue` (69 lines)

## 検出一覧

該当なし。

## 照合内容

- `CharacterLane.vue`: `connections.characterEvents` / `noCharacterEvents` / `characterEventsHint` は ja/en 両方に存在。
- `EventLane.vue`: `connections.changeBox` / `boxMissing` / `noBoxHint` / `chooseBox` / `createBox` および `categories.mikuji.label` は ja/en 両方に存在。
- `ItemSwitcher.vue`: `connections.switcher.disabled` / `cyclic` は ja/en 両方に存在。
- 上記 `connections.*` の翻訳定義は `src/i18n/editor/content/ConnectionMessages.ts` にあり、`messageModules.ts` で登録済み。
- composables 5ファイルはデータ取得・参照グラフ・選択状態の処理であり、ユーザー向け表示文言を生成していない。
- `useReferenceGraph.ts:121` の `throw new Error('useReferenceGraph: Pinia が有効になっていません')` は内部状態の異常を示す開発者向け例外で、通常のUI表示文言とは扱わず対象外とした。

## 動的キー・ロケール対応

今回の対象に、翻訳キーを組み立てる動的参照、複数形・日付・数値のロケール依存表示は確認されなかった。

## 静的解析

未実行。GitHub API による閲覧環境ではリポジトリ内コマンドを実行できないため、ソースと翻訳定義の照合で確認した。
