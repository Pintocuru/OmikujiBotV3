# i18n 監査レポート — バッチ 15

- 対象ブランチ: `main`（デフォルトブランチ）
- commit SHA: `bed0d9d29b9f14936c32799306fe764017ece31b`
- 対象範囲: `src/editor/helpers/CharacterChanger/` 配下（.vue 6 ファイル + composables 4 ファイル）
- 実施日: 2026-11-01

## 対象ファイル一覧

| ファイル                                                                       | 調査状況         |
| ------------------------------------------------------------------------------ | ---------------- |
| `src/editor/helpers/CharacterChanger/CharacterChanger.vue`                     | 完了             |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue`               | 完了             |
| `src/editor/helpers/CharacterChanger/CharacterStatistics.vue`                  | 完了             |
| `src/editor/helpers/CharacterChanger/CurrentCharacterList.vue`                 | 完了             |
| `src/editor/helpers/CharacterChanger/InvalidCharacterAlert.vue`                | 完了             |
| `src/editor/helpers/CharacterChanger/MappingPreview.vue`                       | 完了             |
| `src/editor/helpers/CharacterChanger/composables/useCharacterLookup.ts`        | 完了（該当なし） |
| `src/editor/helpers/CharacterChanger/composables/useCharacterStats.ts`         | 完了（該当なし） |
| `src/editor/helpers/CharacterChanger/composables/useDataExtractor.ts`          | 完了             |
| `src/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters.ts` | 完了（該当なし） |

## 翻訳構造の確認結果

- `src/i18n/editor/messageModules.ts`: 26 モジュールを明示登録（namespace import + `messageModules` オブジェクト）。本バッチ関連は `OmikujiDataMaps`（`mapText` 統合）と `category/NavigationSidebarMessagesMap`（`categories`）。
- `src/editor/i18n.ts`: 登録モジュールの export を走査し、`ja` / `en` を deepMerge。`locale: 'ja'`, `fallbackLocale: 'ja'`, `legacy: false`。
- `mapText.scope.single` / `mapText.scope.category` は `src/i18n/editor/maps/CommonMapMessages.ts`（`OmikujiDataMaps` 経由で登録）に ja / en とも存在。
- `categories.{category}.label` は `src/i18n/editor/category/NavigationSidebarCategoriesMessages.ts` に存在。動的キー候補（`TargetCategoryType` = `comments` / `timers` / `services` / `reactions` / `pads` / `mikuji` / `scenarios`）は全て ja / en とも定義済み。

## 静的解析

- **未実行**。本調査は GitHub 読み取り API のみで実施しており、リポジトリ内コマンド（`npm run lint` 等）を実行できる環境がないため。
- `@intlify/eslint-plugin-vue-i18n` / `vue-i18n-extract` は package.json に未導入（監査計画 STEP 0 の確認と一致）。依存追加・lockfile 変更は禁止のため導入せず。
- 代替として、GitHub API による全文取得 + 翻訳定義（`messageModules.ts` → 各メッセージファイル）との手動照合を実施。

## 検出一覧

本バッチの .vue ファイルはいずれも `t()` / `$t()` を一切使用しておらず、UI 文言がすべて日本語ハードコード。composables 3 ファイル（`useCharacterLookup` / `useCharacterStats` / `useScenarioStepCharacters`）は UI 向け文字列なし（コメントのみ）で該当なし。

| ファイルパス:行番号                                                 | 該当コード（短く）                                                                                                   | 問題の種類        | 推奨修正                                                                         | 確度             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------- | ---------------- |
| `src/editor/helpers/CharacterChanger/CharacterChanger.vue:6`        | `:data-tip="hasInvalidCharacters ? '存在しないキャラクターが使用されています！' : '使用中のキャラクターを確認する'"` | hardcoded string  | キー化して `t()` で参照（ツールチップ属性は重点対象）                            | 高               |
| `src/editor/helpers/CharacterChanger/CharacterChanger.vue:10`       | `使用キャラ`（ボタンラベル）                                                                                         | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterChanger.vue:11`       | `⚠️ 未定義 {{ invalidCharacterCount }}`                                                                              | hardcoded string  | キー化（数値はパラメータ化）                                                     | 高               |
| `src/editor/helpers/CharacterChanger/CharacterChanger.vue:19`       | `{{ scopeLabel }}の使用キャラクター`                                                                                 | hardcoded string  | 文言全体をメッセージ化し scopeLabel をパラメータに                               | 高               |
| `src/editor/helpers/CharacterChanger/CharacterChanger.vue:50`       | `すべてのキャラクターを変更する` / `キャラクターを変更する`                                                          | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterChanger.vue:68`       | `saveName="変更を実行"`                                                                                              | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:5`  | `キャラクターの変更設定`                                                                                             | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:6`  | `すべてクリア`（ボタン）                                                                                             | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:17` | `変更前`                                                                                                             | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:24` | `` `⚠️ ${charKey                                                                                                     |                   | '空欄'}` ``                                                                      | hardcoded string | `空欄`・`⚠️ 未定義` 表記をキー化 | 高  |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:26` | `{{ usageCount[charKey] }}箇所で使用中`                                                                              | locale formatting | 数値+単位の文言をメッセージ化（vue-i18n 複数形 / `n()` 検討）                    | 高               |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:30` | `→`（変更前→変更後の記号）                                                                                           | 要確認            | 記号自体は共通化可能だが、レイアウト意図が不明のため要確認                       | 低               |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:34` | `変更後`                                                                                                             | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterMappingEditor.vue:41` | `<option value="">変更しない</option>`                                                                               | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterStatistics.vue:5`     | `対象アイテム数`                                                                                                     | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterStatistics.vue:9`     | `使用中のキャラクター`                                                                                               | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CharacterStatistics.vue:13`    | `未定義キャラクター`                                                                                                 | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CurrentCharacterList.vue:4`    | `現在使用されているキャラクター:`                                                                                    | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/CurrentCharacterList.vue:11`   | `` `⚠️ 未定義: ${charKey                                                                                             |                   | '空欄'}` ``                                                                      | hardcoded string | キー化                           | 高  |
| `src/editor/helpers/CharacterChanger/CurrentCharacterList.vue:12`   | `({{ usageCount[charKey] }}箇所)`                                                                                    | locale formatting | 数値+単位をメッセージ化                                                          | 高               |
| `src/editor/helpers/CharacterChanger/InvalidCharacterAlert.vue:6`   | `存在しないキャラクターが使用されています。`                                                                         | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/InvalidCharacterAlert.vue:7`   | `これらのキャラクターは正常に動作しません。適切なキャラクターに変更してください。`                                   | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/MappingPreview.vue:6`          | `変更内容の確認`                                                                                                     | hardcoded string  | キー化                                                                           | 高               |
| `src/editor/helpers/CharacterChanger/MappingPreview.vue:10`         | `「...」 → 「...」 ({{ ... }}箇所)`（L10–12 の文字列連結）                                                           | locale formatting | 文言全体をメッセージ化し名前・件数をパラメータに（括弧・引用符・単位が ja 固有） | 高               |
| `src/editor/helpers/CharacterChanger/MappingPreview.vue:17`         | `⚠️ この操作は{{ scopeLabel }}に影響します。元に戻すことはできません。`                                              | hardcoded string  | 文言全体をメッセージ化し scopeLabel をパラメータに                               | 高               |

