# Plugin

## 役割

わんコメに読み込ませるOmikujiBot専用プラグインです。OneSDKのプラグインインターフェースを実装し、コメント処理やサーバーAPIへのリクエストを受け持ちます。

## エントリーポイントと登録

- 実装: `src/plugin/plugin.ts`
- ビルド設定: `tools/viteConfig/vite.botPlugin.config.ts`
- ビルドコマンド: `npm run build:plugin`

プラグインは `OnePlugin` として名前・UID・バージョン・権限などを定義し、初期化、コメントフィルター、購読イベント、リクエスト、終了処理を提供します。

## API連携

`request` は `pluginRequest` に処理を委譲します。プラグイン用アダプターはOneSDKのリクエストを共通リクエスト形式へ変換し、`server/core/router.ts` に渡します。

プラグインはデータ管理APIの本番側の接続先です。開発時には同じルーターをExpressアダプターから利用できます。

関連: [Manager](./Manager.md)、[Server](./Server.md)
