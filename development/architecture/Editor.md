# Editor

## 役割

Generatorが使用する設定データをGUIで作成・編集するアプリケーションです。おみくじ、イベント、トリガー、キャラクター、UI、各種設定などを編集します。

## 起動と画面構成

- 開発用エントリーポイント: `src/main.ts`
- パッケージのエントリーポイント: `packages/common/OmikujiBot/editor.ts`
- アプリの切り替えを含むルート: `src/editor/App.vue`
- エディター画面: `src/editor/EditorApp.vue`
- データの中心Store: `src/editor/stores/useOmikujiStore.ts`
- UI編集機能の登録: `src/register/registerUiEditor.ts`、レジストリ: `src/editor/ui/uiEditorRegistry.ts`

開発用の `src/main.ts` は `registerAll()` で全機能を登録してから、`createAppNotOneSDK()` で `App.vue` を起動します。

パッケージ用の `packages/common/OmikujiBot/editor.ts` は、`registerMain()` と `registerEditor()` を実行して必要な機能を登録します。その後、`window.OmikujiBot.mountEditor` を公開し、呼び出し時に `createAppNotOneSDK()` でEditorを起動します。

ルートの `App.vue` はEditor画面とGenerator表示を切り替えます。Generator表示は初回表示時に遅延ロードされます。実際の編集画面は `EditorApp.vue` で、ナビゲーションに応じてトップページや各編集画面を表示します。

## データ管理

`useOmikujiStore` が設定データの状態を保持します。データ入出力、マージ、イベント・アセットのCRUD、プロパティ操作、並び替え、設定操作は、それぞれのcomposableに分割してStoreから組み立てています。

データ形式の検証・既定値補完は `src/types/OmikujiData/` のスキーマを基盤とします。

`EditorApp.vue` ではサーバーの接続状態を確認し、利用できる場合はGenerator設定を読み込みます。読み込みできない場合はローカルの `omikujiData.js` を開きます。

## UI編集

UIごとの編集画面・プレビュー・スロット編集画面は `registerUiEditor` で登録します。開発用登録は `src/register/registerUiEditor.ts` にあり、`Record<UiKind, EditorDef>` によってUI種別ごとの登録漏れを型で検出します。

パッケージ用の登録は `packages/common/OmikujiBot/register.ts` の `registerEditor()` が担当し、配布対象のUIに必要な編集機能だけを登録します。

関連: [Generator](./Generator.md)、[UI](./UI.md)、[Manager](./Manager.md)
