# i18n 監査レポート batch-24

- バッチ: 24
- ブランチ: `docs/i18n-audit-preparation`
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 調査日: 2026-11-01

## 対象ファイル（全9ファイル調査完了）

1. `src/editor/presets/assetPresets.ts`
2. `src/editor/presets/characters.ts`
3. `src/editor/presets/comments.ts`
4. `src/editor/presets/helpers.ts`
5. `src/editor/presets/index.ts`
6. `src/editor/presets/reactions.ts`
7. `src/editor/presets/services.ts`
8. `src/editor/presets/timers.ts`
9. `src/editor/presets/types.ts`

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API によるソース確認のみで、リポジトリ内コマンドを実行できないため。依存追加・設定変更は行っていない。

## 翻訳定義の確認

- プリセットのラベル・説明は `presets.{category}.{id}.label|description` を参照する設計（`types.ts` のコメント）。
- `src/i18n/editor/category/NavigationSidebarPresetsMessages.ts` に、8カテゴリ・25プリセットすべての label / description が ja/en 両方で定義されている。
- 同翻訳ファイルは `NavigationSidebarMessagesMap.ts` から import され、`messageModules.ts` に登録された `category/NavigationSidebarMessagesMap` 経由で統合される。したがって翻訳モジュールの登録漏れはない。
- 呼び出し側 `src/editor/sidebar/composables/useSidebarPreset.ts` の動的キー `presets.${category}.${id}` について、対象9ファイルで定義される全25組を照合し、ja/en の不足は確認されなかった。
- プリセット生成データ内の日本語（おみくじ名、投稿メッセージ、プレースホルダー名・値、キャラクター名・表情ラベル等）は、追加されるサンプルデータの内容であり、エディターの固定 UI 文言とは区別した。今回の hardcoded UI string には計上していない。

## 検出一覧

該当なし。

## 検出なし（確認済み）

- 参照されるプリセット翻訳キーの missing key: 0
- label / description の empty or untranslated value: 0
- hardcoded UI string: 0
- 未解決の dynamic key: 0
- locale formatting / pluralization: 0

## 集計

- 対象ファイル数: 9（全完了）
- 確定検出件数: 0
- 要確認件数: 0
