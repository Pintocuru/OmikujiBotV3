# Manager

## 役割

Editorから利用するデータ管理機能です。

サーバーAPIを通じて設定ファイルや配信データなどを読み書きし、Editor側の状態管理と操作を担当します。

Managerはデータの永続化やAPI処理本体を担当しません。それらはServerが担当し、ManagerはAPIクライアントを通じて利用します。

## 構成

- `src/manager/ManagerView.vue`: 保存データを開くためのボタンとダイアログの表示管理
- `src/manager/services/`: APIクライアント
  - `baseApiClient.ts`: API接続先、共通通信処理、エラーハンドリング
  - その他のファイル: ドメイン別のAPI操作
- `src/manager/stores/`: Piniaによる状態管理と操作
  - `useManagerStore.ts`: Manager全体のStore
  - `useManagerState.ts`: 管理状態
  - `useManagerActions.ts`: ファイル操作・保存・読み込みなどのアクション
  - `useManagerGetters.ts`: 状態から導出する値
- `src/manager/composables/`: Manager関連の補助処理
- `src/manager/types/`: Manager固有の型

## API通信

API通信は `src/manager/services/` が担当します。

`BaseApiClient` を基盤として、ドメイン別のAPIクラスが各種操作を提供します。

主なAPIの対象は次のとおりです。

- 設定ファイル
- Generator設定・パッケージ
- おみくじデータ
- ゲームログ・ゲームステート
- ユーザー統計・ユーザーリスト
- ポン出しの状態・操作
- ビンゴの進行・パターン
- ブラウザゲームの設定
- AI設定・問い合わせ

APIの接続先は次の2種類です。

- 本番環境: わんコメプラグイン(Rest API)
- 開発環境: Express API

開発環境では接続先を切り替えて動作確認できます。本番環境ではわんコメプラグインを使用します。

## 状態管理

Managerの画面状態や操作はPinia Storeで管理します。

`useManagerStore` を入口として、状態・アクション・ゲッターを分離しています。

API通信とEditor側の状態管理を分離し、Storeから各APIサービスを利用する構成です。

## Serverとの関係

ManagerはAPIの呼び出し元であり、データ管理の実処理はServerに委譲します。

通信経路は次のようになります。

- 本番環境: Manager → わんコメプラグイン → Server
- 開発環境: Manager → Express API → Server

本番環境では、わんコメプラグインがAPIリクエストを受け付けます。開発環境ではExpress APIが同じ共通処理へ接続します。

Server側のAPI処理や保存処理については [Server](./Server.md)、プラグインの役割については [Plugin](./Plugin.md) を参照してください。

関連: [Server](./Server.md)、[Plugin](./Plugin.md)、[Console](./Console.md)
