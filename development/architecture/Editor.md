# Editor

## 役割

Generatorが使用する設定データをGUIで作成・編集するアプリケーションです。おみくじ、イベント、トリガー、キャラクター、UI、各種設定などを編集します。

## 起動と画面構成

- パッケージのエントリーポイント: `packages/common/OmikujiBot/editor.ts`
- アプリの切り替えを含むルート: `src/editor/App.vue`
- エディター画面: `src/editor/EditorApp.vue`
- データの中心Store: `src/editor/stores/useOmikujiStore.ts`
- UI編集機能の登録: `src/registerAll.ts` と `src/editor/ui/uiEditorRegistry.ts`

エディター用エントリーポイントはUI・レイアウト・ゲームスクリプトとエディター部品を登録し、OneSDKに依存しない `createAppNotOneSDK` で起動します。ルート画面ではエディターとGenerator表示を切り替えられます。

## データ管理

`useOmikujiStore` が設定データの状態を保持し、データ入出力、マージ、イベント・アセットのCRUD、並び替え、設定操作を組み合わせています。データ形式の検証・既定値補完は `src/types/OmikujiData/` のスキーマを基盤とします。

サーバー接続が利用できる場合は、設定データの読み込みやManager機能を利用できます。ローカルの `omikujiData.js` を読み込む経路もあります。

## UI編集

UIごとの編集画面・プレビュー・スロット編集画面は `registerUiEditor` で登録します。パッケージに含まれるUIに応じて登録内容を絞れる構成です。

関連: [Generator](./Generator.md)、[UI](./UI.md)、[Manager](./Manager.md)
