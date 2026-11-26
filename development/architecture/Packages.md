# Packages

## 役割

Generator、Editor、LiveConsoleなどを配布用の製品として組み立てるための設定とビルド処理です。

## 構成

- `packages/build.ts`: ビルド全体の起点。ビルド前に `packages/syncMeta.ts` の内容(プリセットJSONのmeta同期)を実行してから buildPackages を呼ぶ
- `packages/index.ts`: ビルドするパッケージの一覧 (コメントアウトで絞る)
- `packages/syncMeta.ts`: プリセットJSONの meta 更新 (`npm run sync:meta`。上記のビルド前同期と同じ処理)
- `packages/common/`: 共通カテゴリの製品定義とエントリーポイント
- `packages/2026-Q4/`: 2026-Q4 カテゴリの製品定義とエントリーポイント
- `packages/_shared/`: 複数パッケージで共有する登録処理
- `tools/viteBuild/`: Viteを使ったパッケージビルド処理
- `tools/viteConfig/`: Vite設定

## パッケージ一覧

`packages/index.ts` に登録された製品の一覧です。製品情報(title・description・boothId・licenseLabel)とバリエーションは、各パッケージの `build.ts` に定義されています。

### common

| key                 | 製品名               | 説明                                                                     | BOOTH ID  | ライセンス | バリエーション            |
| ------------------- | -------------------- | ------------------------------------------------------------------------ | --------- | ---------- | ------------------------- |
| OmikujiBot          | おみくじBOT          | おみくじ付きBOTジェネレーターとエディター(アップデート用)                | (なし)    | Apache-2.0 | 通常(プリセットJSONなし)  |
| StrawberryChocolate | ストロベリーショコラ | 世話好きなお姉さん「ストロベリーショコラ」が挨拶してくれるジェネレーター | `7733810` | CC-BY 4.0  | 通常(Editor・Console込み) |

### 2026-Q4

| key           | 製品名                                | 説明                                                                       | BOOTH ID  | ライセンス     | バリエーション                 |
| ------------- | ------------------------------------- | -------------------------------------------------------------------------- | --------- | -------------- | ------------------------------ |
| GouseiSuika   | スイカジェネレーター +カボチャ&クジラ | コメントでスイカゲーム風のおみくじを楽しめるジェネレーター                 | `5813323` | 利用規約に従う | 通常 / Adv (ともにConsole付き) |
| HondaJanken   | じゃんけん HondaJanken                | 「じゃんけん」ミニゲームが楽しめるジェネレーター                           | `7383088` | 利用規約に従う | 通常                           |
| LifeHourglass | 命の砂時計 LifeHourglass              | リスナーが配信を閲覧した時間を「砂粒」として表示する、砂時計ジェネレーター | `9219010` | 利用規約に準拠 | 通常 / Adv                     |
| MaidenOmikuji | 巫女さんのおみくじ                    | 巫女さん手製の、真面目なおみくじ。大凶の代わりに「残念賞」が入ってるよ。   | `5471598` | 利用規約に従う | 通常                           |

補足:

- BOOTH ID は BOOTH の製品番号。各パッケージの `build.ts` にある `boothId` の値で、URL は `https://booth.pm/ja/items/<BOOTH ID>` の形式。
- 各パッケージの Readme は `docs/2026-Q4/<パッケージ名>/README.ja.md` に置かれる予定です(LifeHourglass は `docs/2026-Q4/LifeHourglass/` に作成済み)。
- LifeHourglass / GouseiSuika の Adv バリエーションは Editor(設定画面)を含みます。通常バリエーションは Editor を含みません。

## パッケージ定義

各製品の `build.ts` は製品情報(`PROJECT`)とバリエーション(`VARIANTS`)だけを書き、`definePackage(import.meta.url, PROJECT, VARIANTS)` を default export します。key と category はフォルダ名(`packages/<category>/<key>/build.ts`)から決まります。エントリーポイントやコピー対象ファイルなどのビルド設定は `tools/viteBuild/core/ConfigResolver.ts` が解決します。

エントリーポイントは用途別に分かれています。

| ファイル     | 用途        |
| ------------ | ----------- |
| `main.ts`    | Generator   |
| `editor.ts`  | Editor      |
| `console.ts` | LiveConsole |

EditorやConsoleを含めるかはパッケージごとのオプション(`withEditor` / `withConsole`)で指定します。

## ビルド

ルートの `npm run build` は `packages/build.ts` を実行します。ここで `buildPackages` にパッケージ定義を渡し、dist の掃除と型チェック、各エントリーポイントのビルド、ファイルコピー、生成物の後処理、ZIP化を行います。ビルド前に `syncPresetMeta` によるプリセットJSONの meta 同期も実行されます。

現在のパッケージビルドの実行経路はViteです。

関連: [Generator](./Generator.md)、[Editor](./Editor.md)、[LiveConsole](./LiveConsole.md)、[Generator の設定データ](./Generator-data.md)
