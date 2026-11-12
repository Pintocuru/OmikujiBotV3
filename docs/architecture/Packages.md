# Packages

## 役割

Generator、Editor、LiveConsoleなどを配布用の製品として組み立てるための設定とビルド処理です。

## 構成

- `packages/build.ts`: ビルド全体の起点 (`buildPackages` を呼ぶだけ)
- `packages/index.ts`: ビルドするパッケージの一覧 (コメントアウトで絞る)
- `packages/syncMeta.ts`: プリセットJSONの meta 更新 (`npm run sync:meta`。ビルドとは独立)
- `packages/common/`: 共通カテゴリの製品定義とエントリーポイント
- `packages/_shared/`: 複数パッケージで共有する登録処理
- `tools/viteBuild/`: Viteを使ったパッケージビルド処理
- `tools/viteConfig/`: Vite設定

## パッケージ定義

各製品の `build.ts` は製品情報(`PROJECT`)とバリエーション(`VARIANTS`)だけを書き、`definePackage(import.meta.url, PROJECT, VARIANTS)` を default export します。key と category はフォルダ名(`packages/<category>/<key>/build.ts`)から決まります。エントリーポイントやコピー対象ファイルなどのビルド設定は `tools/viteBuild/core/ConfigResolver.ts` が解決します。

エントリーポイントは用途別に分かれています。

| ファイル     | 用途        |
| ------------ | ----------- |
| `main.ts`    | Generator   |
| `editor.ts`  | Editor      |
| `console.ts` | LiveConsole |

EditorやConsoleを含めるかはパッケージごとのオプションで指定します。

## ビルド

ルートの `npm run build` は `packages/build.ts` を実行します。ここで `buildPackages` にパッケージ定義を渡し、dist の掃除と型チェック、各エントリーポイントのビルド、ファイルコピー、生成物の後処理、ZIP化を行います。

現在のパッケージビルドの実行経路はViteです。一方、リポジトリにはWebpack関連の旧実装・依存も残っているため、Webpack関連コードが完全に撤去済みという意味ではありません。

関連: [Generator](./Generator.md)、[Editor](./Editor.md)、[UI](./UI.md)、[Console](./Console.md)
