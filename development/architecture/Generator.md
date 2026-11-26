# Generator

## 役割

配信中に動作するBOT本体です。設定データを読み込み、コメントやタイマーなどのイベントを処理し、条件に合ったおみくじ・ステップを実行してUIへメッセージを渡します。

## 起動と初期化

- パッケージのエントリーポイント: `packages/common/OmikujiBot/main.ts`
- アプリ本体: `src/generator/App.vue`
- OneSDKを利用する起動処理: `src/common/EntryCore/core.ts`
- 初期化: `src/generator/composables/useAppInitializer.ts`

`packages/common/OmikujiBot/main.ts` は起動時に `registerMain()` を呼び出し、リリース対象のUI・レイアウト・コンポーネント・ゲームスクリプトを登録します。`mountGenerator()` は `createAppOneSDK()` を呼び、OneSDKの `ready()` 完了後に `App.vue` をマウントします。

`useAppInitializer` は初期化中にコメント取得を開始します。初回コメントの受信後、サーバーからGenerator設定を同期し、ユーザー統計のポーリングを開始してから状態を `ready` にします。初回ロード時のコメントは統計に記録しますが、コメントイベントへの応答は行いません。

## イベント処理

主な実装:

- `src/generator/scripts/EventProcess/`: コメント、タイマー、サービス、リアクション、パッド等のイベント処理
- `src/generator/scripts/trigger/TriggerChecker.ts`: 複合トリガー条件の判定
- `src/engine/DrawOmikuji/`: おみくじ抽選
- `src/engine/`: ステップやプレースホルダー等の実行基盤

コメントイベントでは、有効なルールを順番に確認し、トリガー条件を満たした場合におみくじアイテムを抽選します。通常のステップ実行対象であれば、ステップを処理してBOTメッセージを生成します。

## UI表示

`src/generator/App.vue` は設定されたUIをUI Registryから解決して表示します。レイアウトが指定されている場合はレイアウトを優先します。ビルドに登録されていないUI・レイアウト・ゲームスクリプトがデータに含まれる場合は、不一致として通知します。

関連: [UI](./UI.md)、[Games](./Games.md)、[Manager](./Manager.md)
