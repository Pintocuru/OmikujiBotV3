[English](README.md) | 日本語

# OmikujiBot

OmikujiBotは、配信向けアプリ「わんコメ」専用のおみくじBOTを作るプロジェクトです。
BOT本体の「Generator」と、その設定データを作成・編集する「Editor」を中心に、配信画面UIやゲームスクリプト、データ管理機能などで構成されています。

## 構成

### Generator : BOT本体 (`src/generator`)

設定データを読み込み、コメントやタイマーなどのイベントを処理します。トリガー条件に応じておみくじを抽選し、ステップやゲームスクリプトを実行して、配信画面に表示するメッセージを生成します。

[詳細: Generator](docs/architecture/Generator.md)

### Editor : 設定エディター (`src/editor`)

Generatorが使用する設定データをGUIで作成・編集します。おみくじ、イベント、トリガー、キャラクター、UIなどを設定できます。

[詳細: Editor](docs/architecture/Editor.md)

### UI : 配信画面UI (`src/ui`)

コメント吹き出し、ランキング、カウンターなど、配信画面に表示するUIコンポーネントを提供します。UIごとのレイアウトや設定画面も含みます。

[詳細: UI](docs/architecture/UI.md)

### Manager : データマネージャー (`src/manager`)

EditorやGenerator、LiveConsoleが利用する設定ファイルや配信データを、サーバーAPI経由で管理します。

[詳細: Manager](docs/architecture/Manager.md)

### Games : ゲームスクリプト (`src/games`)

Generatorから実行されるゲーム・ツール用スクリプトです。実行結果としてステップやランキングメッセージなどを返します。

[詳細: Games](docs/architecture/Games.md)

### Plugin : わんコメプラグイン (`src/plugin`)

OmikujiBot専用のわんコメプラグインです。Managerなどが利用するAPIの窓口となり、ゲーム結果やユーザー情報などのデータ管理を支えます。

[詳細: Plugin](docs/architecture/Plugin.md)

### Console : ライブコンソール (`src/console`)

ポン出し、ユーザー操作、ゲームの記録閲覧などをブラウザから行うWebアプリです。

[詳細: Console](docs/architecture/Console.md)

### Server : サーバー処理 (`server`)

わんコメプラグインと開発用Expressサーバーから共通利用されるAPI処理を提供します。開発時にはExpress APIサーバーとVite開発サーバーを起動します。

[詳細: Server](docs/architecture/Server.md)

### Packages : 配布パッケージ (`packages`)

製品ごとの構成やエントリーポイント、ビルド対象を定義します。Generator・Editor・Consoleなどを製品に応じて組み合わせ、Viteでビルドします。

[詳細: Packages](docs/architecture/Packages.md)

## ディレクトリ構造

| ディレクトリ | 内容 |
| --- | --- |
| `src/` | アプリケーションのソースコード |
| `packages/` | 配布パッケージの定義とエントリーポイント |
| `tools/` | ビルド、JSONマージなどの開発ツール |
| `docs/` | 利用者向けマニュアルと開発者向けドキュメント |
| `assets/` | キャラクター画像、サウンドなどの素材 |
| `server/` | 共通API処理と開発用Expressサーバー |

### `src` の中身

| ディレクトリ | 内容 |
| --- | --- |
| `generator/` | BOT本体の初期化、イベント処理、状態管理 |
| `editor/` | 設定エディター |
| `engine/` | おみくじ抽選、ステップ実行、プレースホルダーなどの処理基盤 |
| `games/` | ゲーム・ツール用スクリプト |
| `ui/` | 配信画面UI、UIごとの編集・レイアウト |
| `layout/` | 複数のUIを組み合わせる画面レイアウト |
| `plugin/` | わんコメプラグイン |
| `manager/` | データ管理画面とAPIクライアント |
| `console/` | LiveConsole |
| `sdk/` | わんコメとの接続、コメント購読、投稿 |
| `common/` | 複数機能で共有する処理 |
| `maps/` | UI表示や選択肢などの定義マップ |
| `i18n/` | 多言語対応 |
| `types/` | Zodスキーマ・型定義 |

開発者向けの詳細は [アーキテクチャ資料](docs/architecture/README.md) を参照してください。
