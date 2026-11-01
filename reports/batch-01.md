# i18n Audit Batch 01

- 対象: `src/editor/apps/` の先頭8ファイル
- 調査ブランチ: `docs/i18n-audit-preparation`
- 調査時点の commit SHA: `7a057bbcb577dac75e73123a88884f279a2aa4ab`
- 対象ファイル数: 8
- 対象ファイル行数合計: 792
- 調査方式: GitHub API で対象ファイルと翻訳定義・登録箇所を読み取り照合
- コード変更: なし

## 対象ファイル

| ファイル | 行数 | 結果 |
|---|---:|---|
| `src/editor/apps/BaseSettings/BaseEditor.vue` | 91 | 該当なし |
| `src/editor/apps/BaseSettings/BaseTagEditor.vue` | 98 | ハードコードあり |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue` | 199 | ハードコードあり |
| `src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue` | 114 | ハードコードあり |
| `src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue` | 90 | ハードコードあり |
| `src/editor/apps/appInfo/AppInfoEditor.vue` | 69 | 該当なし |
| `src/editor/apps/appInfo/AvailableFeatures/AvailableFeaturesInfo.vue` | 86 | 動的キーの翻訳不足 |
| `src/editor/apps/appInfo/AvailableFeatures/FeatureCard.vue` | 45 | 該当なし |

## 検出一覧

### Missing key / 動的キー

| ファイルパス:行 | 該当コード | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/apps/appInfo/AvailableFeatures/AvailableFeaturesInfo.vue:52,54` | `t(`mapText.uiKind.${kind}.label`)` / `description` | missing key（動的キー） | `UiMapMessages.ts` に不足する UI 種別の `label` / `description` を ja/en 両方追加 | 高 |
| `src/editor/apps/appInfo/AvailableFeatures/AvailableFeaturesInfo.vue:63,65` | `t(`mapText.uiLayout.${key}.label`)` / `description` | missing key（動的キー） | `UiMapMessages.ts` に不足するレイアウトの `label` / `description` を ja/en 両方追加 | 高 |

確認したキー集合:

- `uiKind`: `characterStage`, `commentBubble`, `gameRanking`, `cookieCounter`, `kujibikiPanel`, `liveClock`, `streamCounter`, `toastWidgets`, `userBoard`
- 翻訳定義が存在する `uiKind`: `commentBubble` のみ
- 不足する `uiKind`: `characterStage`, `gameRanking`, `cookieCounter`, `kujibikiPanel`, `liveClock`, `streamCounter`, `toastWidgets`, `userBoard`（8種類 × label/description = 16 leaf keys）
- `uiLayout`: `commentBubble`, `gameRanking`, `sesupinTest`
- 翻訳定義が存在する `uiLayout`: `commentBubble` のみ
- 不足する `uiLayout`: `gameRanking`, `sesupinTest`（2種類 × label/description = 4 leaf keys）

上記は候補だけではなく、次の実装を照合して確認した。

- `src/maps/OmikujiData/ui/UiKindMap.ts`: UI 種別9種類
- `src/maps/OmikujiData/ui/UiLayoutMap.ts` および `src/types/OmikujiData/ui/UiLayoutSchema.ts`: レイアウト3種類
- `src/registerRuntime.ts`: UI 9種類・レイアウト3種類をすべて登録
- `src/i18n/editor/OmikujiDataMaps.ts`: 各マップ翻訳を統合
- `src/i18n/editor/maps/UiMapMessages.ts`: 現状 commentBubble のみ定義

したがって、登録済み機能の一覧表示で不足キーが実際に参照される。vue-i18n の fallback により日本語表示にはなり得るが、英語ロケールでは英語翻訳にならない。

なお、同ファイルの `appInfoEditor.features.${section.id}`（`ui` / `layout` / `gameScript`）は `AppInfoEditor.ts` に全キーが存在する。また `mapText.gameMeta.${key}` は `ScenarioMapMessages.ts` に登録済み8種類すべての `name` / `description` が存在するため、今回の missing key には含めない。

### Hardcoded string

