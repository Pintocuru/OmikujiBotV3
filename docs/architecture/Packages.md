# Packages

## 役割

Generator、Editor、LiveConsoleなどを配布用の製品として組み立てるための設定とビルド処理です。

## 構成

- `packages/build.ts`: ビルド全体の起点
- `packages/buildProjects.ts`: パッケージ定義の集約
- `packages/common/`: 共通カテゴリの製品定義とエントリーポイント
- `packages/_shared/`: 複数パッケージで共有する登録処理
- `tools/viteBuild/`: Viteを使ったパッケージビルド処理
- `tools/viteConfig/`: Vite設定

## パッケージ定義

各製品の `build.ts` は製品情報、ビルド対象、パッケージプロジェクト設定を定義します。`createPackageProject` によってエントリーポイントやコピー対象ファイルなどを含むビルド設定を生成します。

エントリーポイントは用途別に分かれています。

| ファイル | 用途 |
| --- | --- |
| `main.ts` | Generator |
| `editor.ts` | Editor |
| `console.ts` | LiveConsole |

EditorやConsoleを含めるかはパッケージごとのオプションで指定します。

## ビルド

ルートの `npm run build` は `packages/build.ts` を実行します。ここで `ViteBuilder` にパッケージ定義とビルド対象を渡し、型チェック等の事前処理、各エントリーポイントのビルド、ファイルコピー、生成物の後処理、ZIP化を行います。

現在のパッケージビルドの実行経路はViteです。一方、リポジトリにはWebpack関連の旧実装・依存も残っているため、Webpack関連コードが完全に撤去済みという意味ではありません。

関連: [Generator](./Generator.md)、[Editor](./Editor.md)、[UI](./UI.md)、[Console](./Console.md)
