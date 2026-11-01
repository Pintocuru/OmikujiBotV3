# i18n 監査レポート batch-26

- バッチ: 26
- ブランチ: `docs/i18n-audit-preparation`
- 調査時点の commit SHA: `94778734cad67d04464efaae8eb3e9b517708e2d`
- 調査日: 2026-11-01

## 対象ファイル（全5ファイル調査完了）

1. `src/editor/shell/GeneratorLoading.vue`
2. `src/editor/shell/GeneratorStage.vue`
3. `src/editor/shell/GeneratorView.vue`
4. `src/editor/shell/IssuesBadge.vue`
5. `src/editor/shell/SaveMenu.vue`

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API によるソース確認のみ。依存追加・設定変更は行っていない。

## 検出一覧

| ファイルパス:行 | 該当コード（短く） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/shell/GeneratorLoading.vue:3` | `ジェネレーターを読み込み中...` | hardcoded string | 翻訳キー化 | 高 |
| `src/editor/shell/GeneratorStage.vue:12, 21` | `横幅(px)` / `縦幅(px)` | hardcoded string | input の title を翻訳キー化 | 高 |
| 同:28 | `全体に合わせる` | hardcoded string | 翻訳キー化 | 高 |
| 同:40 | `表示倍率` | hardcoded string | title を翻訳キー化 | 高 |
| 同:86–88 | `透過` / `黒` / `白` | hardcoded string | 背景選択肢の label を翻訳キー化 | 高 |
| `src/editor/shell/GeneratorView.vue:16` | `セッションリセット` | hardcoded string | 翻訳キー化 | 高 |
| 同:22, 25 | `ツールを隠す` / `ツールを表示` / `ツール` | hardcoded string | title とボタン表示を翻訳キー化 | 高 |
| `src/editor/shell/IssuesBadge.vue:14` | `{{ summary }}` | empty or untranslated value | `formatParseIssuesSummary` が日本語固定の文字列を生成しているため、locale 対応したサマリ生成にする | 高 |
| 同:16 | 不正データを読み飛ばす旨の説明文 | hardcoded string | 翻訳キー化 | 高 |
| 同:23 | `除外` / `既定値に戻した` | hardcoded string | action ラベルを翻訳キー化 | 高 |
| 同:32, 35 | `閉じる` / `close` | hardcoded string | ダイアログの閉じる操作ラベルを翻訳キー化 | 高 |
| 同:51 | `(全体)` | hardcoded string | 空の path/key に対する表示を翻訳キー化 | 高 |

## 検出なし（確認済み）

- `src/editor/shell/SaveMenu.vue`: `navigation.hasChanged` と `shell.save.more` は日本語・英語の翻訳定義に存在する。
- `SaveMenu.vue` が表示する `primary.label` / `primary.tip` / `menu` の文言は、参照先 `useSaveActions.ts` で翻訳キーから取得される。確認した関連キー（`navigation.exportConfig`、`navigation.exportConfigTip`、`navigation.saveFile`、`navigation.saveFileTip`、`shell.save.*`）も日本語・英語の定義に存在する。
- `src/i18n/editor/messageModules.ts` で `shell/ShellMessages` は登録済み。ナビゲーション文言は `category/NavigationSidebarMessagesMap` 経由で登録される。
- `GeneratorStage.vue` のサイズプリセット値（例: `300x400`）・倍率の `%`・寸法単位の `px` は技術的な数値表記として扱い、翻訳漏れには含めていない。
- `IssuesBadge.vue` の `issue.category` / `issue.reason` は動的な parse issue データ。今回の対象外である生成元全体の文言までは確認していないため、翻訳漏れとは断定していない。
- missing key / dynamic key / locale formatting: 明確な検出なし（上記の固定日本語表示とサマリ生成を除く）。

## 集計

- 対象ファイル数: 5（全完了）
- 確定検出件数: 13項目（hardcoded string 12、empty or untranslated value 1。複数箇所をまとめた行あり）
- 要確認件数: 0

## 調査上の制約

- 対象外ファイルは、対象内の翻訳参照先・表示値の生成元を確認するために必要な範囲だけ読み取り、監査対象には追加していない。
- コード・翻訳定義・設定ファイル・`progress.md` は変更していない。
