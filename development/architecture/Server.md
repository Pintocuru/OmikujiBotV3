# Server

## 役割

Manager、Generator、LiveConsoleからのAPIリクエストを処理し、設定ファイル・ゲーム状態・ユーザー情報などを管理するサーバー側の共通処理です。

## 共通処理

- `server/api/actions.ts`: クライアントとサーバーが共有するAPIアクション定義
- `server/core/router.ts`: 共通ルーター
- `server/core/handlers/`: APIアクションごとの処理
- `server/core/services/`: ファイルシステムやユーザーリスト等のサービス
- `server/adapters/`: 呼び出し元ごとのリクエスト・レスポンス変換

共通ルーターは、呼び出し元に応じたコンテキストを受け取り、同じAPI処理を実行します。

### ハンドラー

| ハンドラー                             | 役割                                                    |
| -------------------------------------- | ------------------------------------------------------- |
| `configHandler`                        | 設定ファイルの読み書き・移動・削除                      |
| `generatorHandler`                     | Generator設定・パッケージの読み書き                     |
| `omikujiHandler`                       | おみくじデータの保存                                    |
| `gameStateHandler`                     | ゲームログ・ゲームステートの記録と取得                  |
| `userStatsHandler`                     | ユーザーの得点・ユーザーリストの管理(LiveConsole 用)    |
| `padHandler`                           | ポン出し(EventPads)の状態と操作                         |
| `bingoHandler` / `bingoPatternHandler` | ビンゴの進行(LiverBingo との同期)とビンゴパターンの管理 |
| `gameConfigHandler`                    | ブラウザゲームごとの設定ファイルの読み書き              |
| `aiHandler`                            | AI設定の保存と問い合わせ(WordAlchemy などで使用)        |

### サービス

- `fileSystemService` / `directoryService`: ファイルの読み書きと保存先の管理
- `userListService`: コメントユーザーの記録(プラグインの `filterComment` から)と、手動ユーザーの管理
- `aiService`: AI問い合わせの本体

## 本番: わんコメプラグイン

`src/plugin/plugin.ts` から `server/adapters/pluginAdapter.ts` を経由して共通ルーターを呼び出します。プラグイン用コンテキストを使って処理します。

LiveConsoleはブラウザページのため、Axios 経由の HTTP リクエストとしてわんコメに届き、プラグインが受け取ります。

## 開発: Express API

`npm run dev` は `server/start-dev-server.ts` を起動します。このスクリプトは開発用Express APIサーバーとVite開発サーバーを起動します。

Express側は `server/dev-api.ts` で起動し、`server/adapters/expressAdapter.ts` が共通ルーターへ接続します。開発環境ではわんコメがなくても動作確認できるよう、ダミーユーザーの投入など開発専用のAPI(`seed-mock-users`)も許可されます。これらの開発専用アクションは Express コンテキスト(`allowMock`)でのみ有効で、プラグイン経由では存在しないアクションとして扱われます。

開発用APIサーバーは localonly です。`localhost` 以外の Host / Origin からのリクエストを 403 にします(他サイトからの fetch や DNS リバインディング対策)。

## 保存データ

保存対象には設定ファイル、Generator設定、ゲームステート、ユーザー統計、ポン出しの状態、ビンゴのスナップショット/パターン、ゲームごとの設定、AI設定などがあります。具体的な保存先やファイル形式は各ハンドラー・サービスの実装を参照してください。

関連: [Plugin](./Plugin.md)、[Manager](./Manager.md)、[Console](./Console.md)、[OBS 側のサーバーアクセス](../conventions/obs-server-access.md)
