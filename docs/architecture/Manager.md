# Manager

## 役割

EditorとGeneratorが利用する設定ファイルや、配信中のゲーム状態・ユーザー操作データなどをサーバー経由で管理する機能です。

## 構成

- `src/manager/ManagerView.vue`: Editor内の管理画面
- `src/manager/services/`: APIクライアント
- `src/manager/stores/`: 接続状態や管理画面の状態・操作
- `src/manager/types/`: Manager固有の型
- `server/api/actions.ts`: クライアントとサーバーで共有するAPIアクション定義

## 通信

`BaseApiClient` がAPI接続先と共通処理を管理します。開発時はExpress API、本番環境ではわんコメプラグインを接続先として利用します。開発時にはAPIモードを切り替えられます。

ドメイン別のAPIサービスには、設定ファイル、Generator設定、ゲームステート、ユーザー統計、パッド状態などがあります。APIの処理本体は `server/core/` にあります。

## データの扱い

ManagerはEditorの設定データを保存・読み込みするほか、LiveConsoleから更新されたユーザー操作値をGeneratorへ同期する用途にも使われます。ゲームログや配信単位のゲームステートもサーバーAPIを通じて扱います。

関連: [Plugin](./Plugin.md)、[Server](./Server.md)、[Console](./Console.md)
