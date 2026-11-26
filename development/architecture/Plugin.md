# Plugin

## 役割

わんコメに読み込ませるOmikujiBot専用プラグインです。OneSDKのプラグインインターフェースを実装し、次の役割を受け持ちます。

- わんコメのコメントをOmikujiBot用のコメント型に変換し、コメント由来のユーザーを記録する
- サーバーAPI(データ管理API)の本番側の受付

おみくじのトリガー判定や実行はGenerator側の責務です。

## エントリーポイントと登録

- 実装: `src/plugin/plugin.ts`
- コメント変換: `src/sdk/subscribe/OmikenComment/OmikenCommentProcessor.ts`
- ビルド設定: `tools/viteConfig/vite.botPlugin.config.ts`
- ビルドコマンド: `npm run build:plugin`

プラグインは `OnePlugin` として名前・UID・バージョン・権限(`filter.comment` / `clear`)などを定義し、初期化、コメントフィルター、購読イベント、リクエスト、終了処理を提供します。

## コメント処理とユーザーリスト

- `filterComment` でコメントを受け取り、`processOmikenComment` でOmikujiBot用の `OmikenCommentType` に変換します。変換できないコメントはユーザーリストへの記録対象になりません。
- 変換できたコメントの投稿者を、サーバーのユーザーリスト(`userListService`)に記録します。おみくじが反応したかどうかは記録条件ではありません。このリストはLiveConsoleのユーザー一覧で使われます。
- コメント自体は加工せず、そのまま返します。
- わんコメの「クリア」購読(`clear`)で、コメント由来のユーザーだけを空にします。手動で追加したユーザーや手動の操作結果は残します。

## API連携

`request` は `pluginRequest` に処理を委譲します。プラグイン用アダプターはOneSDKのリクエストを共通リクエスト形式へ変換し、`server/core/router.ts` に渡します。

本番環境では、OBS側(Generator・UI)とブラウザ側(LiveConsole)のデータ管理APIの接続先がこのプラグインです。LiveConsoleからはAxios経由のHTTPリクエストとして届きます。開発時には同じルーターをExpressアダプターから利用できます。

関連: [Manager](./Manager.md)、[Server](./Server.md)、[Console](./Console.md)
