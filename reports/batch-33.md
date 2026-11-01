# i18n 監査レポート batch-33

- バッチ: 33
- ブランチ: `docs/i18n-audit-preparation`
- 調査日: 2026-11-01
- 対象: `src/editor/ui/`

## 対象ファイル（7 / 7）

1. `src/editor/ui/UiEditor.vue`
2. `src/editor/ui/common/FontFamilyEditor.vue`
3. `src/editor/ui/common/useCommonStyleUpdate.ts`
4. `src/editor/ui/conditions/LayoutEditor.vue`
5. `src/editor/ui/conditions/UnusedUiSettingsEditor.vue`
6. `src/editor/ui/uiEditorRegistry.ts`
7. `src/editor/ui/useVisibleUiKinds.ts`

## 検出一覧

| ファイルパス:行番号 | 該当コード（短く） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `UiEditor.vue:8-9,17-18` | 開発用セクションの `レイアウト` / `ジェネレーターで使用するレイアウトの切り替え` / `未使用UIの整理` / `リリース前に不要な UI 設定を削除` | hardcoded UI strings | SectionCard の label / description を翻訳キー化 | 高 |
| `UiEditor.vue:31-32` | `共通設定` / `フォントなど、すべての表示に共通する設定` | hardcoded UI strings | 翻訳キー化 | 高 |
| `FontFamilyEditor.vue:4-5` | `プレビュータイトル` / `これはフォント確認用のサンプルです。` | hardcoded preview text | プレビュー用サンプルとして固定する意図がなければ翻訳キー化。英語 UI でも日本語文が残る | 中 |
| `FontFamilyEditor.vue:22,32,70-76` | `tab.label` / `デフォルト` / `すべて`・`ゴシック`・`明朝`・`丸ゴシック`・`手書き`・`装飾` | hardcoded UI strings | タブ名と既定フォント名を locale 対応 | 高 |
| `LayoutEditor.vue:20` | `データが不一致です: ${mismatchMessage}` | hardcoded UI string | 翻訳キー化。差分詳細はパラメータとして渡す | 高 |
| `UnusedUiSettingsEditor.vue:7,10-11` | `削除できる設定はありません` / `削除` / `未使用をすべて削除` | hardcoded UI strings | 翻訳キー化 | 高 |
| `UnusedUiSettingsEditor.vue:24-26` | 確認タイトル `未使用の {count} 件の設定を削除しますか？`、完了通知 `削除しました` | hardcoded UI strings | confirm title / success toast を翻訳キー化し、件数表現を locale 対応 | 高 |

## 既存の翻訳キー・重複検出の扱い

- `uiSettings.fontFamily.*`、`uiSettings.layout.*`、`uiSettings.unused.*` は ja/en 定義あり。
- `UiEditor.vue` / `LayoutEditor.vue` の `mapText.uiKind.*` / `mapText.uiLayout.*` は、既報の Batch 01 の不足（commentBubble 以外の候補）と同じ参照。重複計上しない。
- `uiEditorRegistry.ts` / `useVisibleUiKinds.ts` / `useCommonStyleUpdate.ts`: UI 文言なし。

## 集計

- 対象ファイル数: 7（全完了）
- 確定検出: 6項目（hardcoded UI strings）
- 要確認: 1項目（プレビュー用サンプル文言）
- Missing key / empty or untranslated value: 新規検出なし
- コード変更: なし

## 静的解析

未実行。GitHub API によるソース閲覧のみで、リポジトリ内コマンドは実行できないため。
