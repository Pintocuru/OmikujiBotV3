# Server

## 役割

ManagerやGenerator、LiveConsoleからのAPIリクエストを処理し、設定ファイル・ゲーム状態・ユーザー情報などを管理するサーバー側の共通処理です。

## 共通処理

- `server/api/actions.ts`: クライアントとサーバーが共有するAPIアクション定義
- `server/core/router.ts`: 共通ルーター
- `server/core/handlers/`: APIアクションごとの処理
- `server/core/services/`: ファイルシステムやユーザーリスト等のサービス
- `server/adapters/`: 呼び出し元ごとのリクエスト・レスポンス変換

共通ルーターは、呼び出し元に応じたコンテキストを受け取り、同じAPI処理を実行します。

## 本番: わんコメプラグイン

`src/plugin/plugin.ts` から `server/adapters/pluginAdapter.ts` を経由して共通ルーターを呼び出します。プラグイン用コンテキストを使って処理します。

## 開発: Express API

`npm run dev` は `server/start-dev-server.ts` を起動します。このスクリプトは開発用Express APIサーバーとVite開発サーバーを起動します。

Express側は `server/dev-api.ts` で起動し、`server/adapters/expressAdapter.ts` が共通ルーターへ接続します。開発環境ではわんコメがなくても動作確認できるよう、ダミーユーザーの投入など開発専用のAPIも許可されます。

## 保存データ

保存対象には設定ファイル、Generator設定、ゲームステート、ユーザー統計などがあります。具体的な保存先やファイル形式は各ハンドラー・サービスの実装を参照してください。

関連: [Plugin](./Plugin.md)、[Manager](./Manager.md)、[Console](./Console.md)
