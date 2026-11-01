# i18n 監査レポート batch-25

- バッチ: 25
- ブランチ: `docs/i18n-audit-preparation`
- 調査時点の commit SHA: `08f946f5283cbc665f23bfdc3836b847c251e66a`
- 調査日: 2026-11-01

## 対象ファイル（全4ファイル調査完了）

1. `src/editor/preview/EvaluationBlock/EvaluationBlock.vue`
2. `src/editor/preview/EvaluationBlock/evaluationStats.ts`
3. `src/editor/preview/TestComment/TestComment.vue`
4. `src/editor/preview/VirtualStreamPanel/VirtualStreamPanel.vue`

## 静的解析

- 実施状況: **未実行（実行環境なし）** — GitHub 読み取り API によるソース確認のみ。依存追加・設定変更は行っていない。

## 検出一覧

| ファイルパス:行 | 該当コード（短く） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/preview/EvaluationBlock/EvaluationBlock.vue:11` | `評価ブロック` | hardcoded string | 翻訳キー化 | 高 |
| 同:13, 33 | `一時停止中` / `再開` / `停止` | hardcoded string | 翻訳キー化 | 高 |
| 同:24, 30 | 検索 placeholder / 更新停止の title | hardcoded string | 翻訳キー化 | 高 |
| 同:39, 43–46, 58 | 件数・平均・合計・最大・最小・文字列出現数 | hardcoded string | 単位・ラベルを翻訳キー化 | 高 |
| 同:74–75, 89 | `変数` / `値` / `数値` / `文字` | hardcoded string | 翻訳キー化 | 高 |
| 同:94, 99 | 編集・削除ボタンの title | hardcoded string | 翻訳キー化 | 高 |
| 同:106 | 変数なし／一致なしの空状態 | hardcoded string | 翻訳キー化 | 高 |
| 同:119, 126, 130 | 変数名・値の placeholder、設定ボタン | hardcoded string | 翻訳キー化 | 高 |
| 同:232, 236 | 変数名・値の入力エラー | hardcoded string | 翻訳キー化 | 高 |
| `src/editor/preview/TestComment/TestComment.vue:10, 23, 32, 41–42, 60, 65, 72, 93` | パネル名、人数、再生成、テーマ、カスタム選択肢、placeholder、送信 | hardcoded string | 翻訳キー化 | 高 |
| 同:53 | `MOCK_USER_PICK_MODE_LABELS[mode]` | empty or untranslated value | 参照先 `src/common/MockUser/MockUserPool.ts` の日本語固定ラベル（均等／常連あり）を locale 対応 | 高 |
| 同:63 | `COMMENT_THEMES[key].label` | empty or untranslated value | 参照先 `src/common/MockUser/comments/commentThemes.ts` の日本語固定テーマ名を locale 対応 | 高 |
| 同:79, 100, 103 | `INTERVAL (SEC)` / `STOP`・`AUTO` / `×100` | hardcoded string | UI 表記を翻訳体系に統一（記号・制御語の扱いは仕様に応じて判断） | 中 |
| 同:134, 193 | 初期表示文言／投稿先サービス未取得エラー | hardcoded string | 翻訳キー化 | 高 |
| `src/editor/preview/VirtualStreamPanel/VirtualStreamPanel.vue:7, 19, 49–50` | パネル名、配信中の利用不可メッセージ、実データへ戻す title／ボタン | hardcoded string | 翻訳キー化 | 高 |
| 同:47 | `STOP` / `AUTO` | hardcoded string | UI 表記を翻訳体系に統一（仕様上の固定語なら根拠を明記） | 中 |

## 検出なし（確認済み）

- `src/editor/preview/EvaluationBlock/evaluationStats.ts`: UI 表示文言・翻訳キー参照なし。正規表現、値解析、集計ロジックのみ。
- 対象ファイルから参照されるプリセット翻訳キーのような別途登録が必要な i18n モジュールは確認されなかった。
- locale formatting / pluralization: 明確な検出なし。件数・人数の単位（件、人）は日本語固定であり、上記 hardcoded string に含めた。

## 集計

- 対象ファイル数: 4（全完了）
- 確定検出件数: 16項目（hardcoded string 14、empty or untranslated value 2。複数箇所をまとめた行あり）
- 要確認件数: 0
