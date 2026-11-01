# i18n Audit Batch 02

- 対象: src/editor/apps/ のバッチ02指定8ファイル
- 調査ブランチ: docs/i18n-audit-preparation
- 調査開始時 commit SHA: 1e740cea31c7468b2b104edf73917df968557b25
- 対象ファイル数: 8
- 対象ファイル行数合計: 762
- 調査方式: GitHub API で対象ファイルと翻訳定義を読み取り照合
- コード変更: なし

## 対象ファイル

| ファイル | 行数 | 結果 |
|---|---:|---|
| src/editor/apps/appInfo/meta/PackageBasicInfo.vue | 113 | ハードコードあり |
| src/editor/apps/appInfo/meta/PackageDistributionInfo.vue | 41 | ハードコードあり |
| src/editor/apps/appInfo/meta/PackageSystemInfo.vue | 54 | ハードコードあり |
| src/editor/apps/appInfo/settings/EditorSettingsEditor.vue | 85 | 該当なし（意図的な言語名表記を除く） |
| src/editor/apps/appInfo/settings/GeneratorSettingsEditor.vue | 119 | 該当なし |
| src/editor/apps/dataPacks/DataPackCard.vue | 87 | ハードコードあり |
| src/editor/apps/dataPacks/DataPacks.vue | 163 | ハードコードあり |
| src/editor/apps/dataPacks/useDataPacks.ts | 100 | 該当なし |

## 検出一覧

### Hardcoded string

| ファイルパス:行 | 該当コード（短縮） | 問題の種類 | 推奨修正 | 確度 |
|---|---|---|---|---|
| src/editor/apps/appInfo/meta/PackageBasicInfo.vue:9 | 再生成 | hardcoded string | packageMeta.basic.id に再生成ボタン用 label キーを追加 | 高 |
| src/editor/apps/appInfo/meta/PackageBasicInfo.vue:100-104 | IDを変更しますか？ / 変更すると、このパッケージのIDが新しく生成されます。 / 変更する / キャンセル | hardcoded string | SweetAlert の title / text / confirm / cancel を翻訳キー化 | 高 |
| src/editor/apps/appInfo/meta/PackageDistributionInfo.vue:21 | meta.url || '未設定' | hardcoded string | URL 未設定時の fallback を翻訳キー化 | 高 |
| src/editor/apps/appInfo/meta/PackageSystemInfo.vue:23 | title="最新バージョンを入手する" | hardcoded string | ExternalLinkButton の title を翻訳キー化 | 高 |
| src/editor/apps/dataPacks/DataPackCard.vue:47,52,56,61 | data-tip 2箇所、マージ、置き換え | hardcoded string | tooltip とボタン表示をデータパック用翻訳キーにする | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:6 | データパックを読み込み中... | hardcoded string | ローディング表示を翻訳キー化 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:18-20 | GitHub からのダウンロードへのお礼・無料公開・サポート対象外の説明 | hardcoded string | InformationCard の説明文を翻訳キー化 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:25,36 | タグ絞り込み: / ✕ クリア | hardcoded string | フィルター見出しとクリア操作を翻訳キー化。×はアイコンと文言を分離可能 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:41 | 該当するデータパックが見つかりませんでした | hardcoded string | 空状態メッセージを翻訳キー化 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:62 | 更新 | hardcoded string | 更新ボタンを翻訳キー化 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:91-93 | 現在のデータを置き換えますか？ / pack 名を含む警告文 / 置き換える | hardcoded string | confirm dialog の title / text / confirm label を翻訳キー化。pack 名はパラメータで渡す | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:101,104-105 | 読み込みエラー / invalid-metadata 文 / 不明なエラーが発生しました | hardcoded string | 読み込み失敗の title と各エラー文を翻訳キー化 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:130-131 | 読み込みました / pack 名を含む完了文 | hardcoded string | 成功通知を翻訳キー化。pack 名はパラメータで渡す | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:136-137 | 置き換えに失敗しました / コンソールログをご確認ください | hardcoded string | 置き換え失敗通知を翻訳キー化 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:148,150-151 | 読み込みエラー / invalid-metadata 文 / 不明なエラーが発生しました | hardcoded string | 部分読み込み経路でも同じ翻訳キーを再利用 | 高 |
| src/editor/apps/dataPacks/DataPacks.vue:159 | 読み込みに失敗しました / コンソールログをご確認ください | hardcoded string | 部分読み込み失敗通知を翻訳キー化 | 高 |

合計33箇所。行範囲でまとめている箇所も、文字列の出現箇所を単位として集計した。

### Missing key / 翻訳定義照合

- PackageBasicInfo.vue、PackageDistributionInfo.vue、PackageSystemInfo.vue が参照する packageMeta.* は、src/i18n/editor/apps/PackageMetaMessages.ts に ja/en の両方があり、messageModules.ts に登録済み。
- EditorSettingsEditor.vue と GeneratorSettingsEditor.vue が参照する appInfoEditor.settings.* は、src/i18n/editor/apps/AppInfoEditor.ts に ja/en の両方がある。
- commentType.options.${type} は動的キー。翻訳定義には OneComme が ja/en 両方存在する。型の候補値全体をこのバッチの参照範囲では独立に確定できなかったため、候補が OneComme のみかは要確認。今回の対象コードに missing key の確定検出はない。
- messageModules.ts には apps/PackageMetaMessages が登録されている。モジュール登録漏れはない。

### 意図的な表記として除外したもの

- PackageBasicInfo.vue:4 の id: データ識別子そのものを示す短い技術ラベル。
- EditorSettingsEditor.vue:75-78 の 日本語 / English: 言語選択肢を各言語の自称で表示する表記。翻訳漏れとは扱わない。
- GeneratorSettingsEditor.vue:39 の s: 秒の SI 記号であり言語共通。
- DataPackCard の pack.meta.name / pack.meta.description / tag: パッケージに格納されたユーザー・配布者提供のメタデータ。UI 固定文言ではない。
- useDataPacks.ts の console.error: 開発者向けログであり、画面表示文言ではない。

## 複数形・日付・数値フォーマット

対象ファイルでは複数形・日付・数値の locale 依存フォーマット不足は確認できなかった。秒数の s は SI 記号として使用されている。

## 静的解析

- ESLint / eslint-plugin-vue は package.json に存在。
- vue-i18n 専用 ESLint plugin / vue-i18n-extract は依存関係に存在せず、eslint.config.ts に専用ルール設定もない。
- GitHub API の読み取り環境からはリポジトリ内コマンドを実行できないため、静的解析は未実行。

## 集計

| 種類 | 件数 |
|---|---:|
| missing key（確定） | 0 |
| missing key（要確認） | 1（動的キー候補集合の確認） |
| hardcoded UI strings | 33 |
| empty / untranslated values | 0 |
| locale formatting / pluralization | 0 |

※ missing key の要確認1件は検出確定数に含めない。
