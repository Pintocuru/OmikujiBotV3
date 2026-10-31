# Generator

## 役割

配信中に動作するBOT本体です。設定データを読み込み、コメントやタイマーなどのイベントを処理し、条件に合ったおみくじ・ステップを実行してUIへメッセージを渡します。

## 起動と初期化

- パッケージのエントリーポイント: `packages/common/OmikujiBot/main.ts`
- アプリ本体: `src/generator/App.vue`
- OneSDKを利用する起動処理: `src/common/EntryCore/core.ts`
- 初期化: `src/generator/composables/useAppInitializer.ts`

パッケージ側で `registerAll()` を実行してUI・レイアウト・ゲームスクリプトなどを登録した後、`mountGenerator` からOneSDKの準備完了を待ってアプリをマウントします。

初期化ではコメント取得を開始し、サーバーから設定を同期します。設定が利用可能になると状態をreadyにし、タイマー・サービス・リアクション・ポン出しの各イベント処理を開始します。

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
