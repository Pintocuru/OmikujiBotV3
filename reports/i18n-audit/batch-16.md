# i18n 監査レポート — バッチ 16

- 対象ブランチ: `main`（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 対象範囲: `src/editor/helpers/IconKeyChanger/` 配下（.vue 2 ファイル + composables 1 ファイル）
- 実施日: 2026-11-01

## 対象ファイル一覧

| ファイル                                                           | 調査状況         |
| ------------------------------------------------------------------ | ---------------- |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue`             | 完了             |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue`       | 完了             |
| `src/editor/helpers/IconKeyChanger/composables/useIconKeyStats.ts` | 完了（該当なし） |

## 翻訳構造の確認結果

- バッチ15と同一構成を確認済み（`messageModules.ts` 26 モジュール登録、`src/editor/i18n.ts` で deepMerge、`ja` / `en`、fallback `ja`）。
- 本バッチのファイルは `t()` / `$t()` を直接使用していない。間接的に参照する翻訳キーは `useDataExtractor`（CharacterChanger 側）由来の `mapText.scope.single` / `mapText.scope.category` / `categories.{category}.label` のみで、バッチ15で全候補が ja / en とも定義済みと照合済み。
- `src/i18n/editor/helpers/` に IconKeyChanger 用のメッセージモジュールは未登録（`clipboardMessages` / `keyEditorMessages` のみ）。

## 静的解析

- **未実行**（バッチ15と同様、GitHub 読み取り API のみで実行環境なし。依存追加・lockfile 変更禁止のため `@intlify` 系 plugin は導入せず）。
- 代替: GitHub API による全文取得 + 翻訳定義との手動照合。

## 検出一覧

本バッチの .vue 2 ファイルは `t()` / `$t()` を一切使用しておらず、UI 文言がすべて日本語ハードコード。`useIconKeyStats.ts` は UI 向け文字列なし（コメントのみ）で該当なし。

| ファイルパス:行番号                                             | 該当コード（短く）                                                                                         | 問題の種類        | 推奨修正                                                                      | 確度             |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------- | ---------------- |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:5`        | `:data-tip="hasInvalidIconKeys ? '不正なアイコンキーが使用されています！' : '使用中のアイコンを確認する'"` | hardcoded string  | キー化して `t()` で参照（ツールチップ属性は重点対象）                         | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:9`        | `使用アイコン`（ボタンラベル）                                                                             | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:10`       | `⚠️ 不正 {{ invalidIconKeyCount }}`                                                                        | hardcoded string  | キー化（数値はパラメータ化）                                                  | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:20`       | `{{ scopeLabel }}の使用アイコン`                                                                           | hardcoded string  | 文言全体をメッセージ化し scopeLabel をパラメータに                            | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:25`       | `現在使用されているアイコン:`                                                                              | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:26`       | `使用されているアイコンはありません。`（空状態）                                                           | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:29`       | `{{ getCharacterName(...)                                                                                  |                   | group.characterKey                                                            |                  | '空欄' }}`                   | hardcoded string | `空欄` をキー化 | 高  |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:37`       | `{{ icon.invalid ? '⚠️ ' : '' }}{{ icon.iconKey                                                            |                   | '空欄' }}`                                                                    | hardcoded string | `⚠️` 接頭辞・`空欄` をキー化 | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:38`       | `({{ icon.count }}箇所)`                                                                                   | locale formatting | 数値+単位をメッセージ化（vue-i18n 複数形 / `n()` 検討）                       | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:47`       | `不正アイコンキー`（stat-title）                                                                           | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:56`       | `存在しないアイコンキーが使用されています。`                                                               | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:57`       | `画像が表示されません。有効なキーへ変更してください。`                                                     | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:63`       | `すべてのアイコンキーは有効です。`（成功アラート）                                                         | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:81`       | `変更内容の確認`                                                                                           | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:85`       | `{{ formatPreviewLabel(...) }} → 「{{ newKey }}」 ({{ ... }}箇所)`（L85–87 の文字列連結）                  | locale formatting | 文言全体をメッセージ化し件数をパラメータに（括弧・引用符・`箇所` が ja 固有） | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:92`       | `⚠️ この操作は{{ scopeLabel }}に影響します。元に戻すことはできません。`                                    | hardcoded string  | 文言全体をメッセージ化し scopeLabel をパラメータに                            | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:102`      | `saveName="変更を実行"`                                                                                    | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyChanger.vue:187`      | `` return `「${charName} / ${iconKey}」` ``（script 内 `formatPreviewLabel`）                              | locale formatting | 鍵括弧（`「」`）が ja 固有のためメッセージ化                                  | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:5`  | `アイコンの変更設定`                                                                                       | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:6`  | `すべてクリア`（ボタン）                                                                                   | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:16` | `変更前`                                                                                                   | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:17` | `⚠️ {{ pair.iconKey                                                                                        |                   | '空欄' }}`                                                                    | hardcoded string | `⚠️` 接頭辞・`空欄` をキー化 | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:20` | `{{ usageCount[...] ?? 0 }}箇所`                                                                           | locale formatting | 数値+単位をメッセージ化                                                       | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:25` | `→`（変更前→変更後の記号）                                                                                 | 要確認            | 記号自体は共通化可能だが、レイアウト意図が不明のため要確認（バッチ15と同種）  | 低               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:29` | `変更後`                                                                                                   | hardcoded string  | キー化                                                                        | 高               |
| `src/editor/helpers/IconKeyChanger/IconKeyMappingEditor.vue:38` | `<option value="">変更しない</option>`                                                                     | hardcoded string  | キー化                                                                        | 高               |

## 動的キー・missing key の照合（検出なし・記録用）

- 本バッチ内に `t()` の動的キーは新規になし。間接参照している `scopeLabel` は `useDataExtractor.ts:44–45`（バッチ15で照合済み、missing key なし）由来。
- `missing key`: 0 件 / `empty or untranslated value`: 0 件（本バッチが参照する翻訳定義の範囲内）。

## 集計

- 対象ファイル: 3（完了 3 / 未完了 0）
- 確定検出: 26 件
  - hardcoded string: 20 件
  - locale formatting: 5 件
  - 要確認（`→` 記号、確度低）: 1 件
  - うち確度「高」25 件 / 「低（要確認）」1 件
- 静的解析: 未実行（GitHub 読み取り API のみ。ソース全文取得と手動照合で代替）

## 備考

- 行番号は commit `bed0d9d` の実ファイル本文から行単位で確認した値。
- IconKeyChanger は CharacterChanger と同様 `vue-i18n` を一切経由しておらず、英語ロケールではすべて日本語表示になる。CharacterChanger 用と共通化できる文言（`すべてクリア` / `変更前` / `変更後` / `変更しない` / `変更を実行` / `〜箇所` 等）が多いため、翻訳対応時にはモジュール横断の共通キー設計を推奨（本調査では変更せず）。
- バッチ15（CharacterChanger）と文言パターンがほぼ同一。`src/i18n/editor/helpers/` への新規メッセージモジュール作成 + `messageModules.ts` 登録が別途必要。
