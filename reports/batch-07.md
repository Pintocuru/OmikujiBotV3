# Batch 07 — i18n audit

- Repository: `Pintocuru/OmikujiBotV3`
- Branch: `docs/i18n-audit-preparation`
- Scope: `src/editor/assets/` の8ファイル
- Total lines: 720
- Code changes: none

## 対象ファイル

1. `src/editor/assets/mikuji/weight/WeightItemRun.vue` (60 lines)
2. `src/editor/assets/mikuji/weight/WeightItemSummary.vue` (90)
3. `src/editor/assets/placeholders/PlaceholderInputMode.vue` (83)
4. `src/editor/assets/placeholders/PlaceholderPreview.vue` (68)
5. `src/editor/assets/placeholders/PlaceholderTextMode.vue` (172)
6. `src/editor/assets/placeholders/PlaceholderValuesEditor.vue` (53)
7. `src/editor/assets/scenarios/Message/MessageSettings.vue` (126)
8. `src/editor/assets/scenarios/ScenarioConnectDialog.vue` (68)

## 検出結果

| ファイルパス:行                | 該当コード                                              | 問題の種類         | 推奨修正                                                         | 確度               |
| ------------------------------ | ------------------------------------------------------- | ------------------ | ---------------------------------------------------------------- | ------------------ |
| `WeightItemSummary.vue:17`     | `item.name                                              |                    | 'アイテム'`                                                      | ハードコード文字列 | fallback 表示を翻訳キー化する。 | 高  |
| `WeightItemSummary.vue:21`     | `title="名前・説明を編集"`                              | ハードコード文字列 | title を翻訳キー化する。                                         | 高                 |
| `WeightItemSummary.vue:35`     | `追加条件`                                              | ハードコード文字列 | 既存の `omikujiItem.priority.sectionTitle` を使用する。          | 高                 |
| `WeightItemSummary.vue:37-38`  | `優先` / `条件`                                         | ハードコード文字列 | badge 文言を翻訳キー化する。                                     | 高                 |
| `ScenarioConnectDialog.vue:19` | `key:`                                                  | ハードコード文字列 | 英語固定が意図されていなければ翻訳キー化する。                   | 中                 |
| `PlaceholderMessages.ts:12,40` | `lineCount: '{count}行'` / `lineCount: '{count} lines'` | 複数形             | 英語で count=1 の場合 `1 lines` になるため、単数・複数を分ける。 | 高                 |

## 照合結果

- `WeightItemRun.vue` の control command 動的キーは、`return` / `continue` の ja/en 定義に対応。scenario の未設定・参照切れ表示も `omikujiItem.scenario.*` に存在。
- `WeightItemSummary.vue` の「追加条件」は既存キーと一致。item fallback と「優先」/「条件」の対応キーは確認できず、翻訳キー追加が必要。
- Placeholder関連4コンポーネントの `placeholder.*` 参照は `PlaceholderMessages.ts` の ja/en に存在。同モジュールは `messageModules.ts` に登録済み。
- `lineCount` は ja/en ともキー自体は存在するが、英語の単数形が未対応。
- `MessageSettings.vue` の通常の翻訳キー参照は ja/en に存在。slot の `meta.title` / `meta.description` は動的値であり、定義元を今回の範囲で特定できなかったため要確認。
- `ScenarioConnectDialog.vue` の `connections.connectDialog.*` は ja/en に存在し、翻訳モジュールも登録済み。
- placeholder の textarea 例文は locale ごとに翻訳されている。

## 集計

- Missing key（確定）: 0
- Missing key（要確認）: 0
- ハードコード文字列: 6
- 空・未翻訳の値: 0
- 動的キー候補: 0
- ロケール・複数形: 1
- 要確認: 1（`MessageSettings.vue` の動的 slot metadata）

## 静的解析

ESLint / eslint-plugin-vue は依存関係に存在するが、vue-i18n 専用 plugin / vue-i18n-extract はなく、専用ルールも確認されていない。

GitHub API 環境ではコマンド実行不可のため lint は未実行。

## 調査上の制約

GitHub 上のソース・翻訳定義を読み取り確認。コード変更なし。