## 動的キーの照合（検出なし・記録用）

- `src/editor/helpers/CharacterChanger/composables/useDataExtractor.ts:45` — ``t(`categories.${category}.label`)``。`TargetCategoryType` の候補（`comments` / `timers` / `services` / `reactions` / `pads` / `mikuji` / `scenarios`）を `src/types/OmikujiData/events/EventCategorySchema.ts`・`CategoryType.ts` と `NavigationSidebarCategoriesMessages.ts` で照合し、全候補が ja / en とも定義済みのため **missing key なし**。ただし今後カテゴリ追加時に追随が必要な動的キーであることは留意点。
- 同ファイル L44 の `mapText.scope.single`、L45 の `mapText.scope.category`（`{category}` プレースホルダ付き）は `CommonMapMessages.ts` に ja / en とも存在し、**翻訳値の不足もなし**。

## 集計

- 対象ファイル: 10（完了 10 / 未完了 0）
- 確定検出: 25 件（hardcoded string 19 件、locale formatting 4 件、要確認 1 件（`→` 記号、確度低）、動的キー関連の missing key 0 件）
  - うち確度「高」24 件 / 「低（要確認）」1 件
- missing key: 0 件 / empty or untranslated value: 0 件（参照した翻訳定義の範囲内）
- 静的解析: 未実行（GitHub 読み取り API のみのため。ソース全文取得と手動照合で代替）

## 備考

- 行番号は commit `bed0d9d` の実ファイル本文から行単位で確認した値。
- 本バッチの `.vue` 6 ファイルは `vue-i18n` を一切経由していないため、英語ロケールではすべて日本語表示になる。`src/i18n/editor/helpers/` には `clipboardMessages` / `keyEditorMessages` のみが登録済みで、CharacterChanger 用のメッセージモジュールは未登録。翻訳対応時には新規メッセージファイルの作成と `messageModules.ts` への登録が両方必要（本調査では変更せず）。
