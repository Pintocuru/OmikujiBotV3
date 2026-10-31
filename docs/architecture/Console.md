# Console

## 役割

配信中の状態やデータをブラウザから確認・操作するLiveConsoleです。現在の画面は、ポン出し、ユーザー操作、ゲームの記録で構成されています。

## 構成

- 画面: `src/console/LiveConsole.vue`
- エントリーポイント: `src/console/main.ts`
- `src/console/pads/`: ポン出し操作
- `src/console/users/`: ユーザー一覧・ユーザー操作
- `src/console/games/`: ゲームログやランキング等の閲覧
- `tools/viteConfig/vite.console.config.ts`: Vite設定

LiveConsoleはURLのハッシュに選択中の画面を保存し、再読み込み後も同じ画面を開けるようにしています。

## サーバーとの連携

設定・ユーザー統計・ゲーム状態などのデータ操作はManagerのAPIサービスを通じてサーバーへ送信します。サーバーにはわんコメプラグイン、または開発用Express APIが必要です。

パッケージにConsoleを含めるかどうかは、パッケージプロジェクトの `withConsole` 設定で制御されます。

関連: [Manager](./Manager.md)、[Server](./Server.md)、[Packages](./Packages.md)