| ファイルパス:行 | 該当コード（短縮） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| `src/editor/apps/BaseSettings/BaseTagEditor.vue:16` | `placeholder="タグを追加"` | hardcoded string | `BaseSettingsEditor.ts` に placeholder 用キーを追加し、翻訳関数を利用 | 高 |
| `src/editor/apps/BaseSettings/BaseTagEditor.vue:19` | `追加` | hardcoded string | 同上。追加ボタン用キーを追加 | 高 |
| `src/editor/apps/BaseSettings/BaseTagEditor.vue:24` | `候補(クリックで追加)` | hardcoded string | 候補見出し用キーを追加 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:7` | `マージ設定を追加` | hardcoded string | JsonMerge 用翻訳モジュールを作成し、ja/en を定義 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:13` | `message="マージ設定がありません。"` / `sub="下のボタンから追加してください。"` | hardcoded string | 空状態メッセージ2項目を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:41-42` | `'マージ設定'` / `'(ファイル未設定)'` | hardcoded string | リスト表示用の fallback 文言を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:60` | `マージ設定編集:` / `設定${selectedIndex + 1}` | hardcoded string | 編集ヘッダーと名前 fallback を翻訳キー化。番号はパラメータで渡す | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:68` | `label="マージ名"` / `description="識別しやすい名前"` | hardcoded string | SettingItem の label / description を翻訳キー参照に変更 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:78-79` | `キーリマップ設定` / `リマップ追加` | hardcoded string | 見出し・追加ボタン用キーを追加 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:83` | `リマップ設定がありません` | hardcoded string | 空状態用キーを追加 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:99` | `上のリストからマージ設定をクリックして編集してください` | hardcoded string | 未選択時メッセージを翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeEditor.vue:172` | `(コピー)` | hardcoded string | 複製名 suffix の扱いを locale 対応にするか検討。保存データの名前に入るため、単純な表示翻訳と分けて仕様確認 | 中 |
| `src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue:5-6` | `リマップ` / `title="このリマップを削除"` | hardcoded string | 見出し・削除 title を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue:11,18` | `元キャラキー` / `新キャラキー` | hardcoded string | SettingItem label を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue:20,25` | `キャラクターを選択してください` / `入力されてません` | hardcoded string | option placeholder・入力エラーを翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue:29,39` | `元アイコンキー` / `新アイコンキー` | hardcoded string | SettingItem label を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeRemapEditor.vue:31,41` | `アイコンキーを選択…` | hardcoded string | option placeholder を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue:5` | `label="マージ元ファイル"` | hardcoded string | SettingItem label を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue:11` | `ファイルを選択してください` | hardcoded string | option placeholder を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue:18` | `入力されてません` | hardcoded string | 入力エラーを翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue:22` | `複数用のキーサフィックス` / `マージ時に元のキーに付加する接尾辞` | hardcoded string | SettingItem label / description を翻訳キー化 | 高 |
| `src/editor/apps/JsonMerge/JsonMergeSourceFileSelector.vue:28` | `キャラクターキーを入力(1文字目は自動で大文字になります)` | hardcoded string | placeholder を翻訳キー化 | 高 |

上表の hardcoded string は、表示文言・操作補助文言を対象にした検出。コードコメント、内部ログ（例: `console.error`）、記号だけの表示、ユーザーが入力したタグ・ファイル名は含めていない。

## 問題なしと確認した箇所

- `BaseEditor.vue`: `baseSettings.*` の label / description を使用。対応する `BaseSettingsEditor.ts` に ja/en があり、登録モジュールにも含まれる。
- `AppInfoEditor.vue`: `appInfoEditor.*` の参照先は `AppInfoEditor.ts` に ja/en があり、登録済み。
- `AvailableFeaturesInfo.vue`: `appInfoEditor.features.*` と `mapText.gameMeta.*` は照合した範囲で不足なし。上記の UI 種別・レイアウトのみ不足。
- `FeatureCard.vue`: 親から受け取った title / description を表示しており、直接のハードコード文言なし。

## 複数形・日付・数値フォーマット

対象8ファイル内では、locale に応じた複数形・日付・数値フォーマットの不足は確認できなかった。JsonMerge の見出しに使う連番は翻訳キーのパラメータ化が適切。

## 静的解析

- package.json に `eslint` と `eslint-plugin-vue` は存在。
- `@intlify/eslint-plugin-vue-i18n` と `vue-i18n-extract` は package.json に存在しない。
- `eslint.config.ts` に vue-i18n 専用 plugin / rule の設定はない。
- GitHub API の読み取り環境からは `npm run lint` 等を実行できないため、静的解析コマンドは未実行。実行済みとして扱っていない。

## 集計

| 種類 | 件数 |
|---|---:|
| missing key（動的キーの不足エントリー） | 10 |
| missing leaf translation values | 20 |
| hardcoded UI strings | 33 |
| locale formatting / pluralization | 0 |
| 要確認 | 0 |

※ missing key は UI 種別8種類 + レイアウト2種類。各エントリーに label / description の2 leaf key が不足。
※ hardcoded UI strings は画面に表示される文字列単位の集計。複製名 suffix は仕様判断を含むため確度「中」。
