# Manager

## 役割

Managerは、設定ファイルや配信データをAPI経由で読み書きするクライアント側の機能です。

データの保存やAPIリクエストの実処理はServer側が担当し、ManagerはAPIサービスとPinia Storeを通じて利用します。

## 構成

- `src/manager/ManagerView.vue`: 上部バーの「開く」ボタン。サーバー接続時はManagerダイアログを遅延読み込みして表示し、未接続時はローカルの `omikujiData.js` を開く
- `src/manager/components/`: Managerダイアログなどの画面コンポーネント
- `src/manager/services/`: API通信サービス
  - `baseApiClient.ts`: 接続先の切り替え、共通HTTP通信、エラーハンドリング
  - `configApi.ts`、`generatorApi.ts`、`omikujiApi.ts` など: APIの用途ごとの操作
- `src/manager/stores/`: Pinia Storeと状態・操作の組み立て
  - `useManagerStore.ts`: 状態・ゲッター・アクションを統合するStore
  - `useManagerState.ts`: Managerの状態
  - `useManagerGetters.ts`: 状態から導出する値
  - `useManagerActions.ts`: Managerの操作
  - `useApiCore.ts`、`useApiFileActions.ts`、`useApiLoadActions.ts`、`useApiSaveActions.ts`: API操作の共通処理とファイル操作
- `src/manager/composables/`: Manager画面で利用する補助処理
- `src/manager/types/`: Manager固有の型

## API通信

API通信は `src/manager/services/` が担当します。各ドメインのAPIクラスは `BaseApiClient` を継承し、共通のGET/POST処理とレスポンス処理を利用します。

主なサービスは次のとおりです。

- `aiApi.ts`: AI設定・問い合わせ
- `bingoApi.ts`: ビンゴ
- `configApi.ts`: 設定ファイル
- `gameConfigApi.ts`、`gameStateApi.ts`: ゲーム設定・状態
- `generatorApi.ts`: Generator設定・パッケージ
- `omikujiApi.ts`: おみくじデータ
- `padApi.ts`: ポン出し
- `userStatsApi.ts`: ユーザー統計

接続先は次の2種類です。

- 本番環境: わんコメプラグインのREST API
- 開発環境: Express API

開発環境ではAPIモードを切り替えて接続先を変更できます。本番環境ではわんコメプラグインに接続します。

## 状態管理

Managerの状態・ゲッター・アクションはPinia Storeで管理します。

`useManagerStore` が `useManagerState`、`useManagerGetters`、`useManagerActions` を組み合わせます。APIを利用するファイル操作は、共通の非同期処理や読み込み・保存などの処理に分割されています。

## Serverとの関係

ManagerはAPIの呼び出し元であり、APIリクエストの受付やデータ処理・保存はServer側が担当します。

通信経路は次のようになります。

- 本番環境: Manager → わんコメプラグイン → Server
- 開発環境: Manager → Express API → Server

Server側のAPI処理や保存処理については [Server](./Server.md)、プラグインの役割については [Plugin](./Plugin.md) を参照してください。

関連: [Server](./Server.md)、[Plugin](./Plugin.md)、[Console](./Console.md)
