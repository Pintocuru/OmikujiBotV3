# Packages

## 役割

Generator、Editor、LiveConsoleなどを配布用の製品として組み立てるためのパッケージ定義とビルド処理です。

## 構成

- `packages/build.ts`: ビルドの起点。ビルド対象を読み込み、プリセットJSONのmeta同期後にビルドを実行
- `packages/index.ts`: 現在ビルドするパッケージの一覧
- `packages/common/`、`packages/2026-Q4/`: 製品ごとの定義とエントリーポイント
- `packages/_shared/`: 複数パッケージで共有する登録処理
- `tools/viteBuild/`: Viteを使ったパッケージビルド処理
- `tools/viteConfig/`: Vite設定

## パッケージ定義とビルド対象

各製品の `build.ts` は製品情報(`PROJECT`)とバリエーション(`VARIANTS`)を定義し、`definePackage(import.meta.url, PROJECT, VARIANTS)` を default export します。

ここに記載する製品はパッケージ定義が存在するものです。実際にビルドされるかどうかは `packages/index.ts` の配列への登録状態で決まります。

| カテゴリ | key | 製品名 | BOOTH ID | バリエーション | 現在のビルド |
| --- | --- | --- | --- | --- | --- |
| common | OmikujiBot | おみくじBOT | なし | 通常（Editor・Console込み、プリセットJSONなし） | 対象 |
| common | StrawberryChocolate | ストロベリーショコラ | 7733810 | 通常（Editor・Console込み） | 対象外 |
| 2026-Q4 | GouseiSuika | スイカジェネレーター +カボチャ&クジラ | 5813323 | 通常 / Adv（ともにConsole付き。AdvのみEditor込み） | 対象外 |
| 2026-Q4 | HondaJanken | じゃんけん HondaJanken | 7383088 | 通常（Editor込み） | 対象外 |
| 2026-Q4 | LifeHourglass | 命の砂時計 LifeHourglass | 9219010 | 通常 / Adv（AdvのみEditor込み） | 対象 |
| 2026-Q4 | MaidenOmikuji | 巫女さんのおみくじ | 5471598 | 通常（Editor込み） | 対象外 |

- `packages/index.ts` では現在、OmikujiBotとLifeHourglassのみを有効にしています。
- `packages/2026-Q4/LiverBingo/` のように製品フォルダが存在していても、定義がビルド一覧に登録されていなければビルド対象にはなりません。
- BOOTH ID は各製品の `build.ts` にある `boothId` です。URLは `https://booth.pm/ja/items/<BOOTH ID>` の形式です。

## エントリーポイント

エントリーポイントやコピー対象ファイルなどのビルド設定は `tools/viteBuild/core/ConfigResolver.ts` が解決します。keyとcategoryはフォルダ名(`packages/<category>/<key>/build.ts`)から決まります。

| ファイル | 用途 |
| --- | --- |
| `main.ts` | Generator |
| `editor.ts` | Editor |
| `console.ts` | LiveConsole |

EditorやConsoleを含めるかは、各バリエーションの `withEditor` / `withConsole` で指定します。指定されたエントリーポイントだけがビルド設定に含まれます。

## ビルド処理

ルートの `npm run build` は `packages/build.ts` を実行します。

1. `packages/index.ts` からビルド対象を取得
2. `syncPresetMeta(packages)` で対象パッケージのプリセットJSONのmetaを同期
3. `buildPackages(packages)` を実行
4. ビルド設定の解決、distの掃除、型チェック、各エントリーポイントのビルド、ファイルコピー、生成物の後処理、ZIP化

現在のパッケージビルドはViteを使用します。

## README

`ConfigResolver.ts` はパッケージのREADME URLを `docs/<category>/<series>/README.ja.md` として生成します。一方、リポジトリ内で確認できるLifeHourglassのドキュメントは `docs/2026-Q4/LifeHourglass/README.md` です。URLと実ファイル名が一致していないため、READMEを配布ページから参照する場合は整合性の確認が必要です。

関連: [Generator](./Generator.md)、[Editor](./Editor.md)、[Server](./Server.md)
