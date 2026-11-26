# Server

## 役割

Manager、Generator、LiveConsoleからのAPIリクエストを処理し、設定ファイル・ゲーム状態・ユーザー情報などを管理するサーバー側の共通処理です。

## 共通処理

- `server/api/actions.ts`: クライアントとサーバーが共有するAPIアクション定義
- `server/core/router.ts`: 共通ルーター
- `server/core/handlers/`: APIアクションごとの処理
- `server/core/services/`: ファイルシステムやコメントユーザーリスト等のサービス
- `server/adapters/`: 呼び出し元ごとのリクエスト・レスポンス変換

共通ルーターは、呼び出し元に応じたコンテキストを受け取り、同じAPI処理を実行します。

### ハンドラー

| ハンドラー | 役割 |
| --- | --- |
| `configHandler` | 設定ファイルの読み書き・移動・削除 |
| `generatorHandler` | Generator設定・パッケージの読み書き |
| `omikujiHandler` | おみくじデータの保存 |
| `gameStateHandler` | ゲームログ・ゲームステートの記録と取得 |
| `userStatsHandler` | ユーザーの操作結果(得点・チーム・タグ・バッジ・表示順など)と手動ユーザーの管理、LiveConsole用ユーザー一覧の構築 |
| `padHandler` | ポン出し(EventPads)の状態と操作 |
| `bingoHandler` / `bingoPatternHandler` | ビンゴの進行(LiverBingoとの同期)と保存パターンの管理 |
| `gameConfigHandler` | ブラウザゲームごとの設定ファイルの読み書き |
| `aiHandler` | AI設定の保存と問い合わせ(WordAlchemyなどで使用) |

### サービス

- `fileSystemService` / `directoryService`: ファイルの読み書きと保存先の管理
- `userListService`: プラグインが受け取ったコメント由来ユーザーの記録・取得・リセット。メモリ上で管理する
- `aiService`: AI問い合わせの本体

ユーザー情報は、コメント由来ユーザーを `userListService` が管理し、得点などの操作結果や手動ユーザーを `userStatsHandler` がファイルに保存します。LiveConsole用の一覧は両者の情報を組み合わせて構築します。

## 本番: わんコメプラグイン

`src/plugin/plugin.ts` から `server/adapters/pluginAdapter.ts` を経由して共通ルーターを呼び出します。プラグイン用コンテキストを使って処理します。

LiveConsoleはブラウザページのため、Axios経由のHTTPリクエストとしてわんコメに届き、プラグインが受け取ります。

## 開発: Express API

`npm run dev` は `server/start-dev-server.ts` を起動します。このスクリプトは開発用Express APIサーバーとVite開発サーバーを起動します。

Express側は `server/dev-api.ts` で起動し、`server/adapters/expressAdapter.ts` が共通ルーターへ接続します。開発環境ではわんコメがなくても動作確認できるよう、ダミーユーザーの投入など開発専用のAPI(`seed-mock-users`)も許可されます。これらの開発専用アクションはExpressコンテキスト(`allowMock`)でのみ有効で、プラグイン経由では存在しないアクションとして扱われます。

開発用APIサーバーはlocalonlyです。`localhost`以外のHost / Originからのリクエストを403にします(他サイトからのfetchやDNSリバインディング対策)。

## 保存データとメモリ上の状態

設定ファイル、Generator設定、おみくじデータ、ゲームログ・ゲームステート、ユーザー操作結果、ポン出しの状態、ビンゴパターン、ゲームごとの設定、AI設定などをファイルに保存します。具体的な保存先やファイル形式は各ハンドラー・サービスの実装を参照してください。

一方、`bingoHandler` が保持するビンゴ命令キューとカードのスナップショットはメモリ上の状態であり、サーバー再起動時に失われます。ビンゴパターンは別の `bingoPatternHandler` がファイルに保存します。また、コメント由来ユーザーの一覧も `userListService` がメモリ上で管理します。

関連: [Plugin](./Plugin.md)、[Manager](./Manager.md)、[Console](./Console.md)、[OBS側のサーバーアクセス](../conventions/obs-server-access.md)
