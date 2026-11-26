# Plugin

## 役割

わんコメに読み込ませるOmikujiBot専用プラグインです。OneSDKのプラグインインターフェースを実装し、次の役割を受け持ちます。

- コメント処理(おみくじの反応判定と、コメントユーザーの記録)
- サーバーAPI(データ管理API)の本番側の受付

## エントリーポイントと登録

- 実装: `src/plugin/plugin.ts`
- ビルド設定: `tools/viteConfig/vite.botPlugin.config.ts`
- ビルドコマンド: `npm run build:plugin`

プラグインは `OnePlugin` として名前・UID・バージョン・権限(`filter.comment` / `clear`)などを定義し、初期化、コメントフィルター、購読イベント、リクエスト、終了処理を提供します。

## コメント処理とユーザーリスト

- `filterComment` でコメントを受け取り、おみくじの反応判定(`processOmikenComment`)を行います。コメント自体はそのまま返します。
- 反応したコメントがあれば、コメントしたユーザーをサーバーのユーザーリスト(`userListService`)に記録します。このリストは LiveConsole のユーザー一覧で使われます。
- わんコメの「クリア」購読(`clear`)で、コメント由来のユーザーだけを空にします。手動の操作結果・手動ユーザーは残します。

## API連携

`request` は `pluginRequest` に処理を委譲します。プラグイン用アダプターはOneSDKのリクエストを共通リクエスト形式へ変換し、`server/core/router.ts` に渡します。

本番環境では、OBS側(Generator・UI)とブラウザ側(LiveConsole)のデータ管理APIの接続先がこのプラグインです。LiveConsoleからは Axios 経由の HTTP リクエストとして届きます。開発時には同じルーターをExpressアダプターから利用できます。

関連: [Manager](./Manager.md)、[Server](./Server.md)、[Console](./Console.md)
